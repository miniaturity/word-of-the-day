<script lang="ts">
    import { tick } from "svelte";
    import PropertyCard from "$lib/components/propertycard.svelte";
    import type { Property, Rarity } from "$lib/types";
    import { RARITY_COLOR, Word } from "$lib/types";

    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    const WORD_GENERATE_TIME = 5000;

    let word = $state<Word>(new Word());
    let score = $derived(word?.getScore() || 0);
    let properties = $state<Property[]>([]);
    let visibleProperties = $state<Property[]>([]);

    const displayedScore = tweened(0, {
        duration: 500,
        easing: cubicOut
    })

    let generated = $state<boolean>(false);
    let generating = $state<boolean>(false);

    let propertiesGenerated = $state<boolean>(false);
    
    // generating anim
    let wordBackdrop = $state<string>("");
    let backdropAnimating = $state<boolean>(false);

    let generatedWord = $state<string>("");
    let generationIndex = $state<number>(0);



    function randomizeBackdrop() {
        if (!word || !generating) return;
        backdropAnimating = true;
        let newBackdrop = "";
        const alpha = "abcdefghijklmnopqrstuvwxyz"
        for (let i = 0; i < word.getWord().length; i++) {
            newBackdrop += alpha[Math.floor(Math.random() * alpha.length)];
        }
        wordBackdrop = newBackdrop;
        setTimeout(randomizeBackdrop, 150);
    }

    async function generateWord() {
        if (generated) return;

        try {
            await word.init();
        } catch (e) {
            console.log("Error generating word: " + e);
            return;
        }

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
            $displayedScore += properties[i].score;

            i++;
            setTimeout(step, 1000); 
        }

        step();
    }

    function generateAnim() {
        if (!word) return;

        if (!backdropAnimating) randomizeBackdrop();

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


</script>

<div class="page" style={`--score-rarity: ${RARITY_COLOR[word.getRarity() || "ordinary"][0]}`}>

    {#if !generated && !generating}
        <div class="hero">
            <header>
                word-of-the-day
            </header>

            <button onclick={generateWord} class="roll">
                generate
            </button>
        </div>
    {/if}
    {#if generating || generated}
    
    <div class="results">

            <div class="word">
                {#each word?.getWord() ?? [] as _, i }
                    {#if generatedWord[i]}
                        <span class="generated-letter">
                            {generatedWord[i]}
                        </span>
                    {:else}
                        <span class="bd-letter">
                            {wordBackdrop[i]}
                        </span>
                    {/if}
                {/each}
            </div>
        
        <div class="r-info" style={`visibility: ${generated ? 'visible' : 'hidden'}`}>
            <div class="ri-rating">
                <div class="score">
                    {$displayedScore.toFixed(0)} pts
                </div>

                {#if propertiesGenerated}
                    <div class="ri-seperator"></div>
                    <div class="word-rarity" style={`--rarity-col: ${RARITY_COLOR[word.getRarity()][0]}`}>
                        {word.getRarity()}
                    </div>
                {/if}
            </div>


        </div>
        
    </div>
    {/if}

    {#if generated}
        <div class="properties" class:show={generated}>
            {#if word}
                {#each visibleProperties as prop (prop.id)}
                    <PropertyCard property={prop} word={word}/>
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

    
    :global(body) {
        padding: 0; margin: 0;
        width: 100vw; height: 100vh;

        background-color: var(--bg);

        display: flex;
        justify-content: center;
        overflow-x: hidden;
    }

    @mixin pixel-font() {
        text-rendering: optimizeLegibility;
        font-synthesis-weight: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        image-rendering: pixelated; 
    }

    @include backlight(".roll");
    .roll {
        cursor: pointer;
        user-select: none;
        border: var(--border);
        background-color: var(--bg-l);
        font-family: "GeistMono";
        font-size: 1.4rem;
        width: fit-content;
        padding: var(--margin);
    }

    .page {
        width: var(--page-width);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        margin-bottom: var(--margin);
    }

    .bd-letter {
        opacity: 0.5;
        width: 1ch;
    }

    .r-info {
        display: flex;
        flex-direction: column;
    }

    .ri-seperator {
        width: 5px;
        height: 5px;
        background-color: var(--border-col);
    }

    .hero {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
    }


    @include backlight(".word");
    .word {
        background-color: var(--bg-l);
        border: var(--border);
        padding: var(--margin);
    }

    .results {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--margin);

        height: 35vh;
    }

    .ri-rating {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--margin);
    }

    .word-rarity {
        --rarity-bg: color-mix(in srgb, var(--rarity-col, red), #fff 70%);
        color: var(--rarity-col, red);
        background-color: var(--rarity-bg);
        border: 2px solid var(--rarity-col);
        padding: 4px;
        font-family: "GeistMono";
        font-size: 1.3rem;
    }

    header {
        font-family: "GeistPixel";
        font-size: var(--font-header);

        margin-top: calc(var(--margin) * 2);
        width: 100%;
        text-align: center;

        transform-origin: center;
        
        @include pixel-font();
    }

    .word {
        font-size: var(--font-header);
        font-family: "GeistMono";
        
    }

    @include backlight(".score", var(--score-rarity));
    .score {
        font-size: 1.3rem;
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
        height: 0;

        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }

        animation: expand ease-in-out 0.7s forwards;
    }

    @keyframes expand {
        from {
            height: 0;
        } to {
            height: 65vh;
        }
    }

    
</style>