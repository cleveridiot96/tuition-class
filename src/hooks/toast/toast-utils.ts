
import { Toast, ToasterToast } from './types';
import { dispatch } from './reducer';

// Counter for generating toast IDs
let count = 0;

// Generate unique IDs for toasts
export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Main toast function used to create toasts
export function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// Helper to dismiss toasts
export function dismissToast(toastId?: string) {
  dispatch({ type: "DISMISS_TOAST", toastId });
}
