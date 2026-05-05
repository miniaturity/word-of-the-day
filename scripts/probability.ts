import { json } from '@sveltejs/kit';
import { readFileSync, openSync, readSync } from 'fs';
import { resolve } from 'path';

interface DictionaryWord {
    word: string;
    pos: string;
    definition: string;
}

const indexBuffer = readFileSync(resolve('src/lib/data/dict.index'));
const entryCount = indexBuffer.byteLength / 4;
const dictFd = openSync(resolve('src/lib/data/dict.ndjson'), 'r');

function readEntry(i: number): DictionaryWord {
    const offset = indexBuffer.readUInt32LE(i * 4);

    const nextOffset = i + 1 < entryCount
        ? indexBuffer.readUInt32LE((i + 1) * 4)
        : offset + 512;

    const lineBuffer = Buffer.alloc(nextOffset - offset);
    const bytesRead = readSync(dictFd, lineBuffer, 0, lineBuffer.byteLength, offset);

    return JSON.parse(lineBuffer.subarray(0, bytesRead).toString('utf-8').trimEnd());
}

function getProbability(rule: (word: string) => boolean): void {
    let success: number = 0;

    for (let i = 0; i < entryCount; i++) {
        const entry = readEntry(i);
        if (rule(entry.word.toLowerCase())) { 
            success++; 
        }
    }

    console.log("PROBABILITY: " + (success / entryCount * 100));
}

getProbability((word: string) => {
            for (let i = 0; i < word.length - 1; i++) {
                if (word[i] > word[i + 1]) return false;
            }
            return true;
        }
    );