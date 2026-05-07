import { json } from '@sveltejs/kit';
import { readFileSync, openSync, readSync, closeSync } from 'fs';
import { resolve } from 'path';
import { randomInt } from 'crypto';
import type { RequestHandler } from './$types';

export const config = {
    runtime: 'nodejs22.x',
    includeFiles: ['src/lib/data/dict.index', 'src/lib/data/dict.ndjson']
};

interface DictionaryWord {
    word: string;
    pos: string;
    definition: string;
}

const INDEX_PATH = resolve(process.cwd(), 'src/lib/data/dict.index');
const NDJSON_PATH = resolve(process.cwd(), 'src/lib/data/dict.ndjson');

const indexBuffer = readFileSync(INDEX_PATH);
const entryCount = indexBuffer.byteLength / 4;

function readEntry(i: number): DictionaryWord {
    const fd = openSync(NDJSON_PATH, 'r');
    try {
        const offset = indexBuffer.readUInt32LE(i * 4);
        const nextOffset = i + 1 < entryCount
            ? indexBuffer.readUInt32LE((i + 1) * 4)
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
        const i = randomInt(0, entryCount);
        return json(readEntry(i));
    } catch (err) {
        console.error('[api/word] error:', err);
        return json({ error: String(err) }, { status: 500 });
    }
};