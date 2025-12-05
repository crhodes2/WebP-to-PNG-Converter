import React from 'react';
import { ConvertedFile, ConversionStatus } from '../types';
import { formatBytes } from '../utils/converter';

interface HistoryItemProps {
  item: ConvertedFile;
  onDownload: (item: ConvertedFile) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onDownload }) => {
  const isError = item.status === ConversionStatus.ERROR;
  const isSuccess = item.status === ConversionStatus.COMPLETED;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-colors group">
      <div className="flex items-center space-x-4 overflow-hidden">
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
          ${isSuccess ? 'bg-green-500/10 text-green-400' : ''}
          ${isError ? 'bg-red-500/10 text-red-400' : ''}
          ${item.status === ConversionStatus.PROCESSING ? 'bg-brand-500/10 text-brand-400' : ''}
        `}>
          {isSuccess && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isError && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {item.status === ConversionStatus.PROCESSING && (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </div>
        
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate pr-4" title={item.originalName}>
            {item.originalName}
          </p>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>{isSuccess ? 'Converted to PNG' : isError ? 'Failed' : 'Converting...'}</span>
            {item.size > 0 && (
              <>
                <span>&bull;</span>
                <span>{formatBytes(item.size)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        {isSuccess && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(item);
            }}
            className="p-2 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
            title="Download again"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
