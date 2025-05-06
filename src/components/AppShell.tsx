
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useKeyboardShortcutsContext } from './KeyboardShortcutsProvider';
import { optimizedStorage } from '@/services/core/storage-core';
import { toast } from 'sonner';

const AppShell: React.FC = () => {
  const { showKeyboardHelp } = useKeyboardShortcutsContext();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncData();
      toast.success('Back online! Syncing data...');
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast.warning('You are offline. Data will be saved locally.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Sync data when back online
  const syncData = async () => {
    setIsSyncing(true);
    try {
      // Flush any pending changes to localStorage
      optimizedStorage.flushChanges();
      toast.success('Data synced successfully!');
    } catch (error) {
      console.error('Error syncing data:', error);
      toast.error('Failed to sync data');
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Show offline indicator
  const OfflineIndicator = () => (
    <div className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-md bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-lg transition-opacity ${isOffline ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        <span>Offline Mode</span>
      </div>
    </div>
  );
  
  // Show keyboard help button
  const KeyboardHelpButton = () => (
    <button 
      className="fixed bottom-4 left-4 z-50 p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
      onClick={() => showKeyboardHelp()}
      title="Keyboard Shortcuts (F1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
        <path d="M6 8h4"></path>
        <path d="M14 8h4"></path>
        <path d="M6 12h4"></path>
        <path d="M14 12h4"></path>
        <path d="M6 16h4"></path>
        <path d="M14 16h4"></path>
      </svg>
    </button>
  );
  
  return (
    <div className="app-shell">
      <Outlet />
      <OfflineIndicator />
      <KeyboardHelpButton />
    </div>
  );
};

export default AppShell;
