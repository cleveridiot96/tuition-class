
import { Toast, ToasterToast } from './toast/types';
import { toast, dismissToast } from './toast/toast-utils';
import { memoryState } from './toast/reducer';
  
export const useToast = () => {
  return {
    toast,
    dismiss: dismissToast,
    toasts: memoryState.toasts,
  };
};

export { toast } from './toast/toast-utils';
export { dismissToast as dismiss } from './toast/toast-utils';
export { ToastProvider } from './toast/toast-context';
