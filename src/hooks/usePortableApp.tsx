
import { useEffect } from 'react';
import { initializePortableApp, isPortableMode } from '@/utils/portableAppUtils';

export function usePortableApp() {
  useEffect(() => {
    if (isPortableMode()) {
      initializePortableApp();
    }
  }, []);
  
  return { isPortableMode: isPortableMode() };
}
