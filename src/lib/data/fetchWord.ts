interface DictionaryWord {
    word: string;
    pos: string;
    definition: string;
}

export async function fetchWord(): Promise<DictionaryWord> {
    const res = await fetch('/api/word');
    return res.json();
}



