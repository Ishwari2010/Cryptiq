import { calculateIC } from '../ciphers/vigenere'; // We can reuse IC calculation

export interface CipherGuess {
    cipher: string;
    confidence: number;
    notes: string[];
}

const ENGLISH_FREQUENCIES: Record<string, number> = {
    A: 8.167, B: 1.492, C: 2.782, D: 4.253, E: 12.702,
    F: 2.228, G: 2.015, H: 6.094, I: 6.966, J: 0.153,
    K: 0.772, L: 4.025, M: 2.406, N: 6.749, O: 7.507,
    P: 1.929, Q: 0.095, R: 5.987, S: 6.327, T: 9.056,
    U: 2.758, V: 0.978, W: 2.360, X: 0.150, Y: 1.974, Z: 0.074
};

export function analyzeFrequency(text: string): Record<string, number> {
    const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
    const freqs: Record<string, number> = {};
    for (let i = 0; i < 26; i++) {
        freqs[String.fromCharCode(65 + i)] = 0;
    }

    for (const char of clean) {
        freqs[char]++;
    }

    if (clean.length > 0) {
        for (const char in freqs) {
            freqs[char] = (freqs[char] / clean.length) * 100;
        }
    }
    return freqs;
}

export function calculateChiSquare(actualFreqs: Record<string, number>): number {
    let chiSquare = 0;
    for (let i = 0; i < 26; i++) {
        const char = String.fromCharCode(65 + i);
        const observed = actualFreqs[char];
        const expected = ENGLISH_FREQUENCIES[char];
        if (expected > 0) {
            chiSquare += Math.pow(observed - expected, 2) / expected;
        }
    }
    return chiSquare;
}

export function guessCipher(ciphertext: string): CipherGuess[] {
    const clean = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
    if (clean.length < 10) {
        return [{ cipher: 'Unknown', confidence: 0, notes: ['Ciphertext too short for reliable analysis.'] }];
    }

    const guesses: CipherGuess[] = [];
    const ic = calculateIC(clean);
    const freqs = analyzeFrequency(clean);
    const chiSq = calculateChiSquare(freqs);

    // 1. Check Index of Coincidence
    if (ic > 0.06) {
        // High IC means monoalphabetic or transposition
        if (chiSq < 50) {
            guesses.push({
                cipher: 'Transposition (Rail Fence / Columnar)',
                confidence: 0.85,
                notes: [
                    `IC is ${ic.toFixed(3)} (close to English 0.066).`,
                    `Letter frequencies closely match English (Chi-Sq: ${chiSq.toFixed(1)}).`,
                    'Likely a transposition cipher.'
                ]
            });
        } else {
            guesses.push({
                cipher: 'Caesar',
                confidence: 0.75,
                notes: [
                    `IC is ${ic.toFixed(3)} (close to English 0.066).`,
                    `Letter frequencies do not match plain English (Chi-Sq: ${chiSq.toFixed(1)}), indicating a shift or substitution.`,
                    'Likely a monoalphabetic substitution like Caesar.'
                ]
            });
        }
    } else {
        // Low IC means polyalphabetic or polygraphic
        guesses.push({
            cipher: 'Vigenere / Hill / Playfair',
            confidence: 0.8,
            notes: [
                `IC is ${ic.toFixed(3)} (lower than English 0.066).`,
                'Indicates a polyalphabetic or polygraphic cipher.'
            ]
        });

        // Playfair specific heuristics
        if (!clean.includes('J') && clean.length % 2 === 0) {
            guesses.find(g => g.cipher.includes('Vigenere'))!.confidence -= 0.1;
            guesses.push({
                cipher: 'Playfair',
                confidence: 0.6,
                notes: [
                    'No "J" found in the ciphertext.',
                    'Length is even, which is required for digraphs.'
                ]
            });
        }
    }

    // Sort by confidence
    guesses.sort((a, b) => b.confidence - a.confidence);

    return guesses;
}
