import { json } from '@sveltejs/kit';
import { readFileSync, openSync, readSync } from 'fs';
import { resolve } from 'path';
import type { RequestHandler } from './$types';

interface DictionaryWord {
    word: string;
    pos: string;
    definition: string;
}

// optimized index + ndjson 
const indexBuffer = readFileSync(resolve('src/lib/data/dict.index'));
const entryCount = indexBuffer.byteLength / 4;
const dictFd = openSync(resolve('src/lib/data/dict.ndjson'), 'r');

function readEntry(i: number): DictionaryWord {
    const offset = indexBuffer.readUInt32LE(i * 4);

    const nextOffset = i + 1 < entryCount
        ? indexBuffer.readUInt32LE((i + 1) * 4)
        : offset + 512; 
    const lineBuffer = Buffer.alloc(nextOffset - offset);
    readSync(dictFd, lineBuffer, 0, lineBuffer.byteLength, offset);
    return JSON.parse(lineBuffer.toString('utf-8').trimEnd());
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

export const GET: RequestHandler = () => {
    const i = crand(0, entryCount - 1);
    return json(readEntry(i));
};