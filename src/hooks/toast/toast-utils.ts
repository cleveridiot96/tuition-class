
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

// Add variant toast methods
toast.success = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "default",
    className: "bg-green-500 text-white",
  });
};

toast.error = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "destructive",
  });
};

toast.warning = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "default",
    className: "bg-yellow-500 text-white",
  });
};

toast.info = (title: string, description?: string) => {
  return toast({
    title,
    description,
    variant: "default",
    className: "bg-blue-500 text-white",
  });
};
