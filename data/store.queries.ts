import { API_URL } from "@/server";
import { useStoreStore } from "@/store/stores.store";
import { useUserStore } from "@/store/user.store";
import { Store } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export const fetchStores = async (): Promise<Store[]> => {
  const response = await axios.get(`${API_URL}/store`, {
    withCredentials: true,
  });
  return response.data.data;
};

export const useStoresQuery = () => {
  const setStores = useStoreStore((state) => state.setStores);
  const query = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: fetchStores,
    
  });
  useEffect(() => {
    if (query.data) setStores(query.data);
  },[query.data, setStores])

  return query;
};

export const useSaveStoreMutation = () => {
  const queryClient = useQueryClient();
  const { addStore, updateStore } = useStoreStore();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (payload: any) => {
      const res = await axios.post(`${API_URL}/store/create`, payload, {
        withCredentials: true,
      });
      return res.data.data;
    },
    
    onSuccess: (newStore) => {
      if (newStore?.id) {
        updateStore(newStore);
      } else {
        addStore(newStore);
      }

      if (user) {
        setUser({
          ...user,
          stores: [...(user.stores || []), newStore],
        });
      }
      // Refetch latest from server
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
  });
};
