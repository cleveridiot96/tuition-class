
import { getStorageItem, saveStorageItem } from './storageUtils';

interface TransferRecord {
  id: string;
  date: string;
  lotNumber: string;
  fromLocation: string;
  toLocation: string;
  bags: number;
  weight: number;
  notes?: string;
  createdAt: string;
}

const TRANSFER_HISTORY_KEY = 'transferHistory';

export const getTransferHistory = (): TransferRecord[] => {
  return getStorageItem<TransferRecord[]>(TRANSFER_HISTORY_KEY) || [];
};

export const saveTransferHistory = (transfer: TransferRecord): void => {
  const history = getTransferHistory();
  history.push(transfer);
  saveStorageItem(TRANSFER_HISTORY_KEY, history);
};

export const deleteTransferRecord = (id: string): void => {
  const history = getTransferHistory();
  const updatedHistory = history.filter(record => record.id !== id);
  saveStorageItem(TRANSFER_HISTORY_KEY, updatedHistory);
};
