import { API_URL } from "@/server";

// services/sub-category.ts
export async function getSubCategories() {
  try {
    const response = await fetch(`${API_URL}/sub-category`, {
      method: "GET",
      credentials: "include",
      cache: "no-store", // ✅ always fetch fresh data, no stale cache
    });

    if (!response.ok) {
      console.error("Failed to fetch sub-categories:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data ?? [];
  } catch (error) {
    console.error("Unexpected error fetching categories:", error);
    return [];
  }
}

export async function getSubCategory(id: string) {
  const res = await fetch(`${API_URL}/sub-category/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // if you’re using cookies/session
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sub-category");
  }

  return res.json();
}

export async function deleteSubCategory(id: string) {
  const res = await fetch(`${API_URL}/sub-category/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 👈 keeps cookies/session included
  });

  if (!res.ok) {
    throw new Error("Failed to delete sub-category");
  }

  return res.json(); // you can also return void if your backend just sends { message: "Deleted" }
}
