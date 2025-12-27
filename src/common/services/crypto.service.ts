import { RsaKeysStringType } from '../../root/types/keys/create-rsa-keys.type.ts';
import { FilesType, MimetypeEnum } from '../../root/types/files/types.ts';
import { createHmac } from 'crypto';
import { Envs } from '../config/envs/envs.ts';
import { mnemonicNew } from 'ton-crypto';

const iterations = 1000000;
const keyLength = 256;

export class CryptoService {
    public static async generateRSAKeys(): Promise<CryptoKeyPair> {
        return window.crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 4096,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: 'SHA-512',
            },
            true,
            ['encrypt', 'decrypt'],
        );
    }

    public static generateEd25519Key(): Promise<CryptoKeyPair> {
        return crypto.subtle.generateKey({ name: 'Ed25519' }, false, ['sign', 'verify']) as Promise<CryptoKeyPair>;
    }

    public static async generateAESKey(
        passphrase: string | undefined = undefined,
        extractable: boolean = true,
    ): Promise<CryptoKey> {
        if (!passphrase?.length)
            passphrase = await mnemonicNew(24)
                .then((result) => result.join(' '))
                .catch(() => window.crypto.randomUUID());

        const salt = new TextEncoder().encode(this.getHash(passphrase));
        const key = await window.crypto.subtle.importKey('raw', salt, 'PBKDF2', false, ['deriveKey']);

        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt,
                iterations,
                hash: 'SHA-256',
            },
            key,
            { name: 'AES-GCM', length: keyLength },
            extractable,
            ['encrypt', 'decrypt'],
        );
    }

    public static async generateAndExportAesKey(
        passphrase: string | undefined = undefined,
        extractable: boolean = true,
    ): Promise<string> {
        const aesKey = await this.generateAESKey(passphrase, extractable);
        return this.exportKey(aesKey);
    }

    public static async exportKey(key: CryptoKey | string): Promise<string> {
        const cryptoKey = key instanceof CryptoKey ? key : (JSON.parse(key) as CryptoKey);

        const exportedKey = await window.crypto.subtle.exportKey('jwk', cryptoKey);
        exportedKey.alg = undefined;

        return JSON.stringify(exportedKey);
    }

    public static importEd25519Key(key: JsonWebKey | string, keyUsages: ReadonlyArray<KeyUsage>) {
        try {
            const jsonWebKey = typeof key === 'string' ? (JSON.parse(key) as JsonWebKey) : key;

            return crypto.subtle.importKey('jwk', jsonWebKey, { name: 'Ed25519' }, true, keyUsages);
        } catch (e) {
            return undefined;
        }
    }

    public static importEASKey(key: JsonWebKey | string, extractable = true): Promise<CryptoKey> {
        const jsonWebKey = typeof key === 'string' ? (JSON.parse(key) as JsonWebKey) : key;
        return window.crypto.subtle.importKey('jwk', jsonWebKey, { name: 'AES-GCM', length: keyLength }, extractable, [
            'encrypt',
            'decrypt',
        ]);
    }

    public static async importRSAKeys({
        publicKey,
        privateKey,
    }: RsaKeysStringType): Promise<CryptoKeyPair | undefined> {
        const [importedPublicKey, importedPrivateKey] = await Promise.all([
            this.importRSAKey(publicKey, ['encrypt']),
            this.importRSAKey(privateKey, ['decrypt']),
        ]);
        if (!importedPublicKey || !importedPrivateKey) return;

        return { publicKey: importedPublicKey, privateKey: importedPrivateKey };
    }

    public static importRSAKey(
        key: JsonWebKey | string,
        keyUsages: ReadonlyArray<KeyUsage>,
    ): Promise<CryptoKey> | undefined {
        try {
            const jsonWebKey = typeof key === 'string' ? (JSON.parse(key) as JsonWebKey) : key;
            return window.crypto.subtle.importKey(
                'jwk',
                jsonWebKey,
                {
                    name: 'RSA-OAEP',
                    hash: 'SHA-512',
                },
                true,
                keyUsages,
            );
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    public static async encryptByRSAKey(key: CryptoKey, payload: unknown): Promise<string | undefined> {
        try {
            const encryptedData = await window.crypto.subtle.encrypt(
                {
                    name: 'RSA-OAEP',
                },
                key,
                new TextEncoder().encode(JSON.stringify(payload)),
            );
            return exportEncryptedPayload(encryptedData);
        } catch (error) {
            return undefined;
        }
    }

    public static async encryptByAESKey(key: CryptoKey, payload: unknown): Promise<string | undefined> {
        try {
            const data = new TextEncoder().encode(JSON.stringify(payload));
            const encryptedData = await window.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: new Uint8Array(16),
                },
                key,
                data,
            );
            return exportEncryptedPayload(encryptedData);
        } catch (error) {
            return undefined;
        }
    }

    public static async decryptByAESKey<T = string>(key: CryptoKey, payload: string): Promise<T | undefined> {
        try {
            const decryptedPayload = importEncryptedPayload(payload);
            const decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: new Uint8Array(16),
                },
                key,
                decryptedPayload,
            );
            const string = new TextDecoder().decode(decryptedData);
            return JSON.parse(string) as T;
        } catch (error) {
            return undefined;
        }
    }

    public static async decryptFile(blob: Blob, fileType: MimetypeEnum | undefined, key: CryptoKey) {
        const buffer = await blob.arrayBuffer();
        const data = new Uint8Array(buffer);

        const iv = data.slice(0, 16);
        const ciphertext = data.slice(16);

        const decrypted = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv,
            },
            key,
            ciphertext,
        );

        return new Blob([decrypted], { type: fileType });
    }

    public static async encryptFile(file: File, key: CryptoKey): Promise<FilesType> {
        const iv = crypto.getRandomValues(new Uint8Array(16));
        const fileBuffer = await file.arrayBuffer();

        const encrypted = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv,
            },
            key,
            fileBuffer,
        );

        const encryptedBlob = new Blob([iv, new Uint8Array(encrypted)], {
            type: 'application/octet-stream',
        });

        return new File([encryptedBlob], file.name, { type: file.type }) as FilesType;
    }

    public static async decryptByRSAKey<T = string>(key: CryptoKey, payload: string): Promise<T | undefined> {
        try {
            const decryptedPayload = importEncryptedPayload(payload);
            const decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: 'RSA-OAEP',
                },
                key,
                decryptedPayload,
            );
            const string = new TextDecoder().decode(decryptedData);
            return JSON.parse(string) as T;
        } catch (e) {
            return undefined;
        }
    }

    public static getHash(value: string): string {
        return createHmac('sha256', Envs.appSalt).update(value).digest('hex');
    }
}

function exportEncryptedPayload(payload: ArrayBuffer): string {
    const uint8Array = new Uint8Array(payload);
    return JSON.stringify(uint8Array.toString());
}

function importEncryptedPayload(payload: string): ArrayBuffer {
    const string = JSON.parse(payload) as string;
    const numbers = string.split(',').map((number) => Number(number));
    return new Uint8Array(numbers).buffer as ArrayBuffer;
}
