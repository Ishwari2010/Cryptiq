import { vigenereEncrypt, vigenereDecrypt, calculateIC } from './vigenere';

describe('Vigenere Cipher', () => {
    it('encrypts classic vigenere correctly', () => {
        const result = vigenereEncrypt('ATTACKATDAWN', { key: 'LEMON' });
        expect(result.ciphertext).toBe('LXFOPVEFRNHR');
    });

    it('decrypts classic vigenere correctly', () => {
        const result = vigenereDecrypt('LXFOPVEFRNHR', { key: 'LEMON' });
        expect(result.plaintext).toBe('ATTACKATDAWN');
    });

    it('encrypts autokey vigenere correctly', () => {
        const result = vigenereEncrypt('ATTACKATDAWN', { key: 'LEMON', variant: 'autokey' });
        // Key:    LEMONATTACKA
        // Text:   ATTACKATDAWN
        // Result: LXFOPKTMDCGN
        expect(result.ciphertext).toBe('LXFOPKTMDCGN');
    });

    it('decrypts autokey vigenere correctly', () => {
        const result = vigenereDecrypt('LXFOPKTMDCGN', { key: 'LEMON', variant: 'autokey' });
        expect(result.plaintext).toBe('ATTACKATDAWN');
    });

    it('preserves casing and punctuation', () => {
        const result = vigenereEncrypt('Attack at dawn!', { key: 'LEMON' });
        expect(result.ciphertext).toBe('Lxfopv ef rnhr!');
    });

    it('calculates IC correctly (approx English)', () => {
        const text = 'THIS IS A LONGER PIECE OF ENGLISH TEXT THAT WE CAN USE TO CALCULATE THE INDEX OF COINCIDENCE IT MIGHT BE HIGH ENOUGH TO SHOW NON RANDOMNESS';
        const ic = calculateIC(text);
        // IC for English is normally ~0.066, random is 0.038
        expect(ic).toBeGreaterThan(0.05);
    });
});
