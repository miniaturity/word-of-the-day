<script lang="ts">
import { HoverTilt } from 'hover-tilt';
    import type { Snippet } from 'svelte';

    let {
        condition,
        children
    }: {
        condition: boolean,
        children?: Snippet
    } = $props();
</script>

{#if condition && children}
    <HoverTilt shadow>
        {@render children()}
    </HoverTilt>
{:else if children}
    {@render children()}
{/if}