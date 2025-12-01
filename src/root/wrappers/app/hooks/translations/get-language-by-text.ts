import AR from './languages/ar/translation.json';
import CH from './languages/zh/translation.json';
import EN from './languages/en/translation.json';
import ES from './languages/es/translation.json';
import RU from './languages/ru/translation.json';

const symbolMap = new Map<string, string>();
const langMaps = new Map<string, Set<string>>();

const languages = [
    ['es-ES', ES],
    ['en-US', EN],
    ['ar-AR', AR],
    ['ru-RU', RU],
    ['zh-CN', CH],
] as unknown as [[string, Record<string, string>]];

languages.forEach(([lang, list]) => {
    const set = new Set<string>();
    const letters: string = Object.values(list).join() as unknown as string;

    for (let symbol of letters) {
        const isChar = /^\p{L}$/u.test(symbol);
        if (isChar) {
            symbol = symbol.toLowerCase();
            set.add(symbol);
            symbolMap.set(symbol, lang);
        }
    }

    const myArray = [...set].sort();
    langMaps.set(lang, new Set(myArray));
});

export const getLanguageByText = (text: string) => {
    const map = new Map<string, number>(Array.from(languages).map(([lang]) => [lang, 0]));

    const spanishChars = /[ñÑáéíóúÁÉÍÓÚüÜ¿¡]/;
    if (spanishChars.test(text)) return 'es-ES';

    for (const symbol of text) {
        const isChar = /^\p{L}$/u.test(symbol);
        if (!isChar) continue;

        const lang = symbolMap.get(symbol);
        if (!lang) continue;

        const sum = map.get(lang);
        if (sum === undefined) continue;

        map.set(lang, sum + 1);
    }

    return [...map].reduce((prev, current) => (prev[1] > current[1] ? prev : current))[0];
};
