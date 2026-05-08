<script lang="ts">
    import type { User } from "@supabase/supabase-js";
    
    let {
        username,
        user,
        login,
        logout,
    }: {
        username: string | null,
        user: User | null;
        login: () => void;
        logout: () => void;
    } = $props();

    let confirmingLogout = $state<boolean>(false);

    function onclick() {
        if (!user) {
            login();
            return;
        }

        if (!confirmingLogout) {
            confirmingLogout = true;
            setTimeout(() => confirmingLogout = false, 1000);
            return;
        }

        logout();
        confirmingLogout = false;
    }
</script>


<div class="header">
    <a href="/" class="h-title">
        word-of-the-day
    </a>

    <div class="h-nav">
        <a href="/cards" class="h-cards">
            {"[collection]"}  
        </a>
        <button class="h-username" onclick={onclick}>
            <span class={`hu-user ${confirmingLogout && "hidden"}`}>{username ? `[${username}]` : "[log in]"}</span>
            <span class={`hu-confirm ${confirmingLogout && "confirming"}`} >{"{logout}"}</span>
        </button>
    </div>
</div>

<style lang="scss">
    @use "sass:list";

    $phone-width: 480px;
    @mixin phone() {
        @media (max-width: $phone-width) {
            @content;
        }
    } 

    .hidden {
        visibility: hidden;
    }

    .hu-confirm {
        position: absolute;
        top: 0; left: 0;
        height: 100%;
        display: none;

        background-color: rgba(255, 255, 255, 0.3); 
        backdrop-filter: blur(10px);               
        -webkit-backdrop-filter: blur(10px);   
        
        
        &.confirming {
            display: flex;
            justify-content: center;
        }
    }

    @property --rotation {
        syntax: "<angle>";
        inherits: false;
        initial-value: 0deg;
    }

    @keyframes rotate {
        to {
            --rotation: 360deg;
        }
    }

    @mixin backlight($selector, $colors...) {
        $gradient-colors: if(sass(list.length($colors) > 0): $colors; else: (purple, blue, green, yellow, orange, red));
        
        #{$selector} {
            position: relative;
            
            &:before {
                content: "";
                display: block;
                background: conic-gradient(from var(--rotation), $gradient-colors...);
                filter: blur(20px);
                opacity: 0.5;
                position: absolute;
                inset: -4px;
                z-index: -2;
                animation: rotate 5s linear infinite;
                transition: all 0.3s ease-in-out;
            }
        }
    }

    @include backlight(".header");
    
 

    .header {
        position: absolute;
        top: 0;
        left: 0;

        display: flex;
        flex-direction: row;
        justify-content: space-between;

        width: 100vw;
        border-bottom: var(--border);
        font-size: 1.6rem;
        height: fit-content;


        background-color: var(--bg-l);
    }
    
    .h-nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-family: "Geist";
        padding: 8px;
        gap: 16px;

        & a {
            text-decoration: none;
            color: #000;
        }

        @include phone {
            width: 100%;    
            justify-content: space-between;
        }
    }    

    .h-title {
        font-family: "GeistPixel";
        padding: 8px;

        text-decoration: none;
        color: #000;

        @include phone {
            display: none;
        }
    }

    .h-username {
        position: relative;
        display: flex;
        background-color: transparent;
        border: none;

        cursor: pointer;
        color: #000;
        font-size: inherit;

       
    }

</style>