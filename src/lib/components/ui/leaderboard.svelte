<script lang="ts">
    import { getHighestScoringWordToday } from "$lib/data/fetchWord";
    import type { WordCardData } from "$lib/data/fetchWord";
    import { onMount } from "svelte";
    import Wordcard from "../card/wordcard.svelte";

    let best = $state<WordCardData | null>(null);

    onMount(async () => {
        best = await getHighestScoringWordToday();
    })
</script>

<div class="leaderboard">

    <div class="lb-card">
        {#if best}
            <Wordcard 
                word={best.word}
                user={best.user}
                date={best.date}
            />
        {/if}
    </div>
    <div class="lb-desc">
        {#if best}
            <header class="lb-head">
                todays best word, rolled by <strong>{best.user}</strong>!
            </header>
        {:else}
            <header class="lb-head">
                no best word today yet. you could be on here!
            </header>
        {/if}
    </div>
</div>

<style lang="scss">
    .leaderboard {
        margin-top: calc(var(--margin) * 2);
        padding: var(--margin);
        border: var(--border);
        background-color: var(--bg-l);
        font-family: "Geist";
    }

    .lb-card {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 12px 0;
    }
</style>