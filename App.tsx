import React, { useState, useCallback } from 'react';
import { DropZone } from './components/DropZone';
import { HistoryItem } from './components/HistoryItem';
import { ConvertedFile, ConversionStatus } from './types';
import { convertWebPToPng, downloadBlob } from './utils/converter';

const App: React.FC = () => {
  const [items, setItems] = useState<ConvertedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = useCallback(async (files: File[]) => {
    setIsProcessing(true);

    // Filter for webp or images
    const validFiles = files.filter(f => 
      f.type === 'image/webp' || 
      f.name.toLowerCase().endsWith('.webp')
    );

    if (validFiles.length === 0 && files.length > 0) {
      alert("Please upload .webp files.");
      setIsProcessing(false);
      return;
    }

    // Initialize placeholders
    const newItems: ConvertedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      originalName: file.name,
      newName: file.name.replace(/\.webp$/i, '.png'),
      blob: new Blob(),
      url: '',
      status: ConversionStatus.PROCESSING,
      timestamp: Date.now(),
      size: 0
    }));

    setItems(prev => [...newItems, ...prev]);

    // Process each file
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const itemConfig = newItems[i];

      try {
        const pngBlob = await convertWebPToPng(file);
        const objectUrl = URL.createObjectURL(pngBlob);

        // Update state with success
        setItems(prev => prev.map(item => {
          if (item.id === itemConfig.id) {
            return {
              ...item,
              status: ConversionStatus.COMPLETED,
              blob: pngBlob,
              url: objectUrl,
              size: pngBlob.size
            };
          }
          return item;
        }));

        // Auto download
        downloadBlob(objectUrl, itemConfig.newName);

      } catch (error) {
        console.error("Conversion failed for", file.name, error);
        // Update state with error
        setItems(prev => prev.map(item => {
          if (item.id === itemConfig.id) {
            return {
              ...item,
              status: ConversionStatus.ERROR,
              error: 'Failed to convert'
            };
          }
          return item;
        }));
      }
    }

    setIsProcessing(false);
  }, []);

  const handleManualDownload = (item: ConvertedFile) => {
    if (item.url && item.status === ConversionStatus.COMPLETED) {
      downloadBlob(item.url, item.newName);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-brand-500/30">
      
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-brand-500/10 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          WebP to PNG <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Converter</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Drag and drop your WebP images to automatically convert them to PNG and download them instantly. No server uploads.
        </p>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-3xl space-y-8">
        
        <DropZone onFilesDropped={processFiles} isProcessing={isProcessing} />

        {/* List of recent conversions */}
        {items.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-semibold text-slate-200">Recent Conversions</h2>
                <button 
                  onClick={() => setItems([])}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear History
                </button>
             </div>
             <div className="space-y-3">
               {items.map(item => (
                 <HistoryItem 
                    key={item.id} 
                    item={item} 
                    onDownload={handleManualDownload} 
                 />
               ))}
             </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-center text-sm text-slate-600">
        <p>&copy; {new Date().getFullYear()} WebP Converter. Runs entirely in your browser.</p>
      </footer>

    </div>
  );
};

export default App;
