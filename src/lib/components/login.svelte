<script lang="ts">
    import { supabase } from "$lib/supabase";
    import type { User } from "@supabase/supabase-js";
 
    let {
        oncontinue,
        oncomplete,
    }: {
        oncontinue?: () => void;
        oncomplete?: (user: User) => void;
    } = $props();
 
    let email = $state("");
    let username = $state("");
    let usernameError = $state("");
    let status = $state<"idle" | "loading" | "sent" | "checking" | "new-user" | "error">("idle");
    let errorMsg = $state("");
    let pendingUser = $state<User | null>(null);
 
    async function handleSignedIn(user: User) {
        if (status === "checking" || status === "new-user") return;
        status = "checking";
 
        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .single();
 
        if (profile) {
            oncomplete?.(user);
        } else {
            pendingUser = user;
            status = "new-user";
        }
    }
 
    $effect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) handleSignedIn(session.user);
        });
 
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                handleSignedIn(session.user);
            }
        });
 
        return () => subscription.unsubscribe();
    });
 
    async function sendMagicLink() {
        if (!email || !email.includes("@")) {
            errorMsg = "enter a valid email.";
            status = "error";
            return;
        }
 
        status = "loading";
        errorMsg = "";
 
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: window.location.origin }
        });
 
        if (error) {
            status = "error";
            errorMsg = error.message.toLowerCase();
        } else {
            status = "sent";
        }
    }
 
    async function submitUsername() {
        usernameError = "";
 
        if (username.length < 2) {
            usernameError = "at least 2 characters required.";
            return;
        }
        if (username.length > 15) {
            usernameError = "max 15 characters.";
            return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            usernameError = "letters, numbers, and underscores only.";
            return;
        }
 
        const { error } = await supabase
            .from("profiles")
            .insert({ id: pendingUser!.id, username, email: pendingUser!.email, created_at: new Date().toISOString() });
 
        if (error) {
            usernameError = error.code === "23505"
                ? "username already taken."
                : error.message.toLowerCase();
            return;
        }
 
        oncomplete?.(pendingUser!);
    }
 
    function reset() {
        status = "idle";
        email = "";
        errorMsg = "";
    }
</script>

