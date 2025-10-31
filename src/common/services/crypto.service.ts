import { CreateRsaKeysType, RsaKeysStringType } from '../../root/types/create-rsa-keys.type.ts';
import { WordsService } from './words-service/words.service.ts';
import { IKeys } from '../../root/types/keys.type.ts';

const iterations = 1000;
const keyLength = 256;

export class CryptoService {
    public static async generateExportRSAKeys(): Promise<RsaKeysStringType> {
        const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 4096,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: 'SHA-512',
            },
            true,
            ['encrypt', 'decrypt'],
        );

        const [publicExportedKey, privateExportedKey] = await Promise.all([
            this.exportKey(publicKey),
            this.exportKey(privateKey),
        ]);

        return { publicKey: publicExportedKey, privateKey: privateExportedKey };
    }

    public static async generateExportEncryptRSAKeys(passphrase: string | CryptoKey): Promise<CreateRsaKeysType> {
        const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 4096,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: 'SHA-512',
            },
            true,
            ['encrypt', 'decrypt'],
        );

        const [publicExportedKey, privateExportedKey] = await Promise.all([
            this.exportKey(publicKey),
            this.exportKey(privateKey),
        ]);

        const aesKey = typeof passphrase === 'string' ? await this.generateAESKey(passphrase) : passphrase;
        const encryptPrivateKey = await this.encryptByAESKey(aesKey, privateExportedKey);

        return { publicKey: publicExportedKey, encryptPrivateKey };
    }

    public static async generateAESKey(passphrase?: string): Promise<CryptoKey> {
        const passphraseForSalt =
            passphrase ?? (WordsService.generate({ exactly: 24, maxLength: 10, minLength: 3 }) as string[]);
        const salt = new TextEncoder().encode(WordsService.hashPassphrase(passphraseForSalt));
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
            true,
            ['encrypt', 'decrypt'],
        );
    }

    public static async generateAndExportAesKey(passphrase?: string): Promise<string> {
        const aesKey = await this.generateAESKey(passphrase);
        return this.exportKey(aesKey);
    }

    public static async exportKey(key: CryptoKey | string): Promise<string> {
        const cryptoKey = key instanceof CryptoKey ? key : (JSON.parse(key) as CryptoKey);

        const exportedKey = await window.crypto.subtle.exportKey('jwk', cryptoKey);

        return JSON.stringify(exportedKey);
    }

    public static importEASKey(key: JsonWebKey | string): Promise<CryptoKey> {
        const jsonWebKey = typeof key === 'string' ? (JSON.parse(key) as JsonWebKey) : key;
        return window.crypto.subtle.importKey('jwk', jsonWebKey, { name: 'AES-GCM', length: keyLength }, true, [
            'encrypt',
            'decrypt',
        ]);
    }

    public static async importRSAKeys({ publicKey, privateKey }: RsaKeysStringType): Promise<CryptoKeyPair> {
        const [importedPublicKey, importedPrivateKey] = await Promise.all([
            this.importRSAKey(publicKey, ['encrypt']),
            this.importRSAKey(privateKey, ['decrypt']),
        ]);

        return { publicKey: importedPublicKey, privateKey: importedPrivateKey };
    }

    public static async importDecryptRSAKeys(
        { publicKey, privateKey }: IKeys,
        passphrase: string | CryptoKey,
    ): Promise<CryptoKeyPair> {
        const myAESKey = typeof passphrase === 'string' ? await this.generateAESKey(passphrase) : passphrase;
        const importPrivateKey = await this.decryptByAESKey(myAESKey, privateKey);

        const [importedPublicKey, importedPrivateKey] = await Promise.all([
            this.importRSAKey(publicKey, ['encrypt']),
            this.importRSAKey(importPrivateKey, ['decrypt']),
        ]);

        return { publicKey: importedPublicKey, privateKey: importedPrivateKey };
    }

    public static importRSAKey(key: JsonWebKey | string, keyUsages: ReadonlyArray<KeyUsage>): Promise<CryptoKey> {
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
    }

    public static async encryptByRSAKey(key: CryptoKey, payload: unknown): Promise<string> {
        const encryptedData = await window.crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP',
            },
            key,
            new TextEncoder().encode(JSON.stringify(payload)),
        );
        return exportEncryptedPayload(encryptedData);
    }

    public static async encryptByAESKey(key: CryptoKey, payload: unknown): Promise<string> {
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
    }

    public static async decryptByAESKey<T = string>(key: CryptoKey, payload: string): Promise<T> {
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
    }

    public static async decryptByRSAKey<T = string>(key: CryptoKey, payload: string): Promise<T> {
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
