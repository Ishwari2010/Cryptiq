import { BaseCipherUI } from './BaseCipherUI';
import { ToggleOption } from './ToggleOption';
import { vigenereEncrypt, vigenereDecrypt } from '@cryptiq/shared';
import type { VigenereOptions } from '@cryptiq/shared';

export function VigenereView() {
    return (
        <BaseCipherUI
            cipherId="vigenere"
            name="Vigenere Cipher"
            defaultOptions={{ key: 'LEMON', variant: 'classic', preserveCase: true, stripPunctuation: false }}
            clientEncrypt={(pt, opts) => vigenereEncrypt(pt, opts as VigenereOptions)}
            clientDecrypt={(ct, opts) => vigenereDecrypt(ct, opts as VigenereOptions)}
            renderOptions={(options, setOptions) => (
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Keyword</label>
                        <input
                            type="text"
                            value={options.key}
                            onChange={e => setOptions({ ...options, key: e.target.value })}
                            className="w-32 p-2 rounded-lg border border-purple-200 bg-white/50 focus:ring-2 focus:ring-purple-400 outline-none transition-colors uppercase placeholder-purple-300"
                            placeholder="e.g. KEYWORDS"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Variant</label>
                        <select
                            value={options.variant}
                            onChange={e => setOptions({ ...options, variant: e.target.value })}
                            className="p-2 rounded-lg border border-purple-200 bg-white/50 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                        >
                            <option value="classic">Classic (Repeating)</option>
                            <option value="autokey">Autokey</option>
                        </select>
                    </div>
                    <div className="flex flex-col space-y-3 sm:pt-1">
                        <ToggleOption
                            label="Preserve Case"
                            checked={options.preserveCase}
                            onChange={checked => setOptions({ ...options, preserveCase: checked })}
                            tooltip="Keeps uppercase and lowercase letters unchanged during encryption."
                        />
                        <ToggleOption
                            label="Strip Punctuation"
                            checked={options.stripPunctuation}
                            onChange={checked => setOptions({ ...options, stripPunctuation: checked })}
                            tooltip="Removes punctuation before processing the cipher."
                        />
                    </div>
                </div>
            )}
        />
    );
}
