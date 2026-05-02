<script lang="ts">
    import type { Highlight, Property, Rarity, Word } from "$lib/types";
    import { RARITY_COLOR, getRarity } from "$lib/types";

    let { 
        word,
        property,
    }: {
        word: Word
        property: Property
    } = $props();

    let highlights = $derived<Record<number, Highlight> | undefined>(property.highlight?.(word.getWord()));
    let rarity = $derived<Rarity>(getRarity(property.probability));
    
</script>

<div class={`property`} 
style={`--backlight-color: ${RARITY_COLOR[rarity].join(", ")};
--rarity-color: ${RARITY_COLOR[rarity][0]}
`}
>
    <div class="p-title">
        <div class="pt-name">
            <div class="ptn-icon">{property.icon}</div>
            <div class="ptn-name">{property.name}</div>
        </div>
        <div class="pt-rarity">{rarity}</div>
    </div>

    <div class="p-desc">
        <div class="pd-desc">{property.desc}</div>
        <div class="seperator"></div>
        <div class="pd-lower">
            <div class="p-letters">
                {#each word.getWord() as letter, i}
                    <div class={`letter`} style={`
                    ${highlights && highlights[i] ? 
                        `background: ${highlights[i].mainCol || "var(--pts-col)"}; 
                        border: 1px solid ${highlights[i].borderCol || "var(--pts-col-bor)"} !important; 
                        color: ${highlights[i].borderCol || "var(--pts-col-bor)"}` : ""}
                    `}>
                        {letter}
                    </div>
                {/each}
            </div>

            <div class="p-pts">
                +{property.score} pts
            </div>
        </div>
    </div>
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
                inset: -6px;
                z-index: -2;
                animation: rotate 5s linear infinite;
                transition: all 0.3s ease-in-out;
            }
        }
    }

    
    @include backlight(".property", var(--backlight-color, red));
    .property {
        --pad: 4px;
        --d-pad: 8px;
        --width: clamp(200px, 40vw, 600px);
        display: flex;
        flex-direction: column;
        font-family: "GeistMono";

        border: var(--border);
        width: var(--width);
        background-color: var(--bg-l);

        &:hover::before {
            opacity: 1;
        }

    }

    .p-title {
        display: flex;
        flex-direction: row;
        border-bottom: var(--border);
        align-items: center;

        height: 100%; width: 100%;
    }

    .pt-name {
        display: flex;
        flex-direction: row;
        align-items: center;

        flex-grow: 1;
        width: 100%;
    }

    .ptn-icon {
        margin: var(--pad);
        padding: var(--pad);
    }

    .seperator {
        width: 100%;
        height: 2px;
        background-color: color-mix(in srgb, var(--bg-l, red), #000000 15%);
        margin: var(--pad);
        align-self: center;
    }
  
    .letter {
        --rarity-bg: color-mix(in srgb, var(--rarity-color, red), #fff 70%);
        width: 2ch;
        padding: 4px;
        background-color: var(--rarity-bg);
        border: 1px solid var(--rarity-color);
        color: color-mix(in srgb, var(--rarity-color, red), #000 20%);;
    }

    .pt-rarity {
        --rarity-bg: color-mix(in srgb, var(--rarity-color, red), #fff 70%);
        color: var(--rarity-color, red);
        background-color: var(--rarity-bg);
        padding: var(--pad);
        margin: var(--pad);
        border: 2px solid var(--rarity-color);
    }

    .p-desc {
        display: flex;
        flex-direction: column;
        gap: var(--pad);
        padding: var(--pad);
    }
    .p-letters {
        display: flex;
        flex-direction: row;
        gap: 4px;
    }

    .pd-desc {
        margin: var(--pad) var(--pad) 0 var(--pad);
    }

    .pd-lower {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .p-pts {
        color: var(--pts-col-bor);
        padding: var(--pad);
        border: 1px solid var(--pts-col-bor);
        background: var(--pts-col);
    }
</style>
