import { json } from '@sveltejs/kit';
import { read } from '$app/server';
import { randomInt } from 'crypto';
import type { RequestHandler } from './$types';

import dictIndexUrl from '../../../../data/dict.index?url';
import dictDataUrl from '../../../../data/dict.ndjson?url';

export const config = {
    runtime: 'nodejs22.x'
};

interface DictionaryWord {
    word: string;
    pos: string;
    definition: string;
}

let indexBuffer: Buffer | null = null;
let dataBuffer: Buffer | null = null;
let entryCount = 0;

async function init() {
    if (indexBuffer) return;

    indexBuffer = Buffer.from(await read(dictIndexUrl).arrayBuffer());
    dataBuffer  = Buffer.from(await read(dictDataUrl).arrayBuffer());
    entryCount  = indexBuffer.byteLength / 4;
}

function readEntry(i: number): DictionaryWord {
    const offset     = indexBuffer!.readUInt32LE(i * 4);
    const nextOffset = i + 1 < entryCount
        ? indexBuffer!.readUInt32LE((i + 1) * 4)
        : offset + 512;

    return JSON.parse(
        dataBuffer!.slice(offset, nextOffset).toString('utf-8').trimEnd()
    );
}

export const GET: RequestHandler = async () => {
    try {
        await init();
        return json(readEntry(randomInt(0, entryCount)));
    } catch (err) {
        console.error('[api/word] error:', err);
        return json({ error: String(err) }, { status: 500 });
    }
};