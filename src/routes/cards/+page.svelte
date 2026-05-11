<script lang="ts">
    import { goto } from "$app/navigation";
    import Wordcard from "$lib/components/wordcard.svelte";
    import { getUsername, getUserWords, type WordHistory } from "$lib/data/wordHistory";
    import { supabase } from "$lib/supabase";
    import { Word } from "$lib/types";
    import type { User } from "@supabase/supabase-js";
    import { onMount } from "svelte";

    let loaded = $state<boolean>(false);
    let user = $state<User | null>(null);
    let username = $state<string | null>(null);

    let wordhistory = $state<WordHistory[] | null>(null);

    onMount(async () => {
        const { data } = await supabase.auth.getUser();
        const authUser = data.user;

        if (!authUser) {
            goto("/");
            return;
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", authUser.id)
            .single();

        if (!profile) {
            goto("/");
            return;
        }

        user = authUser;
        wordhistory = await getUserWords(authUser.id);
        username = await getUsername(authUser.id);
        loaded = true;
    });


    
</script>

<div class="cards">
    <div class="card-grid">
        {#each wordhistory as card, i}
            <Wordcard 
                word={new Word(card.word, card.color)}
                user={username || "err"}
                date={new Date(card.generated_at)}
            />
        {/each}
    </div>

    <div class="card-inspector">

    </div>
</div>

<style lang="scss">
    @use "sass:list";

    :global(body) {
        padding: 0; margin: var(--margin);
        width: 100vw; height: 100vh;

        background-color: var(--bg);

        display: flex;
        overflow-x: hidden;
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

    .card-grid {
        display: flex;
        flex-direction: row;
        gap: 12px;
        flex-grow: 1;

    }

    .cards {
        display: flex;
        flex-direction: row;
        gap: 12px;
        flex-grow: 1;
    }
</style>