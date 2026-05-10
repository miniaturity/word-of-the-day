<script lang="ts">
    import type { Rarity } from "$lib/types";
    import { HoverTilt } from "hover-tilt";
    import type { HoverTiltProps } from "hover-tilt";
    import type { Snippet } from "svelte";


    let {
        rarity,
        children,
        render
    }: {
        rarity: Rarity;
        children?: Snippet;
        render: boolean;
    } = $props();

    const TEXTURES_SHINY: Partial<Record<Rarity, string>> = {
        ["unique"]: "",
        ["legendary"]: "https://poke-holo.b-cdn.net/foils/151/birthday-holo-dank-2.webp",
        ["extraordinary"]: "/images/chfoil.jpg"
    };


    const standardProps: HoverTiltProps = {
        springOptions: { stiffness: 0.3 },
        shadow: true,
        scaleFactor: 1.1,
    }
</script>

{#if children && render}
    {#if rarity === "ordinary"}
        <HoverTilt {...standardProps} 
            class="card"
        >
            {@render children()}
        </HoverTilt>
    {:else if rarity === "uncommon"}
        <HoverTilt {...standardProps} 
            class="card"
        >   
            {@render children()}
        </HoverTilt>
    {:else if rarity === "unique"}
        <HoverTilt {...standardProps} 
            class="unique card"
        >
            {@render children()}
        </HoverTilt>
    {:else if rarity === "legendary"}
        <HoverTilt {...standardProps} 
        class="legendary card" 
        style={`--h: url(${TEXTURES_SHINY["legendary"]});`}
        glareIntensity={0.7}
        
        >
            {@render children()}
        </HoverTilt>
    {:else if rarity === "extraordinary"}
        <HoverTilt {...standardProps} 
        class="extraordinary card"
        style={`--h: url(${TEXTURES_SHINY["extraordinary"]});`}
        glareIntensity={0.7}
        >
            {@render children()}
        </HoverTilt>
    {/if}

{:else if children}
    {@render children()}
{/if}

<style lang="scss">
    :global(.unique) {
        --hover-tilt-custom-gradient: linear-gradient(
            120deg,
            rgb(0 0 0 / 0) calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) - 60%),
            rgb(130 224 255 / var(--hover-tilt-glare-intensity, 1)) calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2)),
            rgb(0 0 0 / 0) calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) + 60%)
        );
    }

    :global(.legendary .hover-tilt::after) {
        --hover-tilt-custom-gradient: conic-gradient(
            from calc(var(--hover-tilt-angle, 0)) at center center,
            rgba(255, 255, 255, calc(var(--hover-tilt-glare-intensity, 1) * 0.9)),
            rgba(222, 182, 82, calc(var(--hover-tilt-glare-intensity, 1) * 0.7)),
            rgba(255, 255, 255, calc(var(--hover-tilt-glare-intensity, 1) * 0.9))
        );
        --sparkle-rainbow-gradient: linear-gradient(to top left, #f9b3eb, #e2a6fc, #88a2f8, #a2f5a9 90%);
        --sparkles-image: url(/images/sparkles.webp);
        --sparkles-offset: calc(50% + var(--hover-tilt-x, 0) * 1.5px) calc(50% + var(--hover-tilt-y, 0) * 1.5px);
        --hover-tilt-default-gradient: radial-gradient(farthest-corner circle at var(--gradient-x) var(--gradient-y), lch(95% 2.7 var(--hover-tilt-glare-hue, 270) / calc(var(--hover-tilt-glare-intensity, 1) * 0.66)) 8%, lch(88% 5.5 var(--hover-tilt-glare-hue, 270) / calc(var(--hover-tilt-glare-intensity, 1) * 0.5)) 28%, lch(05% 3.5 var(--hover-tilt-glare-hue, 270) / calc(var(--hover-tilt-glare-intensity, 1) * 0.25)) 90%);
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background-image:
        var(--sparkle-rainbow-gradient),
        var(--h),
        var(--hover-tilt-custom-gradient);
        background-size: 120% 160%, cover;
        background-position: center, var(--sparkles-offset), center;
        background-repeat: no-repeat, repeat, no-repeat;
        background-blend-mode: color-burn;
        mix-blend-mode: screen;
        will-change: background-image, opacity;
        pointer-events: none;
    }

    :global(.extraordinary .hover-tilt::after) {
        --hover-tilt-custom-gradient: linear-gradient(
            120deg,
            rgb(0 0 0 / 0) calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) - 60%),
            rgb(249 218 173 / var(--hover-tilt-glare-intensity, 1)) calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2)),
            rgb(0 0 0 / 0) calc((var(--gradient-x, 50%) / 2 + var(--gradient-y, 50%) / 2) + 60%)
        );
        --sparkle-rainbow-gradient: linear-gradient(to top left, #f9b3eb, #e2a6fc, #88a2f8, #a2f5a9 90%);
        --sparkles-image: url(/images/sparkles.webp);
        --sparkles-offset: calc(50% + var(--hover-tilt-x, 0) * 1.5px) calc(50% + var(--hover-tilt-y, 0) * 1.5px);
        --hover-tilt-default-gradient: radial-gradient(farthest-corner circle at var(--gradient-x) var(--gradient-y), lch(95% 2.7 var(--hover-tilt-glare-hue, 270) / calc(var(--hover-tilt-glare-intensity, 1) * 0.66)) 8%, lch(88% 5.5 var(--hover-tilt-glare-hue, 270) / calc(var(--hover-tilt-glare-intensity, 1) * 0.5)) 28%, lch(05% 3.5 var(--hover-tilt-glare-hue, 270) / calc(var(--hover-tilt-glare-intensity, 1) * 0.25)) 90%);
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background-image:
        var(--sparkle-rainbow-gradient),
        var(--h),
        var(--hover-tilt-custom-gradient);
        background-size: 120% 160%, cover;
        background-position: center, var(--sparkles-offset), center;
        background-repeat: no-repeat, repeat, no-repeat;
        background-blend-mode: color-burn;
        mix-blend-mode: color-dodge;
        will-change: background-image, opacity;
        pointer-events: none;
        
    }

    :global(.card) {
        --depth: 60px; 
        --layer-z: max(var(--hover-tilt-opacity) * var(--depth), 0px); 
        --shadow-opacity: calc(var(--hover-tilt-opacity) * 0.4); 
        --shadow-size: calc(var(--depth) / 5); 
        --shadow-offset: calc(var(--depth) / 8); 
        --shadow-offset-x: calc(var(--shadow-x) * var(--shadow-offset));
        --shadow-offset-y: calc(var(--shadow-y) * var(--shadow-offset));

        transform-style: preserve-3d;
    }

   


</style>