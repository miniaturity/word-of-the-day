import { PROPERTIES } from "./data/properties";

export function getRarity(probability: number): Rarity {
    if (probability <= 0.001) return "extraordinary";
    if (probability <= 0.1) return "legendary";
    if (probability <= 3) return "unique";
    if (probability <= 20) return "uncommon";
    return "ordinary";
}

export const RARITY_COLOR: Record<Rarity, string[]> = {
    "ordinary": ["#bdbdbd", "rgba(184, 184, 184, 0.75)", "#bdbdbd"],
    "uncommon": ["#6cde52", "#6cde52ad", "#6cde52"],
    "unique": ["#5273de", "#5b52de", "#8f52de", "#5b52de"],
    "legendary": ["#deb652"],
    "extraordinary": ["#de6552", "#de9152", "#f1cb77"]
}


export class Word {
    private word: string;
    private propertyEngine: WordPropertyEngine;
    private readonly WORD_LENGTH_LIMIT: number = 8;

    constructor() {
        const word = this.generateWord();
        this.word = word;
        this.propertyEngine = new WordPropertyEngine(word, PROPERTIES);
    
    }

    public getProperties(): Property[] {
        return this.propertyEngine.applyProperties();
    }

    public getWord(): string { return this.word; }
    public getScore(): number { return this.propertyEngine.score; }

    private generateWord(): string {
        let word: string = "";
        let alpha: string = "abcdefghijklmnopqrstuvwxyz ";

        for (let i = 0; i < this.WORD_LENGTH_LIMIT; i++) {
            const letter: string = alpha[this.getSecureRandomInt(0, alpha.length - 1)];
            word += letter;
        }

        return word;
    }

    private getSecureRandomInt(min: number, max: number): number {
        const range = max - min + 1;
        const bitLength = Math.ceil(Math.log2(range));
        const byteLength = Math.ceil(bitLength / 8);
        const mask = (1 << bitLength) - 1;
        const array = new Uint8Array(byteLength);

        let result: number;
        do {
            crypto.getRandomValues(array);
            result = array.reduce((acc, byte) => (acc << 8) + byte, 0) & mask;
        } while (result >= range);

        return result + min;
    }
}

export class WordPropertyEngine {
    constructor(public readonly word: string, private properties: Property[]) {}

    public score: number = 0;

    applyProperties(): Property[] {
        this.score = 0; // in case it's called twice somehow
        const props: Property[] = [];
        for (const p of this.properties) {
            if (p.applicable(this.word)) { 
                props.push(p); 
                this.score += p.score;
            }
        }
        return props;
    }
}

export type Rarity = 
    "ordinary" |
    "uncommon" |
    "unique" |
    "legendary" |
    "extraordinary"

export interface Property {
    id: number;
    applicable: (word: string) => boolean,
    highlight?: (word: string) => Record<number, Highlight>,
    name: string, 
    desc: string,
    probability: number,
    score: number,
    icon: string,
}

export interface Highlight {
    borderCol?: string;
    mainCol?: string;
}

