# Cryptiq User Guide

Welcome to Cryptiq! This toolkit allows you to explore classical ciphers in an educational and interactive way.

## Features

- **Six Classical Ciphers**: Caesar, Vigenere, Hill, Playfair, Rail Fence, and Columnar Transposition.
- **Step-by-Step Explanations**: Enable "Explain Steps" to see the mathematical and logical transformations that occurred during encryption or decryption.
- **Local Mode**: For maximum privacy, keep "Local Mode" checked. All operations will happen entirely in your browser without communicating with our servers.
- **Cryptanalysis**: Use built-in heuristics to analyze ciphertexts and automatically detect the likely cipher used based on frequency analysis and Index of Coincidence (IC).

## Getting Started

1. **Select a Cipher**: Use the sidebar on the left to select the cipher you wish to use.
2. **Configure Settings**: Enter your keys, passwords, matrix sizes, or shift amounts.
3. **Input Text**: Provide the text you wish to encrypt or decrypt.
4. **Action**: Click `Encrypt` or `Decrypt`.

### Cipher Specifics

- **Hill Cipher**: Uses matrix multiplication modulo 26. Not all matrices are valid (the determinant must be coprime with 26). The UI will let you know if your key matrix is invalid.
- **Playfair Cipher**: Uses a 5x5 grid (J is merged with I). Double letters are split using the "Filler Char" (default X).
- **Vigenere Autokey**: The keystream is formed by appending the plaintext (or recovered plaintext) to the secret keyword.

## Attack Tutorial: Breaking the Caesar Cipher

If you intercept a message and suspect it's a Caesar cipher, you don't need the key! 
1. The app includes a brute-force capability.
2. Under "Analysis Tools" (coming soon to the UI), select "Auto-Detect Cipher".
3. The tool will calculate the Chi-Square score of the letter frequencies to determine the correct shift automatically.

Happy decoding!
