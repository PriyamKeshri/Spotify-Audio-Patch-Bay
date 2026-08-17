import { create } from 'zustand';

interface RowToast {
  id: number;
  message: string;
  // Viewport coordinates (from getBoundingClientRect) of the control that
  // triggered the toast, so it can be anchored right next to it.
  top: number;
  left: number;
}

interface ToastState {
  toast: RowToast | null;
  showToast: (message: string, anchor: { top: number; left: number }) => void;
  dismissToast: (id: number) => void;
}

let nextId = 0;

// Single active toast is enough here — a play click that fails replaces
// whatever was showing rather than queuing behind it.
export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showToast: (message, anchor) => set({ toast: { id: ++nextId, message, ...anchor } }),
  dismissToast: (id) => set((s) => (s.toast?.id === id ? { toast: null } : {})),
}));
