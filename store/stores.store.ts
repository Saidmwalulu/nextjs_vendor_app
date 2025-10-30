// /store/stores.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Store } from "@/types";
import { useUserStore } from "./user.store";

interface StoreState {
  stores: Store[];
  activeStore: Store | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setStores: (stores: Store[]) => void;
  addStore: (store: Store) => void;
  updateStore: (store: Store) => void;
  removeStore: (storeId: string) => void;
  setActiveStore: (store: Store | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set) => ({
      stores: [],
      activeStore: null,
      isLoading: false,
      error: null,

      setStores: (stores) => set({ stores }),

      addStore: (store) => {
        set((state) => ({
          stores: [...state.stores, store],
          activeStore: store,
        }));

        // Sync user store
        useUserStore.getState().setUserStore(store);
      },

      updateStore: (updatedStore) => {
        set((state) => ({
          stores: state.stores.map((s) =>
            s.id === updatedStore.id ? { ...s, ...updatedStore } : s
          ),
          activeStore:
            state.activeStore?.id === updatedStore.id
              ? { ...state.activeStore, ...updatedStore }
              : state.activeStore,
        }));

        // Sync user store if user's store matches
        const user = useUserStore.getState().user;
        if (user?.stores?.some(s => s.id === updatedStore.id)) {
          useUserStore.getState().setUserStore(updatedStore);
        }
      },

      removeStore: (storeId) =>
        set((state) => ({
          stores: state.stores.filter((s) => s.id !== storeId),
          activeStore:
            state.activeStore?.id === storeId ? null : state.activeStore,
        })),

      setActiveStore: (store) => set({ activeStore: store }),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      reset: () =>
        set({
          stores: [],
          activeStore: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: "stores-storage",
      partialize: (state) => ({
        stores: state.stores,
        activeStore: state.activeStore,
      }),
    }
  )
);

// Selectors (for better performance)
export const selectStores = (state: StoreState) => state.stores;
export const selectActiveStore = (state: StoreState) => state.activeStore;
