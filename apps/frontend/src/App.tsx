import { useState } from 'react';
import { CaesarView } from './components/CaesarView';
import { VigenereView } from './components/VigenereView';
import { HillView } from './components/HillView';
import { PlayfairView } from './components/PlayfairView';
import { RailFenceView } from './components/RailFenceView';
import { ColumnarView } from './components/ColumnarView';

type CipherTab = 'caesar' | 'vigenere' | 'hill' | 'playfair' | 'railfence' | 'columnar';

function App() {
  const [activeTab, setActiveTab] = useState<CipherTab>('caesar');
  const tabs: { id: CipherTab, label: string }[] = [
    { id: 'caesar', label: 'Caesar Cipher' },
    { id: 'vigenere', label: 'Vigenere Cipher' },
    { id: 'hill', label: 'Hill Cipher' },
    { id: 'playfair', label: 'Playfair Cipher' },
    { id: 'railfence', label: 'Rail Fence Cipher' },
    { id: 'columnar', label: 'Columnar Transposition' },
  ];

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden transition-colors duration-200 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 text-gray-900">

      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-30 w-full h-14 flex-shrink-0 bg-white/80 backdrop-blur border-b border-purple-100 shadow-sm transition-colors duration-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-purple-800">
                Cryptiq
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-1 w-full overflow-hidden">

        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-purple-100 bg-white/70 backdrop-blur-md overflow-y-auto">
          <div className="p-6 space-y-8">
            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold mb-3 text-purple-400 ml-2">Available Ciphers</h2>
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition duration-150 flex items-center justify-between
                      ${activeTab === tab.id
                        ? 'bg-purple-200 text-purple-900'
                        : 'text-gray-500 hover:bg-purple-50 hover:text-purple-900'
                      }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Selected Cipher View */}
        <main className="w-full flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === 'caesar' && <CaesarView />}
          {activeTab === 'vigenere' && <VigenereView />}
          {activeTab === 'hill' && <HillView />}
          {activeTab === 'playfair' && <PlayfairView />}
          {activeTab === 'railfence' && <RailFenceView />}
          {activeTab === 'columnar' && <ColumnarView />}
        </main>
      </div>
    </div>
  );
}

export default App;
