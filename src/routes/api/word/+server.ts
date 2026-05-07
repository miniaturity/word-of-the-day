import { json } from '@sveltejs/kit';
import { readFileSync, openSync, readSync, closeSync } from 'fs';
import { resolve } from 'path';
import { randomInt } from 'crypto';
import type { RequestHandler } from './$types';

export const config = {
    runtime: 'nodejs22.x',
    includeFiles: ['data/dict.index', 'data/dict.ndjson']
};

interface DictionaryWord {
    word: string;
    pos: string;
    definition: string;
}

let indexBuffer: Buffer | null = null;
let entryCount = 0;

function init() {
    if (indexBuffer) return;
    indexBuffer = readFileSync(resolve(process.cwd(), 'data/dict.index'));
    entryCount = indexBuffer.byteLength / 4;
}

function readEntry(i: number): DictionaryWord {
    const fd = openSync(resolve(process.cwd(), 'data/dict.ndjson'), 'r');
    try {
        const offset = indexBuffer!.readUInt32LE(i * 4);
        const nextOffset = i + 1 < entryCount
            ? indexBuffer!.readUInt32LE((i + 1) * 4)
            : offset + 512;
        const buffer = Buffer.alloc(nextOffset - offset);
        readSync(fd, buffer, 0, buffer.length, offset);
        return JSON.parse(buffer.toString('utf-8').trimEnd());
    } finally {
        closeSync(fd);
    }
}

export const GET: RequestHandler = () => {
    try {
        init();
        return json(readEntry(randomInt(0, entryCount)));
    } catch (err) {
        console.error('[api/word] error:', err);
        return json({ error: String(err) }, { status: 500 });
    }
};