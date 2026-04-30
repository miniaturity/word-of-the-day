<script lang="ts">
    import { flip } from "svelte/animate";
    import { tick } from "svelte";
    import PropertyCard from "$lib/components/propertycard.svelte";
    import type { Property, Rarity } from "$lib/types";
    import { RARITY_COLOR, Word } from "$lib/types";

    const WORD_GENERATE_TIME = 1000;

    let word = $state<Word>();
    let score = $derived(word?.getScore());
    let properties = $state<Property[]>([]);
    let visibleProperties = $state<Property[]>([]);

    let generated = $state<boolean>(false);
    let generating = $state<boolean>(false);

    let propertiesGenerated = $state<boolean>(false);
    
    // generating anim
    let wordBackdrop = $state<string>("");
    let generatedWord = $state<string>("");
    let generationIndex = $state<number>(0);

    

    

    function randomizeBackdrop() {
        if (!word || !generating) return;


    }

    async function generateWord() {
        if (generated) return;

        word = new Word();

        const props = word.getProperties();

        properties = props.sort((a, b) => a.score - b.score);
        visibleProperties = [];

        generating = true;

        await tick();

        generateAnim();
    }

    function revealProperties() {
        let i = 0;

        function step() {
            if (i >= properties.length) { 
                propertiesGenerated = true;
                return; 
            }

            visibleProperties = [properties[i], ...visibleProperties];

            i++;
            setTimeout(step, 1000); 
        }

        step();
    }

    function generateAnim() {
        if (!word) return;

        if (generationIndex == word.getWord().length) { 
            setTimeout(revealProperties, 1000);
            generating = false;
            generated = true;
            return; 
        }
        
        generatedWord += word.getWord()[generationIndex];
        generationIndex++;
        setTimeout(generateAnim, WORD_GENERATE_TIME / word.getWord().length);
    }

    function getWordRarityScore(): Rarity | undefined {
        if (!score) return;
        if (score <= 500) return "ordinary";
        
        return "extraordinary";
    }

</script>

<div class="page" style={`--score-rarity: ${RARITY_COLOR[getWordRarityScore() || "ordinary"][0]}`}>
    <header>
        word-of-the-day
    </header>

    {#if !generated}
        <button onclick={generateWord} class="roll">
            roll
        </button>
    {/if}

    <div class="results">
        {#if generating || generated}
            <div class="word">
                {generatedWord} 
            </div>
        {/if}

        {#if propertiesGenerated}
            <div class="score">
                {word?.getScore()} pts
            </div>
        {/if}
    </div>

    {#if generated}
        <div class="properties">
            {#if word}
                {#each visibleProperties as prop (prop.name)}
                    <div animate:flip>
                        <PropertyCard property={prop} word={word}/>
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</div>

<style lang="scss"> 
    @use "sass:list";

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

    :global(:root) {
        --margin: clamp(4px, 2vw, 12px);
        --bg: #fffcf2;
        --bg-l: color-mix(in srgb, var(--bg), #fff 80%);
        --border-col: #1e1e1e;
        --border: 2px solid var(--border-col);

        --page-width: clamp(300px, 100vw, 800px);
        --font-logo: clamp(36px, 5vw, 100px);
        --font-header: clamp(36px, 3.5vw, 80px);
        --font-title: clamp(18px, 2vw, 60px);
        --font-regular: clamp(14px, 0.7vw, 20px);
    }
    
    :global(body) {
        padding: 0; margin: 0;
        width: 100vw; height: 100vh;

        background-color: var(--bg);

        display: flex;
        justify-content: center;
    }

    :global(*) {
        box-sizing: border-box;
    }

    @mixin pixel-font() {
        text-rendering: optimizeLegibility;
        font-synthesis-weight: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        image-rendering: pixelated; 
    }

    .page {
        width: var(--page-width);
        display: flex;
        flex-direction: column;
        align-items: center;

        margin-bottom: var(--margin);
    }

    .results {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--margin);

        height: 25vh;
    }

    header {
        font-family: "GeistPixel";
        font-size: var(--font-logo);

        margin-top: calc(var(--margin) * 2);
        width: 100%;
        text-align: center;

        transform-origin: center;
        
        @include pixel-font();
    }

    .word {
        font-size: var(--font-header);
        font-family: "Geist";
        
    }

    @include backlight(".score", var(--score-rarity));
    .score {
        font-size: var(--font-regular);
        font-family: "GeistPixel";
        padding: 4px;
        border: var(--border);
        background-color: var(--bg-l);
        width: fit-content;
    }


    .properties {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: calc(var(--margin) * 2);

        width: 100%;
        height: 65vh;
                
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    @font-face {
        font-family: "Geist";
        src: url("$lib/assets/fonts/Geist-Regular.ttf") format("truetype");
        font-weight: normal;
        font-style: normal;
    }

    @font-face {
        font-family: "GeistPixel";
        src: url("$lib/assets/fonts/GeistPixel-Square.ttf") format("truetype");
        font-weight: normal;
        font-style: normal;
    }
</style>