import { fetchWord } from "./data/fetchWord";
import { PROPERTIES } from "./data/properties";

export function getRarity(probability: number): Rarity {
    if (probability <= 0.001) return "extraordinary";
    if (probability <= 0.1) return "legendary";
    if (probability <= 10) return "unique";
    if (probability <= 33) return "uncommon";
    return "ordinary";
}

export const RARITY_COLOR: Record<Rarity, string[]> = {
    "ordinary": ["#bdbdbd", "rgba(184, 184, 184, 0.75)", "#bdbdbd"],
    "uncommon": ["#6cde52", "#6cde52ad", "#6cde52"],
    "unique": ["#5273de", "#5b52de", "#8f52de", "#5b52de"],
    "legendary": ["#deb652"],
    "extraordinary": ["#de6552", "#de9152", "#f1cb77"]
}

export interface DictionaryWord {
    word: string;
    pos: string;
    definition: string;
}

export class Word {
    // typescript i promise i will init these before using i promise pinky promise yes
    private word!: string;
    private def!: string;
    private propertyEngine!: WordPropertyEngine;
    private rarity!: Rarity;
    private properties!: Property[];

    public async init(): Promise<Word> {
        const word = await fetchWord();
        this.word = word.word.toLowerCase();
        this.def = word.definition;
        this.propertyEngine = new WordPropertyEngine(this.word, PROPERTIES);
        this.properties = this.propertyEngine.applyProperties();
        this.rarity = this.getWordRarityScore(this.propertyEngine.score);
        return this;
    }

    public getProperties(): Property[] {
        return this.properties;
    }

    public getDef(): string { return this.def; }
    public getWord(): string { return this.word; }
    public getScore(): number { return this.propertyEngine.score; }
    public getRarity(): Rarity { return this.rarity; }

    private getWordRarityScore(score: number): Rarity {
        if (score <= 1000) return "ordinary";
        if (score <= 10000) return "uncommon";
        if (score <= 100000) return "unique";
        if (score <= 500000) return "legendary";
        
        return "extraordinary";
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

