
import { Toast, ToasterToast } from './toast/types';
import { toast, dismissToast } from './toast/toast-utils';

export const useToast = () => {
  const { memoryState } = require('./toast/reducer');
  
  return {
    toast,
    dismiss: dismissToast,
    toasts: memoryState.toasts,
  };
};

export { toast, dismiss as dismissToast } from './toast/toast-utils';
export { ToastProvider } from './toast/toast-context';
