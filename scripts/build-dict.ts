import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const dict = JSON.parse(readFileSync(resolve('src/lib/data/dict.json'), 'utf-8'));

let ndjson = '';
const offsets: number[] = [];
let byteOffset = 0;

for (const entry of dict) {
    const line = JSON.stringify(entry) + '\n';
    offsets.push(byteOffset);
    byteOffset += Buffer.byteLength(line, 'utf-8');
    ndjson += line;
}

writeFileSync(resolve('src/lib/data/dict.ndjson'), ndjson, 'utf-8');
    
const indexBuffer = Buffer.alloc(offsets.length * 4);
for (let i = 0; i < offsets.length; i++) {
    indexBuffer.writeUInt32LE(offsets[i], i * 4);
}
writeFileSync(resolve('src/lib/data/dict.index'), indexBuffer);

console.log(`Done. ${offsets.length} entries, index is ${indexBuffer.byteLength} bytes.`);