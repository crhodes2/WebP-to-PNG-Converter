export enum ConversionStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface ConvertedFile {
  id: string;
  originalName: string;
  newName: string;
  blob: Blob;
  url: string;
  status: ConversionStatus;
  timestamp: number;
  size: number;
  error?: string;
}

export interface DropZoneProps {
  onFilesDropped: (files: File[]) => void;
  isProcessing: boolean;
}
