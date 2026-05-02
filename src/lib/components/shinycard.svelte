<script lang="ts">
    import { HoverTilt } from "hover-tilt";
    import type { Snippet } from "svelte";

    let {
        children,
        condition
    }: {
        children?: Snippet,
        condition: boolean
    } = $props();
</script>

{#if condition && children}
<HoverTilt springOptions={{ stiffness: 0.005 }} >
    {@render children()}
</HoverTilt>
{:else if children}
    {@render children()}
{/if}