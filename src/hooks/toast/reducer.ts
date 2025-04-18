import { Toast, UpdateToast, ToasterToast } from './types';
import React from 'react';

// Define the state structure
export interface State {
  toasts: ToasterToast[];
}

// Define action types
type ActionType =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: UpdateToast }
  | { type: "DISMISS_TOAST"; toastId?: string };

// Create a memory state that will be updated by dispatch
export const memoryState: State = {
  toasts: [],
};

// Array of setState functions to update
export const listeners: Array<React.Dispatch<React.SetStateAction<State>>> = [];

// Reducer function to manage state updates
export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

// Dispatch function to update the state and notify listeners
export function dispatch(action: ActionType) {
  memoryState.toasts = reducer(memoryState, action).toasts;
  listeners.forEach((listener) => listener(memoryState));
}
