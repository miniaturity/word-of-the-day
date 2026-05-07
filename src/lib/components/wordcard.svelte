<script lang="ts">
    import { getRarity, RARITY_COLOR, type Property, type Word } from "$lib/types";
    import Card from "./card.svelte";

    let {
        word,
        user,
        date,
        ref = $bindable(),
        asHover,
    }: {
        word: Word,
        user: string,
        date: Date,
        ref?: HTMLElement
        asHover?: boolean,
    } = $props();
    
    let properties = $derived<Property[]>([...word.getProperties()].sort((a, b) => b.score - a.score));
    let color = $derived<string>(RARITY_COLOR[word.getRarity()][0]);
    let bg = $derived<string>(word.getColor());

    const shortenNumber = (num: number): string => {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 1
        }).format(num);
    };

    const hueShift = (hex: string, shift: number): string => {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;

        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h: number = 0, s: number, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; 
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        h = (h * 360 + shift) % 360;
        if (h < 0) h += 360;
        h /= 360;

        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let newR, newG, newB;
        if (s === 0) {
            newR = newG = newB = l;
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            newR = hue2rgb(p, q, h + 1/3);
            newG = hue2rgb(p, q, h);
            newB = hue2rgb(p, q, h - 1/3);
        }

        const toHex = (x: number) => {
            const hexVal = Math.round(x * 255).toString(16);
            return hexVal.length === 1 ? '0' + hexVal : hexVal;
        };

        return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
    }


    
    
</script>

<Card rarity={word.getRarity()} render={asHover || true}>
    <div bind:this={ref} class={`word-card ${word.getRarity()}`} style={`--rar-col: ${color}; ${bg && `--bg: ${bg};`}`}>
        <div class="wc-upper">
            <div class="wc-header">
                <div class="wc-rarity">
                    {word.getRarity()}
                </div>

                <div class="wc-points">
                    {word.getScore()} pts
                </div>
            </div>
            <div class="wc-image" style={`--abg: ${bg}; --bbg: ${hueShift(bg, 30)}`}>
                <div class="wc-word">
                    {word.getWord()}
                </div>
            </div>
        </div>
        <div class="wc-lower">
            <div class="wc-properties">
                <div class="wc-stat">
                    <span>{user}</span>
                    <span>{date.toLocaleDateString('en-US')}</span>
                </div>

                <div class="wc-list">
                    {#each { length: 4 } as _, i}
                    <div class="wcl-property" style={`--p-rar: ${RARITY_COLOR[getRarity(properties[i].probability)][0]}`}>
                        <div class="wclp-up">
                            <div class="wclp-icon">
                                {properties[i].icon}
                            </div>

                            <div class="wclp-name">
                                {properties[i].name}
                            </div>

                            <div class="wclp-score">
                                +{shortenNumber(properties[i].score)}
                            </div>
                        </div>
                        <div class="wclp-lw">

                        </div>
                    </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</Card>

<style lang="scss">
    @use "sass:list";

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
    .legendary {
        --bor: 4px solid #000;
    }

    .extraordinary {
        --bor: 3px solid #000;
    }

    .wc-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin: 5%;
    }

    .wcl-property {
        display: flex;
        flex-direction: column;
        --p-rar-bg: color-mix(in srgb, var(--p-rar, red), #fff 70%);
    }

    .wclp-up {
        display: flex;
        flex-direction: row;
        font-family: "GeistMono";
        align-items: center;
    }

    .wclp-name {
        --darken: color-mix(in srgb, var(--p-rar), #000 20%);
        padding: 0 12px;
        border: 1px solid var(--p-rar);
        border-left: none;
        background-color: var(--p-rar-bg);
        color: var(--darken);

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;  
    }

    .wclp-score {
        border: 1px solid var(--pts-col-bor);
        border-left: none;
        color: var(--pts-col-bor);
        background-color: var(--pts-col);
        padding: 0 2px;
        font-size: 0.7rem;
    }

    .wclp-icon {
        font-size: 1.2rem;
        border: 1px solid var(--p-rar);
        background-color: var(--p-rar-bg);
    }



    .word-card {
        --b: var(--bor, var(--border, 2px solid #000));
        --rarity-bg: color-mix(in srgb, var(--rar-col, red), #fff 70%);
        --w: 250px;
        --h: 350px;

        width: var(--w);
        height: var(--h);
        background-color: var(--bg-l);
        border: var(--b);

        font-family: "GeistMono";

        display: flex;
        flex-direction: column;


    }

    .wc-word {
        padding: 4px;
        background: var(--bg-l);
        border: var(--border);
        width: fit-content; height: fit-content;
        font-size: 1.5rem;

        filter: drop-shadow(0 0 10px #00000070);
        z-index: 2;
    }

    .wc-stat {
        --bc: #808080;
        background: #c2c2c2;
        border-top: 1px solid var(--bc);
        border-bottom: 1px solid var(--bc);
        color: var(--bc);

        font-size: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2px 4px;

        & span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    

    .wc-upper {
        display: flex;
        flex-direction: column;
        width: 100%; height: 50%;
    }

    .wc-lower {
        display: flex;
        flex-direction: column;
        width: 100%; height: 50%;
    }

    .wc-header {
        display: flex;
        flex-direction: row;
        width: 100%; height: 20%;

        align-items: center;
        justify-content: space-between;
    }

    .wc-rarity {
        color: var(--rar-col);
        background-color: var(--rarity-bg);
        border: 2px solid var(--rar-col); 
        font-size: 0.9rem;
        
        display: flex;
        align-items: center;
        height: fit-content;
        padding: 3px;
        margin-left: 4px;
    }

    .wc-points {
        color: var(--pts-col-bor);
        background-color: var(--pts-col);
        border: 2px solid var(--pts-col-bor); 
        font-size: 0.8rem;

        display: flex;
        align-items: center;
        height: fit-content;
        padding: 3px;
        margin-right: 4px;
    }

    .wc-image {
        background: linear-gradient(135deg, var(--abg) 0%, var(--bbg) 100%);
        border-top: var(--b);
        border-bottom: var(--b);

        width: 100%; height: 80%;

        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>


