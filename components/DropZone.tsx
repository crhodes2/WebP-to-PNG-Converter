import React, { useState, useRef, useCallback } from 'react';
import { DropZoneProps } from '../types';

export const DropZone: React.FC<DropZoneProps> = ({ onFilesDropped, isProcessing }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDropped(Array.from(e.dataTransfer.files));
    }
  }, [onFilesDropped]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesDropped(Array.from(e.target.files));
    }
    // Reset value so same file can be selected again if needed
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onFilesDropped]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer
        w-full max-w-2xl mx-auto h-64 md:h-80
        rounded-3xl border-2 border-dashed transition-all duration-300 ease-out
        flex flex-col items-center justify-center p-8 text-center
        overflow-hidden
        ${isDragActive 
          ? 'border-brand-400 bg-brand-900/20 scale-[1.02] shadow-[0_0_40px_-10px_rgba(14,165,233,0.3)]' 
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".webp,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className={`
        absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
      `} />

      <div className="z-10 flex flex-col items-center space-y-4">
        <div className={`
          p-4 rounded-full bg-slate-800 shadow-xl ring-1 ring-white/10 transition-transform duration-300
          ${isDragActive ? 'scale-110 text-brand-400' : 'text-slate-400 group-hover:text-brand-300'}
        `}>
          {isProcessing ? (
            <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className={`text-xl font-semibold transition-colors duration-300 ${isDragActive ? 'text-brand-300' : 'text-slate-200'}`}>
            {isProcessing ? 'Converting...' : isDragActive ? 'Drop files here' : 'Drop WebP images here'}
          </h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            or click to browse from your computer. <br/>
            Files are converted locally and securely.
          </p>
        </div>
      </div>
    </div>
  );
};
