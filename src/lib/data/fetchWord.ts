import { Word } from "$lib/types";

interface DictionaryWord {
    word: string;
    pos: string;
    definition: string;
}

export async function fetchWord(): Promise<DictionaryWord> {
    const res = await fetch('/api/word');
    return res.json();
}

export function getWord(word: string): Word {
    const w = new Word(word);
    return w;
}




