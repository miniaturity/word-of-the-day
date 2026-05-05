<script lang="ts">
    import Wordcard from "$lib/components/wordcard.svelte";
    import { Word } from "$lib/types";



    // TESTING VARIABLES
    const user = "miniaturity";
    const bg = "#ff3381";
    const date = "05/03/26"

    const words: Word[] = [new Word("dragoning"), 
        new Word("crypt"),
        new Word("class"),
        new Word("ae")
    ] 

    const props = {
        user,
        date
    }
</script>

<div class="cards">
    {#each words as word}
        <Wordcard {...props} {word} />
    {/each}
</div>

<style lang="scss">
    :global(body) {
        padding: 0; margin: var(--margin);
        width: 100vw; height: 100vh;

        background-color: var(--bg);

        display: flex;
        align-items: center;
        justify-content: center;
        overflow-x: hidden;
    }

    .cards {
        display: flex;
        flex-direction: row;
        gap: 12px;
    }
</style>