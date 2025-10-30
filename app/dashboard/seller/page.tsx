"use client";
import Loader from "@/components/loader";
import { useUserStore } from "@/store/user.store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function SellerDashboardPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  console.log("The user is:", user?.stores);

  useEffect(() => {
    if (!user) {
      // No user → redirect to signin
      router.replace("/auth/signin");
      return;
    }

    const stores = user.stores || [];

    if (stores.length === 0) {
      // User has no store yet → redirect to new store page
      router.replace("/dashboard/seller/stores/new");
      return;
    }

    // Redirect to the first store’s dashboard
    router.replace(`/dashboard/seller/stores/${stores[0].url}`);
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <h1 className="text-2xl text-blue-500 mb-4">
          Welcome to Seller Store Dahboard
        </h1>
      </div>

      <Loader />
    </div>
  );
}
