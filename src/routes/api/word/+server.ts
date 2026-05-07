import { json } from '@sveltejs/kit';
import { readFileSync, openSync, readSync, closeSync } from 'fs';
import { fileURLToPath } from 'url';
import { randomInt } from 'crypto';
import type { RequestHandler } from './$types';

export const config = {
    runtime: 'nodejs22.x',
    // paths are now relative to project root, co-located with the route
    // please fix
    includeFiles: [
        'src/routes/api/word/dict.index',
        'src/routes/api/word/dict.ndjson'
    ]
};

interface DictionaryWord {
    word: string;
    pos: string;
    definition: string;
}


const INDEX_PATH = fileURLToPath(new URL('./dict.index', import.meta.url));
const NDJSON_PATH = fileURLToPath(new URL('./dict.ndjson', import.meta.url));

const indexBuffer = readFileSync(INDEX_PATH);
const entryCount = indexBuffer.byteLength / 4;

function readEntry(i: number): DictionaryWord {
    const fd = openSync(NDJSON_PATH, 'r');
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
    try {
        const i = randomInt(0, entryCount);
        const entry = readEntry(i);
        return json(entry);
    } catch (err) {
        // Check Vercel function logs for this output
        console.error('[/api/word] failed:', err);
        return json({ error: String(err) }, { status: 500 });
    }
};