<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
    <title>word of the day</title>
</svelte:head>


{@render children()}

<style lang="scss">
	:global(:root) {
        --margin: clamp(4px, 2vw, 12px);
        --bg: #fffcf2;
        --bg-l: color-mix(in srgb, var(--bg), #fff 80%);
        --border-col: #1e1e1e;
        --border: 2px solid var(--border-col);

        --pts-col: #52fdbb;
        --pts-col-bor: #02b671;

        --page-width: clamp(300px, 100vw, 800px);
        --font-logo: clamp(36px, 5vw, 100px);
        --font-header: clamp(36px, 3.5vw, 80px);
        --font-title: clamp(18px, 2vw, 60px);
        --font-regular: clamp(14px, 0.7vw, 20px);

        scrollbar-width: none;
        -ms-overflow-style: none;
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

    @font-face {
        font-family: "GeistMono";
        src: url("$lib/assets/fonts/GeistMono-Regular.ttf") format("truetype");
        font-weight: normal;
        font-style: normal;
    }

	:global(*) {
        box-sizing: border-box;
    }


</style>