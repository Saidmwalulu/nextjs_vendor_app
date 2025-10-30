"use client"
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { getCategories } from "@/data/categories";
import { useQuery } from "@tanstack/react-query";
import { DataTableToolbar } from "./data-table-toolbar";

export default function CategoryTableClient() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load categories</p>;

  return <DataTable data={data || []} columns={columns} Toolbar={DataTableToolbar} />;
}
