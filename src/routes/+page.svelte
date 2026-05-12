<script lang="ts">
    import { tick } from "svelte";
    import PropertyCard from "$lib/components/card/propertycard.svelte";
    import type { Property } from "$lib/types";
    import { RARITY_COLOR, Word } from "$lib/types";

    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { user, username, loaded, guest } from "$lib/stores/auth";
    import { getGenerationAvailable, saveWordResult } from "$lib/data/wordHistory";
    import Wordcard from "$lib/components/card/wordcard.svelte";
    import { toBlob } from 'html-to-image';
    import Leaderboard from "$lib/components/ui/leaderboard.svelte";

    const WORD_GENERATE_TIME = 5000;

    let word = $state<Word>(new Word());
    let properties = $state<Property[]>([]);
    let visibleProperties = $state<Property[]>([]);
    let shareElement = $state<HTMLElement>();

    const displayedScore = tweened(0, { duration: 500, easing: cubicOut });

    let generated = $state<boolean>(false);
    let generating = $state<boolean>(false);
    let propertiesGenerated = $state<boolean>(false);

    let wordBackdrop = $state<string>("");
    let backdropAnimating = $state<boolean>(false);
    let generatedWord = $state<string>("");
    let generationIndex = $state<number>(0);

    let nextAllowedAt = $state<Date | null>(null);
    let now = $state(new Date());

    $effect(() => {
        const interval = setInterval(() => { now = new Date(); }, 1000);
        return () => clearInterval(interval);
    });

    let countdown = $derived.by(() => {
        if (!nextAllowedAt) return null;
        const diff = nextAllowedAt.getTime() - now.getTime();
        if (diff <= 0) { nextAllowedAt = null; return null; }
        const hours   = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor(diff / 1000 / 60) % 60;
        const seconds = Math.floor(diff / 1000) % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });

    $effect(() => {
        const currentUser = $user;
        if (currentUser) {
            getGenerationAvailable(currentUser.id).then(({ allowed, nextTime }) => {
                if (!allowed) nextAllowedAt = nextTime;
            });
        }
    });

    function randomizeBackdrop() {
        if (!word || !generating) return;
        backdropAnimating = true;
        const alpha = "abcdefghijklmnopqrstuvwxyz";
        wordBackdrop = Array.from({ length: word.getWord().length }, () =>
            alpha[Math.floor(Math.random() * alpha.length)]
        ).join("");
        setTimeout(randomizeBackdrop, 150);
    }

    let checking = $state<boolean>(false);

    async function generateWord() {
        if (generated || checking || generating) return;
        checking = true;

        if ($user) {
            const { allowed, nextTime } = await getGenerationAvailable($user.id);
            if (!allowed) { nextAllowedAt = nextTime; checking = false; return; }
        }

        try {
            await word.init();
        } catch (e) {
            console.log("Error generating word: " + e);
            checking = false;
            return;
        }

        properties = word.getProperties().sort((a, b) => a.score - b.score);
        visibleProperties = [];
        generating = true;
        checking = false;

        await tick();
        generateAnim();
    }

    function revealProperties() {
        let i = 0;
        function step() {
            if (i >= properties.length) { propertiesGenerated = true; return; }
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
        if (generationIndex === word.getWord().length) {
            setTimeout(revealProperties, 1000);
            generating = false;
            generated = true;
            return;
        }
        generatedWord += word.getWord()[generationIndex];
        generationIndex++;
        setTimeout(generateAnim, WORD_GENERATE_TIME / word.getWord().length);
    }

    $effect(() => {
        if ($user && propertiesGenerated) {
            saveWordResult($user.id, word);
        }
    });

    async function getFontEmbedCSS(): Promise<string> {
        const fonts = [
            { family: "GeistMono", url: "/fonts/GeistMono-Regular.ttf" },
            { family: "GeistPixel", url: "/fonts/GeistPixel-Square.ttf" },
            { family: "Geist", url: "/fonts/Geist-Regular.ttf" },
        ];
        const declarations = await Promise.all(
            fonts.map(async ({ family, url }) => {
                const res = await fetch(url);
                const buffer = new Uint8Array(await res.arrayBuffer());
                let b64 = "";
                const chunkSize = 8192;
                for (let i = 0; i < buffer.length; i += chunkSize) {
                    b64 += String.fromCharCode(...buffer.subarray(i, i + chunkSize));
                }
                b64 = btoa(b64);
                return `@font-face { font-family: "${family}"; src: url("data:font/truetype;base64,${b64}"); }`;
            })
        );
        return declarations.join("\n");
    }

    async function share() {
        if (!word || !shareElement) return;
        try {
            const blob = await toBlob(shareElement, {
                fontEmbedCSS: await getFontEmbedCSS(),
                pixelRatio: 2,
            });
            if (blob) {
                await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                window.alert("Copied image to clipboard!");
            }
        } catch (error) {
            console.error("Share failed:", error);
        }
    }

    let pageReady = $derived($loaded && ($user !== null || $guest));
</script>

{#if propertiesGenerated}
    <div class="share-card">
        <Wordcard
            user={$username || "guest"}
            word={word}
            date={new Date()}
            bind:ref={shareElement}
        />
    </div>
{/if}

{#if pageReady}
    <div class="page" style={`--score-rarity: ${RARITY_COLOR[word.getRarity() || "ordinary"][0]}`}>

        {#if !generated && !generating}
            <div class="hero">
                <header>word-of-the-day</header>
                <button onclick={generateWord} class="roll" disabled={nextAllowedAt !== null}>
                    {nextAllowedAt === null ? `generate` : `${countdown || 'err'}`}
                </button>
            </div>

        <!-- <Leaderboard /> -->
        {/if}

        {#if generating || generated}
            <div class="results">
                <div class="word">
                    {#each word?.getWord() ?? [] as _, i}
                        {#if generatedWord[i]}
                            <span class="generated-letter">{generatedWord[i]}</span>
                        {:else}
                            <span class="bd-letter">{wordBackdrop[i]}</span>
                        {/if}
                    {/each}
                </div>

                <div class="r-info" style={`visibility: ${generated ? 'visible' : 'hidden'}`}>
                    <div class="ri-rating">
                        <div class="score">{$displayedScore.toFixed(0)} pts</div>
                        {#if propertiesGenerated}
                            <div class="word-rarity" style={`--rarity-col: ${RARITY_COLOR[word.getRarity()][0]}`}>
                                {word.getRarity()}
                            </div>
                        {/if}
                    </div>
                    <div class="ri-lower">
                        {#if propertiesGenerated}
                            <button class="share" onclick={share}>share</button>
                            <a class="goto-cards" href="/cards">collection</a>
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
{:else if !$loaded}
    <div class="loading">loading...</div>
{/if}

<style lang="scss">
    @use "sass:list";

    .share-card {
        position: absolute;
        left: -1500px;
    }

    .loading {
        align-self: center;
        height: fit-content;
        font-size: 1.2rem;
        border: var(--border);
        background-color: var(--bg-l);
        padding: 8px;
        font-family: "GeistMono";
    }

    @property --rotation {
        syntax: "<angle>";
        inherits: false;
        initial-value: 0deg;
    }

    @keyframes rotate {
        to { --rotation: 360deg; }
    }

    @mixin backlight($selector, $colors...) {
        #{$selector} {
            position: relative;
            &:before {
                content: "";
                display: block;
                background: conic-gradient(from var(--rotation), purple, blue, green, yellow, orange, red);
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

    @include backlight(".loading");
    @include backlight(".roll");
    @include backlight(".word");
    @include backlight(".score", var(--score-rarity));

    :global(body) {
        padding: 0; margin: 0;
        width: 100vw; height: 100vh;
        background-color: var(--bg);
        display: flex;
        justify-content: center;
        overflow-x: hidden;
    }

    .roll {
        cursor: pointer;
        user-select: none;
        border: var(--border);
        background-color: var(--bg-l);
        font-family: "GeistMono";
        font-size: 1.4rem;
        width: fit-content;
        padding: var(--margin);
        &:disabled { cursor: not-allowed; }
    }

    .page {
        width: var(--page-width);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--margin);
    }

    .bd-letter { opacity: 0.5; width: 1ch; }

    .r-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .share, .goto-cards {
        display: flex;
        align-items: center;
        width: fit-content;
        padding: 4px;
        background: var(--bg-l);
        font-family: "GeistMono";
        border: var(--border);
        font-size: 0.8rem;
        cursor: pointer;
        text-decoration: none;
    }

    .ri-lower { display: flex; flex-direction: row; gap: 8px; }
    .hero { display: flex; flex-direction: column; gap: 12px; align-items: center; }

    .word {
        background-color: var(--bg-l);
        border: var(--border);
        padding: var(--margin);
        font-size: var(--font-header);
        font-family: "GeistMono";
    }

    .results {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--margin);
        height: 45vh;
    }

    .ri-rating { display: flex; flex-direction: row; align-items: center; gap: var(--margin); }

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
    }

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
        scrollbar-width: none;
        -ms-overflow-style: none;
        &::-webkit-scrollbar { display: none; }
        animation: expand ease-in-out 0.7s forwards;
    }

    @keyframes expand {
        from { height: 0; }
        to { height: 55vh; }
    }
</style>