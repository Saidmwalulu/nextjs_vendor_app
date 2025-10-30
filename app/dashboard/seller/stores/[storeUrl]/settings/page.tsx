"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { API_URL } from "@/server";
import StoreDetails from "@/components/forms/store-details";

export default function SellerSettingsPage() {
  const params = useParams(); // 👈 get route parameters
  const storeUrl = params?.storeUrl as string; // assuming [storeUrl] is in your route folder

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(`${API_URL}/store/${storeUrl}`, {
          withCredentials: true,
        });
        const raw = response.data.data;
        const formatted = {
          ...raw,
          logo: raw.logo ? [{ url: raw.logo }] : [],
          cover: raw.cover ? [{ url: raw.cover }] : [],
        };
        setStore(formatted);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Failed to fetch store");
      } finally {
        setLoading(false);
      }
    };

    if (storeUrl) fetchStore();
  }, [storeUrl]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!store) return <div>No store found.</div>;

  return <StoreDetails data={store} />;
}
