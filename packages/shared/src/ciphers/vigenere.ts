import { CipherResult, Step } from '../types';

export interface VigenereOptions {
    key: string;
    variant?: 'classic' | 'autokey'; // default 'classic'
    preserveCase?: boolean;          // default true
    stripPunctuation?: boolean;      // default false
}

export function vigenereEncrypt(plaintext: string, options: VigenereOptions): CipherResult {
    const { key, variant = 'classic', preserveCase = true, stripPunctuation = false } = options;
    let text = plaintext;
    const steps: Step[] = [];
    let stepNumber = 1;

    const cleanKey = key.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (cleanKey.length === 0) {
        throw new Error('Vigenere key must contain at least one letter.');
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Original Input',
        explanation: `Original text: "${plaintext}"\nInitial Key: "${cleanKey}"`
    });

    if (stripPunctuation) {
        text = text.replace(/[^A-Za-z]/g, '');
        steps.push({
            stepNumber: stepNumber++,
            title: 'Strip Punctuation',
            explanation: `Stripped punctuation and spaces from input: "${text}"`
        });
    }

    if (!preserveCase) {
        text = text.toUpperCase();
        steps.push({
            stepNumber: stepNumber++,
            title: 'Convert Case',
            explanation: `Converted input to uppercase: "${text}"`
        });
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Protocol Info',
        explanation: `Using ${variant === 'autokey' ? 'Autokey' : 'Classic'} Vigenere protocol.`
    });

    let ciphertext = '';
    let keyIndex = 0;
    let keystream = cleanKey;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[A-Za-z]/.test(char)) {
            const isUpper = char === char.toUpperCase();
            const base = isUpper ? 65 : 97;
            const ptCode = char.charCodeAt(0) - base;

            const currentKeyChar = keystream[keyIndex];
            const shift = currentKeyChar.charCodeAt(0) - 65;

            const newCode = (ptCode + shift) % 26;
            const newChar = String.fromCharCode(newCode + base);
            ciphertext += newChar;

            steps.push({
                stepNumber: stepNumber++,
                title: `Transforming '${char}'`,
                explanation: `Plaintext letter: '${char}' (value: ${ptCode})\nKey letter: '${currentKeyChar}' (value: ${shift})\nApply formula: (${ptCode} + ${shift}) % 26 = ${newCode}\nResulting letter: '${newChar}'`
            });

            if (variant === 'autokey') {
                keystream += String.fromCharCode(ptCode + 65);
            } else {
                if (keyIndex === keystream.length - 1) {
                    keystream += keystream;
                }
            }
            keyIndex++;
        } else {
            ciphertext += char;
            steps.push({
                stepNumber: stepNumber++,
                title: `Skipping '${char}'`,
                explanation: `Character '${char}' is not alphabetic, so it remains unchanged.`
            });
        }
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Final Result',
        explanation: `Final output: "${ciphertext}"`
    });

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { variant }
    };
}

export function vigenereDecrypt(ciphertext: string, options: VigenereOptions): CipherResult {
    const { key, variant = 'classic', preserveCase = true, stripPunctuation = false } = options;
    let text = ciphertext;
    const steps: Step[] = [];
    let stepNumber = 1;

    const cleanKey = key.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (cleanKey.length === 0) {
        throw new Error('Vigenere key must contain at least one letter.');
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Original Input',
        explanation: `Original text: "${ciphertext}"\nInitial Key: "${cleanKey}"`
    });

    if (stripPunctuation) {
        text = text.replace(/[^A-Za-z]/g, '');
        steps.push({
            stepNumber: stepNumber++,
            title: 'Strip Punctuation',
            explanation: `Stripped punctuation and spaces from input: "${text}"`
        });
    }

    if (!preserveCase) {
        text = text.toUpperCase();
        steps.push({
            stepNumber: stepNumber++,
            title: 'Convert Case',
            explanation: `Converted input to uppercase: "${text}"`
        });
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Protocol Info',
        explanation: `Using ${variant === 'autokey' ? 'Autokey' : 'Classic'} Vigenere protocol.`
    });

    let plaintext = '';
    let keyIndex = 0;
    let keystream = cleanKey;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[A-Za-z]/.test(char)) {
            const isUpper = char === char.toUpperCase();
            const base = isUpper ? 65 : 97;
            const ctCode = char.charCodeAt(0) - base;

            const currentKeyChar = keystream[keyIndex];
            const shift = currentKeyChar.charCodeAt(0) - 65;

            const newCode = (ctCode - shift + 26) % 26;
            const ptChar = String.fromCharCode(newCode + base);
            plaintext += ptChar;

            steps.push({
                stepNumber: stepNumber++,
                title: `Transforming '${char}'`,
                explanation: `Ciphertext letter: '${char}' (value: ${ctCode})\nKey letter: '${currentKeyChar}' (value: ${shift})\nApply formula: (${ctCode} - ${shift} + 26) % 26 = ${newCode}\nResulting letter: '${ptChar}'`
            });

            if (variant === 'autokey') {
                keystream += String.fromCharCode(newCode + 65);
            } else {
                if (keyIndex === keystream.length - 1) {
                    keystream += keystream;
                }
            }
            keyIndex++;
        } else {
            plaintext += char;
            steps.push({
                stepNumber: stepNumber++,
                title: `Skipping '${char}'`,
                explanation: `Character '${char}' is not alphabetic, so it remains unchanged.`
            });
        }
    }

    steps.push({
        stepNumber: stepNumber++,
        title: 'Final Result',
        explanation: `Final output: "${plaintext}"`
    });

    return {
        plaintext,
        ciphertext,
        steps,
        meta: { variant }
    };
}

export function calculateIC(text: string): number {
    const clean = text.replace(/[^A-Za-z]/g, '').toUpperCase();
    if (clean.length < 2) return 0;

    const counts: Record<string, number> = {};
    for (const c of clean) counts[c] = (counts[c] || 0) + 1;

    let sum = 0;
    const N = clean.length;
    for (const val of Object.values(counts)) {
        sum += val * (val - 1);
    }
    return sum / (N * (N - 1));
}
