import { API_URL } from "@/server";
//import { cookies } from "next/headers";

// services/category.ts
export async function getCategories() {
  try {
    // const cookieStore = await cookies();
    // const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_URL}/category`, {
      method: "GET",
      // headers: {
      //   Cookie: cookieHeader,
      // },
      credentials: "include",
      cache: "no-store", // ✅ always fetch fresh data, no stale cache
    });

    if (!response.ok) {
      console.error("Failed to fetch categories:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.categories ?? [];
  } catch (error) {
    console.error("Unexpected error fetching categories:", error);
    return [];
  }
}

export async function getCategory(id: string) {
  const res = await fetch(`${API_URL}/category/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // if you’re using cookies/session
  });

  if (!res.ok) {
    throw new Error("Failed to fetch category");
  }

  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(`${API_URL}/category/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 👈 keeps cookies/session included
  });

  if (!res.ok) {
    throw new Error("Failed to delete category");
  }

  return res.json(); // you can also return void if your backend just sends { message: "Deleted" }
}
