
export interface StorageData {
  [key: string]: any;
}

export interface BackupData {
  timestamp: string;
  data: StorageData;
}

export interface StorageStats {
  totalItems: number;
  totalSize: number;
  largestItems: Array<{key: string, size: number}>;
}
