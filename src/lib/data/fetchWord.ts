import dict from "$lib/data/dict.json";

const dictionary: DictionaryWord[] = dict as DictionaryWord[];

interface DictionaryWord {
    word: string;
    pos: string;
    definition: string;
}

export function fetchWord(): DictionaryWord {
    const index = crand(0, dictionary.length - 1);
    return dictionary[index];
}

function crand(min: number, max: number): number {
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



