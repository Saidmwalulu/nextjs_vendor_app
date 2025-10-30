"use client"
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { getSubCategories } from "@/data/sub_categories";
import { useQuery } from "@tanstack/react-query";
import { DataTableToolbar } from "./data-table-toolbar";

export default function SubCategoryTableClient() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sub-categories"],
    queryFn: getSubCategories,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load categories</p>;

  return <DataTable data={data || []} columns={columns} Toolbar={DataTableToolbar} />;
}