<div class="login-overlay">
    <div class="login-card">

        <div class="card-header">
            <span class="header-text">word-of-the-day</span>
        </div>

        <div class="card-body">
            {#if status === "checking"}
                <div class="checking-state">
                    <span class="loading-dots">checking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>
                </div>
 
            {:else if status === "new-user"}
                <p class="prompt-label">pick a username to get started. letters, numbers, and underscores only.</p>
 
                <div class="input-row" class:error-border={!!usernameError}>
                    <label class="input-label" for="username">user_</label>
                    <input
                        id="username"
                        class="email-input"
                        class:error={!!usernameError}
                        type="text"
                        placeholder="your_username"
                        maxlength={15}
                        bind:value={username}
                        onkeydown={(e) => e.key === "Enter" && submitUsername()}
                    />
                </div>
 
                <p class="char-count" class:near-limit={username.length > 15}>
                    {username.length} / 15
                </p>
 
                {#if usernameError}
                    <div class="error-row">
                        <span class="error-prefix">!</span>
                        <span class="error-text">{usernameError}</span>
                    </div>
                {/if}
 
                <button class="submit-btn" onclick={submitUsername}>
                    confirm →
                </button>
 
            {:else if status !== "sent"}
                <p class="prompt-label">sign in to track your words! or continue without an account — you will not have access to cards.</p>
 
                <div class="input-row">
                    <label class="input-label" for="email">email_</label>
                    <input
                        id="email"
                        class="email-input"
                        class:error={status === "error"}
                        type="email"
                        placeholder="you@example.com"
                        bind:value={email}
                        onkeydown={(e) => e.key === "Enter" && sendMagicLink()}
                        disabled={status === "loading"}
                    />
                </div>
 
                {#if status === "error"}
                    <div class="error-row">
                        <span class="error-prefix">!</span>
                        <span class="error-text">{errorMsg}</span>
                    </div>
                {/if}
 
                <div class="buttons">
                    <button
                        class="submit-btn"
                        class:loading={status === "loading"}
                        onclick={sendMagicLink}
                        disabled={status === "loading"}
                    >
                        {#if status === "loading"}
                            <span class="loading-dots">sending<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></span>
                        {:else}
                            send magic link →
                        {/if}
                    </button>
 
                    <button class="continue-btn" onclick={() => oncontinue?.()}>
                        continue as guest
                    </button>
                </div>
 
                <p class="fine-print">no password needed. we'll email you a login link.</p>
 
            {:else if status === "sent"}
                <div class="sent-state">
                    <div class="sent-icon">✉</div>
                    <p class="sent-title">check your inbox</p>
                    <p class="sent-sub">a login link was sent to <strong>{email}</strong></p>
                    <button class="reset-btn" onclick={reset}>← use a different email</button>
                </div>
            {/if}
        </div>

    </div>
</div>

<style lang="scss">
    @property --rotation {
        syntax: "<angle>";
        inherits: false;
        initial-value: 0deg;
    }

    @keyframes rotate {
        to { --rotation: 360deg; }
    }

    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }

    @keyframes dot-wave {
        0%, 80%, 100% { opacity: 0; }
        40% { opacity: 1; }
    }

    @keyframes fadein {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .char-count {
        font-family: "GeistMono";
    }

    .login-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 252, 242, 0.7);
        backdrop-filter: blur(4px);
        z-index: 100;
    }

    .login-card {
        position: relative;
        width: clamp(280px, 90vw, 440px);
        background-color: var(--bg-l, #fffdf6);
        border: var(--border, 2px solid #1e1e1e);
        animation: fadein 0.3s ease-out;

        &::before {
            content: "";
            display: block;
            background: conic-gradient(from var(--rotation), #5273de, #8f52de, #deb652, #52fdbb, #5273de);
            filter: blur(22px);
            opacity: 0.45;
            position: absolute;
            inset: -8px;
            z-index: -1;
            animation: rotate 5s linear infinite;
            pointer-events: none;
        }

        &:hover::before {
            opacity: 0.75;
        }
    }

    .card-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
        padding: 10px 12px;
        border-bottom: var(--border, 2px solid #1e1e1e);
        background-color: var(--bg, #fffcf2);
    }


    .header-text {
        font-family: "GeistPixel", monospace;
        font-size: 1rem;
        letter-spacing: 0.05em;
        flex: 1;
        text-align: center;
    }

    .card-body {
        padding: 20px 16px 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .prompt-label {
        font-family: "GeistMono", monospace;
        font-size: 0.75rem;
        opacity: 0.5;
        margin: 0;
    }

    .input-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        border: var(--border, 2px solid #1e1e1e);
    }

    .input-label {
        font-family: "GeistMono", monospace;
        font-size: 0.85rem;
        padding: 8px 10px;
        border-right: var(--border, 2px solid #1e1e1e);
        white-space: nowrap;
        background-color: var(--bg, #fffcf2);
    }

    .email-input {
        flex: 1;
        font-family: "GeistMono", monospace;
        font-size: 0.85rem;
        padding: 8px 10px;
        border: none;
        outline: none;
        background: transparent;
        color: inherit;
        width: 0; 

        &::placeholder {
            opacity: 0.3;
        }

        &.error {
            background: color-mix(in srgb, #ff3e00 6%, transparent);
        }

        &:disabled {
            opacity: 0.5;
        }
    }

    .error-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        font-family: "GeistMono", monospace;
        font-size: 0.78rem;
    }

    .error-prefix {
        background: #ff3e00;
        color: #fff;
        padding: 0 5px;
        font-weight: bold;
    }

    .error-text {
        color: #ff3e00;
    }

    .buttons {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    .submit-btn {
        font-family: "GeistMono", monospace;
        font-size: 0.9rem;
        padding: 10px 14px;
        border: var(--border, 2px solid #1e1e1e);
        background-color: #1e1e1e;
        color: var(--bg, #fffcf2);
        cursor: pointer;
        text-align: left;
        transition: background 0.15s, color 0.15s;
        flex-grow: 1;

        &:hover:not(:disabled) {
            background-color: var(--bg, #fffcf2);
            color: #1e1e1e;
        }

        &:disabled {
            cursor: default;
            opacity: 0.7;
        }

        &.loading {
            pointer-events: none;
        }
    }

    .continue-btn {
        font-family: "GeistMono", monospace;
        font-size: 0.9rem;
        padding: 10px 14px;
        border: var(--border, 2px solid #1e1e1e);
        background-color: #1e1e1e;
        color: var(--bg, #fffcf2);
        cursor: pointer;
        text-align: left;
        transition: background 0.15s, color 0.15s;
        flex-grow: 1;

        &:hover:not(:disabled) {
            background-color: var(--bg, #fffcf2);
            color: #1e1e1e;
        }

        &:disabled {
            cursor: default;
            opacity: 0.7;
        }

    }

    .loading-dots {
        display: inline-flex;
        align-items: center;
    }

    .dot {
        animation: dot-wave 1.4s ease-in-out infinite;

        &:nth-child(1) { animation-delay: 0s; }
        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
    }

    .fine-print {
        font-family: "GeistMono", monospace;
        font-size: 0.68rem;
        opacity: 0.35;
        margin: 0;
    }

    /* sent state */
    .sent-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 12px 0;
        text-align: center;
    }

    .sent-icon {
        font-size: 2rem;
        border: var(--border, 2px solid #1e1e1e);
        padding: 8px 14px;
        background-color: var(--bg, #fffcf2);
    }

    .sent-title {
        font-family: "GeistPixel", monospace;
        font-size: 1.1rem;
        margin: 0;
    }

    .sent-sub {
        font-family: "GeistMono", monospace;
        font-size: 0.78rem;
        opacity: 0.6;
        margin: 0;

        strong {
            opacity: 1;
            color: #1e1e1e;
        }
    }

    .reset-btn {
        font-family: "GeistMono", monospace;
        font-size: 0.78rem;
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0.45;
        padding: 4px 0;
        text-decoration: underline;
        text-underline-offset: 3px;

        &:hover { opacity: 0.8; }
    }
</style>