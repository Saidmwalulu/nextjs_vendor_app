"use client";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/shared/custom-modal";
import CategoryDetails from "@/components/forms/category-details";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { openModal } = useModal();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("name") && (
          <DataTableFacetedFilter
            column={table.getColumn("name")}
            title="Name"
            options={[]}
          />
        )}
        {table.getColumn("url") && (
          <DataTableFacetedFilter
            column={table.getColumn("url")}
            title="URL"
            options={[]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />

      <Button
        onClick={() => {
          openModal(
            <CustomModal>
              <CategoryDetails />
            </CustomModal>
          );
        }}
        className="h-8 px-2 lg:px-3 ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
      >
        Add Category
      </Button>
    </div>
  );
}
