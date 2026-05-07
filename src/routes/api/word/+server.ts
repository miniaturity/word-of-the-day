// src/routes/api/word/+server.ts
import { json } from '@sveltejs/kit';
import { readFileSync, openSync, readSync, closeSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
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

const dataDir = dirname(fileURLToPath(import.meta.url));

function getDataPath(filename: string): string {
    return resolve(dataDir, '../../../lib/data/', filename);
}

function readEntry(i: number): DictionaryWord {
    const indexBuffer = readFileSync(getDataPath('dict.index'));
    const entryCount = indexBuffer.byteLength / 4;

    const fd = openSync(getDataPath('dict.ndjson'), 'r');

    try {
        const offset = indexBuffer.readUInt32LE(i * 4);
        const nextOffset = i + 1 < entryCount
            ? indexBuffer.readUInt32LE((i + 1) * 4)
            : offset + 512;

        const length = nextOffset - offset;
        const buffer = Buffer.alloc(length);
        readSync(fd, buffer, 0, length, offset);

        return JSON.parse(buffer.toString('utf-8').trimEnd());
    } finally {
        closeSync(fd);
    }
}

export const GET: RequestHandler = () => {
    const indexBuffer = readFileSync(getDataPath('dict.index'));
    const entryCount = indexBuffer.byteLength / 4;

    const i = randomInt(0, entryCount);
    const entry = readEntry(i);
    return json(entry);
};