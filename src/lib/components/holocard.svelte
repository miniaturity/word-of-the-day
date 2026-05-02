<script lang="ts">
    import { HoverTilt } from "hover-tilt";
    import type { Snippet } from "svelte";

    let {
        children,
        condition,
        holoImage,
        extraordinary
    }: {
        children?: Snippet,
        condition: boolean,
        holoImage?: string,
        extraordinary?: boolean
    } = $props();
</script>

{#if condition && children}
    <HoverTilt 
    springOptions={{ stiffness: 0.3 }} 
    glareIntensity={0.5}

    shadow
    class={`${extraordinary ? "extr" : "ex-holo"}`}
    style={`${holoImage && `--h: url(${holoImage});`}`}
    >
        {@render children()}
    </HoverTilt>
{:else if children}

    <HoverTilt
        springOptions={{ stiffness: 0.3 }} 
        glareIntensity={0.5}
        shadow
    >
        {@render children()}
    </HoverTilt>
{/if}

<style lang="scss">
    :global(.ex-holo .hover-tilt::after) {
        --hover-tilt-default-gradient: radial-gradient(farthest-corner circle at var(--gradient-x) var(--gradient-y), lch(95% 2.7 var(--hover-tilt-glare-hue, 270) / calc(var(--hover-tilt-glare-intensity, 1) * 0.66)) 8%, lch(88% 5.5 var(--hover-tilt-glare-hue, 270) / calc(var(--hover-tilt-glare-intensity, 1) * 0.5)) 28%, lch(05% 3.5 var(--hover-tilt-glare-hue, 270) / calc(var(--hover-tilt-glare-intensity, 1) * 0.25)) 90%);
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background-image:
        var(--h),
        var(--hover-tilt-default-gradient);
        background-size: 120% 160%, cover;
        background-position:
        calc(50% + var(--hover-tilt-x, 0) * 5px)
        calc(50% + var(--hover-tilt-y, 0) * 5px),
        center;
        background-repeat: no-repeat;
        background-blend-mode: color-burn;
        mix-blend-mode: screen;
        will-change: background-image, opacity;
        pointer-events: none;
    }

    :global(.extr .hover-tilt::after) {
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
        var(--sparkles-image),
        var(--hover-tilt-default-gradient);
        background-size: 120% 160%, cover;
        background-position: center, var(--sparkles-offset), center;
        background-repeat: no-repeat, repeat, no-repeat;
        background-blend-mode: color-burn;
        mix-blend-mode: screen;
        will-change: background-image, opacity;
        pointer-events: none;
    }

</style>