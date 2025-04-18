
import type { ToastProps } from "@/components/ui/toast";
import { ReactNode } from "react";

// Toast definitions
export const TOAST_LIMIT = 3;
export const TOAST_REMOVE_DELAY = 1000;

export type ToasterToast = ToastProps & {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ToastActionElement;
};

export type ToastActionElement = React.ReactElement;

export type Toast = Omit<ToasterToast, "id">;

// Add the UpdateToast type that was missing
export type UpdateToast = Partial<ToasterToast> & { id: string };

// Extend the toast function type to include variant methods
export interface ToastFunction {
  (props: Toast): { id: string; dismiss: () => void; update: (props: ToasterToast) => void };
  success: (title: string, description?: string) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void };
  error: (title: string, description?: string) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void };
  warning: (title: string, description?: string) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void };
  info: (title: string, description?: string) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void };
}

// Context type definition
export interface ToastContextType {
  toasts: ToasterToast[];
  toast: ToastFunction;
  dismiss: (toastId?: string) => void;
}

// Action types
export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

export type ActionType = typeof actionTypes;

export type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

export interface State {
  toasts: ToasterToast[];
}
