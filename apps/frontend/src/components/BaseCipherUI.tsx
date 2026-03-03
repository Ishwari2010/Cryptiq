import { useState } from 'react';
import type { CipherResult } from '@cryptiq/shared';

// API Client for server mode
async function callApi(endpoint: string, payload: any) {
    const res = await fetch(`http://localhost:3000/api/v1/cipher/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API Error');
    return data;
}

export interface CipherUIProps {
    cipherId: string;
    name: string;
    renderOptions: (options: any, setOptions: (o: any) => void) => React.ReactNode;
    defaultOptions: any;
    clientEncrypt: (pt: string, opts: any) => CipherResult;
    clientDecrypt: (ct: string, opts: any) => CipherResult;
    renderVisualization?: (result: CipherResult, mode: 'encrypt' | 'decrypt') => React.ReactNode;
}

export function BaseCipherUI({ cipherId, name, renderOptions, defaultOptions, clientEncrypt, clientDecrypt, renderVisualization }: CipherUIProps) {
    const [inputText, setInputText] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [options, setOptions] = useState(defaultOptions);
    const [result, setResult] = useState<CipherResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [useLocalMode] = useState(true);

    const [outputText, setOutputText] = useState('');

    const [lastAction, setLastAction] = useState<'encrypt' | 'decrypt' | null>(null);
    const [isInputModified, setIsInputModified] = useState(false);

    const isLocalOnly = import.meta.env.VITE_LOCAL_ONLY === 'true';

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInputText(value);
        setIsInputModified(true);
        if (value.trim() === '') {
            setValidationError(null);
        } else if (!/^[A-Za-z\s]*$/.test(value)) {
            setValidationError("Only alphabetic characters are allowed for classical ciphers.");
        } else {
            setValidationError(null);
        }
    };

    const handleAction = async (action: 'encrypt' | 'decrypt') => {
        let textToProcess = inputText;

        if (action === 'decrypt') {
            if (lastAction === 'encrypt' && outputText !== '' && !isInputModified) {
                textToProcess = outputText;
                setInputText(outputText);
            }
        }

        if (textToProcess.trim() === '') {
            setValidationError('Please enter text before processing.');
            return;
        }
        if (validationError && isInputModified) {
            return;
        }

        setError(null);
        setResult(null);
        try {
            let res: CipherResult;
            if (isLocalOnly || useLocalMode) {
                // Run locally
                res = action === 'encrypt' ? clientEncrypt(textToProcess, options) : clientDecrypt(textToProcess, options);
            } else {
                // Run on server
                const payload = {
                    cipher: cipherId,
                    [action === 'encrypt' ? 'plaintext' : 'ciphertext']: textToProcess,
                    options
                };
                res = await callApi(action, payload);
            }
            setResult(res);
            setLastAction(action);
            setIsInputModified(false);

            if (action === 'encrypt') {
                setOutputText(res.ciphertext || res.plaintext || '');
            } else {
                setOutputText(res.plaintext || res.ciphertext || '');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during processing.');
        }
    };

    return (
        <div className="w-full bg-white shadow-lg rounded-2xl border border-purple-100 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5 pb-3 border-b border-purple-50">
                <h2 className="text-2xl font-semibold text-purple-800 tracking-tight">{name}</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                {/* Left Column (Inputs, Config, Output) */}
                <div className="flex flex-col w-full md:w-[45%] lg:w-[40%] relative min-h-full">
                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="block text-sm font-medium text-purple-800 mb-2">Input Text</label>
                            <textarea
                                value={inputText}
                                onChange={handleInputChange}
                                className={`w-full min-h-[120px] p-4 rounded-xl border ${validationError ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-purple-200 focus:ring-purple-400 focus:border-purple-400'} bg-white/50 backdrop-blur-sm focus:ring-2 outline-none transition-all duration-200 resize-y text-gray-800 placeholder-purple-300 shadow-inner`}
                                rows={5}
                                placeholder="Enter text here to encrypt or decrypt..."
                            ></textarea>
                            {validationError && (
                                <p className="text-red-500 text-sm mt-2">{validationError}</p>
                            )}
                        </div>

                        <div className="p-5 rounded-lg bg-purple-50/50 border border-purple-100">
                            <h3 className="text-sm font-semibold mb-4 text-purple-800">
                                Configuration Options
                            </h3>
                            {renderOptions(options, setOptions)}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {result && (
                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-purple-800">
                                        Output Result
                                    </label>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(outputText)}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-1.5 bg-blue-50/50 hover:bg-blue-100 rounded-md border border-blue-100 transition-colors"
                                    >
                                        Copy Output
                                    </button>
                                </div>
                                <div aria-live="polite" data-testid="cipher-output" className="p-4 rounded-xl bg-white border border-purple-100 text-purple-900 shadow-inner font-mono text-base break-all min-h-[4rem] transition-all duration-200">
                                    {outputText}
                                </div>

                                {renderVisualization && (
                                    <div className="mt-4">
                                        {renderVisualization(result, lastAction || 'encrypt')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons (Sticky at bottom) */}
                    <div className="sticky bottom-0 mt-6 pt-4 pb-2 bg-white/95 backdrop-blur-md flex flex-col sm:flex-row gap-4 border-t border-purple-50/50 z-10">
                        <button
                            onClick={() => handleAction('encrypt')}
                            className={`flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${(inputText.trim() === '' || !!validationError) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Encrypt
                        </button>
                        <button
                            onClick={() => handleAction('decrypt')}
                            className={`flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(inputText.trim() === '' || !!validationError) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Decrypt
                        </button>
                    </div>
                </div>

                {/* Right Column (Execution Trace) */}
                <div className="flex flex-col w-full md:w-[55%] lg:w-[60%] border-t md:border-t-0 md:border-l border-purple-100 pt-6 md:pt-0 md:pl-6 lg:pl-8">
                    <h3 className="text-xl font-semibold mb-4 text-purple-800 flex items-center">
                        Execution Trace
                    </h3>

                    {result && result.steps ? (
                        <div className="p-4 sm:p-5 rounded-xl border border-purple-100 bg-purple-50/30 overflow-y-auto" style={{ maxHeight: '800px' }}>
                            <div className="space-y-4">
                                {result.steps.map((step, i) => (
                                    <div key={i} className="p-4 bg-white rounded-lg border border-purple-100 shadow-sm flex flex-col sm:flex-row gap-4 transition-all hover:shadow-md">
                                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2 border-purple-200 bg-purple-50 text-purple-700 font-bold text-sm">
                                            {typeof step === 'string' ? i + 1 : step.stepNumber}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="font-semibold text-purple-900 text-base mb-2">
                                                {typeof step === 'string' ? `Step ${i + 1}` : step.title}
                                            </h4>
                                            <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap break-words">
                                                {typeof step === 'string' ? step : step.explanation}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] p-8 rounded-xl border border-dashed border-purple-200 bg-purple-50/30 text-center">
                            <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h4 className="text-purple-800 font-medium mb-2">No Trace Available</h4>
                            <p className="text-purple-400 text-sm max-w-xs">
                                Enter some text and click Encrypt or Decrypt to see the step-by-step execution details here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
