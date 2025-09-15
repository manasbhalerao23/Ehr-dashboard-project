import crypto from 'crypto';


const ALGO = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY_BASE64 || '', 'base64');
if (KEY.length !== 32) throw new Error('ENCRYPTION_KEY must be 32 bytes (base64)');


export function encryptJSON(obj: unknown) {
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv(ALGO, KEY, iv);
const plaintext = Buffer.from(JSON.stringify(obj), 'utf8');
const enc = Buffer.concat([cipher.update(plaintext), cipher.final()]);
const tag = cipher.getAuthTag();
return Buffer.concat([iv, tag, enc]).toString('base64');
}


export function decryptJSON(blobBase64: string) {
const data = Buffer.from(blobBase64, 'base64');
const iv = data.slice(0, 12);
const tag = data.slice(12, 28);
const enc = data.slice(28);
const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
decipher.setAuthTag(tag);
const out = Buffer.concat([decipher.update(enc), decipher.final()]);
return JSON.parse(out.toString('utf8'));
}