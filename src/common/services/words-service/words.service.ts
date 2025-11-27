import { words } from './words.json';
import { GenerateType } from './types/generate.type.ts';
import { sha256 } from 'sha.js';
import { Envs } from '../../config/envs/envs.ts';

const wordsSet: Set<string> = new Set<string>(words);

export class WordsService {
    public static words = words;
    public static generate({ exactly, maxLength, minLength }: GenerateType): string[] {
        const generatedWords: string[] = [];
        while (generatedWords.length !== exactly) {
            const random = Math.floor(Math.random() * (1900 - generatedWords.length));
            const randomWord = words[random];

            if (maxLength && maxLength < randomWord.length) continue;
            if (minLength && minLength > randomWord.length) continue;
            if (generatedWords.find((word) => word === randomWord)) continue;

            generatedWords.push(randomWord);
        }

        return generatedWords;
    }

    public static isExists(word: string): boolean {
        if (word === '') return true;
        return wordsSet.has(word.toLowerCase());
    }

    public static hashPassphrase = (words: string[] | string): string => {
        let strWords;

        if (typeof words === 'string') strWords = words;
        else strWords = words.join('');

        const firstPass = new sha256().update(strWords + Envs.appSalt).digest('hex');
        return firstPass + new sha256().update(firstPass).digest('hex');
    };
}
