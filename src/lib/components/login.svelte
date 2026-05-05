<script lang="ts">
    import { supabase } from "$lib/supabase";

    let email = $state<string>("");
    let status = $state<"idle" | "loading" | "sent" | "error" | "no-user">("idle");
    let errorMsg = $state<string>("");

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
            options: {
                emailRedirectTo: window.location.origin
            }
        });

        if (error) {
            status = "error";
            errorMsg = error.message.toLowerCase();
        } else {
            status = "sent";
        }
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
            {#if status !== "sent" && status !== "no-user"}
                <p class="prompt-label">sign in to track your words! or continue without an account - you will not have access to cards.</p>

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

                    <button 
                        class="continue-btn"
                        onclick={() => status = "no-user"}
                    >
                        continue
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