import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Store } from "@/types";

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
  setUserStore: (store: Store | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({
          user,
          error: null,
        }),

      clearUser: () =>
        set({
          user: null,
          error: null,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setUserStore: (store: Store | null) =>
        set((state) => ({
          user: state.user ? { ...state.user, store } : null,
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      login: (user) =>
        set({
          user,
          isLoading: false,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: "user-storage", // Name in storage
      partialize: (state) => ({
        user: state.user,
      }), // Only persist user data
    }
  )
);

// Selectors for better performance
export const selectUser = (state: UserState) => state.user;
