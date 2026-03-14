import { useState } from 'react';
import type { CipherResult } from '@cryptiq/shared';
import { diffieHellmanProcess } from '@cryptiq/shared';
import { CipherInfoPanel } from './CipherInfoPanel';

export function DiffieHellmanView() {
    const [p, setP] = useState<string>('23');
    const [g, setG] = useState<string>('5');
    const [a, setA] = useState<string>('4');
    const [b, setB] = useState<string>('3');

    const [result, setResult] = useState<CipherResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCalculate = () => {
        setError(null);
        setResult(null);
        try {
            const pNum = parseInt(p, 10);
            const gNum = parseInt(g, 10);
            const aNum = parseInt(a, 10);
            const bNum = parseInt(b, 10);

            if (isNaN(pNum) || isNaN(gNum) || isNaN(aNum) || isNaN(bNum)) {
                setError('All inputs must be valid integers.');
                return;
            }

            const res = diffieHellmanProcess({ p: pNum, g: gNum, a: aNum, b: bNum });
            setResult(res);
        } catch (err: any) {
            setError(err.message || 'An error occurred during Key Exchange parameter building.');
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const secret = result.plaintext || result.ciphertext || '';
        const blob = new Blob([secret], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `diffie_hellman_result.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
        if (!result) return;
        const secret = result.plaintext || result.ciphertext || '';
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-purple-100 dark:border-gray-800 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5 pb-3 border-b border-purple-50 dark:border-gray-800">
                <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-400 tracking-tight">Diffie-Hellman Key Exchange</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                {/* Left Column (Inputs & Config) */}
                <div className="flex flex-col w-full md:w-[45%] lg:w-[40%] relative min-h-full space-y-4">
                    <div className="bg-purple-50/50 dark:bg-gray-800/50 p-5 rounded-lg border border-purple-100 dark:border-gray-700 space-y-4">
                        <h3 className="text-sm font-semibold mb-2 text-purple-800 dark:text-purple-300">
                            Public/Private Parameters
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2" title="A prime number shared publicly">Modulus Prime (p)</label>
                                <input
                                    type="number"
                                    value={p}
                                    onChange={(ev) => setP(ev.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-purple-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                                    placeholder="e.g. 23"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2" title="A generator less than p">Generator (g)</label>
                                <input
                                    type="number"
                                    value={g}
                                    onChange={(ev) => setG(ev.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-purple-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                                    placeholder="e.g. 5"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2" title="User A's Secret Integer">Secret Key (a)</label>
                                <input
                                    type="number"
                                    value={a}
                                    onChange={(ev) => setA(ev.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-purple-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                                    placeholder="e.g. 4"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2" title="User B's Secret Integer">Secret Key (b)</label>
                                <input
                                    type="number"
                                    value={b}
                                    onChange={(ev) => setB(ev.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-purple-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                                    placeholder="e.g. 3"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-6 pt-4 pb-2">
                        <button
                            onClick={handleCalculate}
                            className="w-full flex-1 py-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                        >
                            Execute Key Exchange
                        </button>
                    </div>

                    {result && (
                        <div className="pt-2">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-purple-800 dark:text-purple-300">
                                    Shared Secret Result
                                </label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-md border transition-colors ${copied
                                                ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                                                : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50/50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-blue-100 dark:border-blue-800'
                                            }`}
                                    >
                                        {copied ? 'Copied ✓' : 'Copy Result'}
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium px-3 py-1.5 bg-purple-50/50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-md border border-purple-100 dark:border-purple-800 transition-colors"
                                    >
                                        Download Result
                                    </button>
                                </div>
                            </div>
                            <div aria-live="polite" data-testid="cipher-output" className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-purple-100 dark:border-gray-700 text-purple-900 dark:text-purple-300 shadow-inner font-mono text-base break-all min-h-[4rem] transition-all duration-200">
                                {result.plaintext || result.ciphertext}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column (Execution Trace) */}
                <div className="flex flex-col w-full md:w-[55%] lg:w-[60%] border-t md:border-t-0 md:border-l border-purple-100 dark:border-gray-800 pt-6 md:pt-0 md:pl-6 lg:pl-8">
                    <h3 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-400 flex items-center">
                        Execution Trace
                    </h3>

                    {result && result.steps ? (
                        <div className="p-4 sm:p-5 rounded-xl border border-purple-100 dark:border-gray-800 bg-purple-50/30 dark:bg-gray-800/30 overflow-y-auto" style={{ maxHeight: '600px' }}>
                            <div className="space-y-4">
                                {result.steps.map((step, i) => (
                                    <div key={i} className="p-4 bg-white dark:bg-gray-800/80 rounded-lg border border-purple-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-4 transition-all hover:shadow-md">
                                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold text-sm">
                                            {step.stepNumber}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="font-semibold text-purple-900 dark:text-purple-300 text-base mb-2">
                                                {step.title}
                                            </h4>
                                            <p className="text-sm text-gray-700 dark:text-gray-400 font-mono whitespace-pre-wrap break-words">
                                                {step.explanation}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] p-8 rounded-xl border border-dashed border-purple-200 dark:border-gray-700 bg-purple-50/30 dark:bg-gray-800/10 text-center">
                            <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 dark:bg-gray-800 flex items-center justify-center text-purple-300 dark:text-gray-600">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h4 className="text-purple-800 dark:text-purple-400 font-medium mb-2">No Trace Available</h4>
                            <p className="text-purple-400 dark:text-gray-500 text-sm max-w-xs">
                                Enter parameters and execute to see how both entities arrive at the exact same cryptographically secure secret.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cipher Info Panel */}
            <CipherInfoPanel cipherId="diffieHellman" />
        </div>
    );
}
