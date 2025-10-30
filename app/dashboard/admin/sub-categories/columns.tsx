"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
//import { labels, priorities, statuses } from "@/data/data";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  BadgeMinus,
  Edit,
  Trash,
} from "lucide-react";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/shared/custom-modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "@/data/categories";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import SubCategoryDetails from "@/components/forms/sub-category-details";
import { deleteSubCategory, getSubCategory } from "@/data/sub_categories";

type SubCategory = {
  id: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
  categoryId: string;
  category?: { id: string; name: string };
};

export const columns: ColumnDef<SubCategory>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean | "indeterminate") => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      return (
        <div className="relative h-12 w-12 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={row.original.image}
            alt={row.original.name}
            fill
            className="object-cover"
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      //const label = labels.find((label) => label.value === row.original.name);

      return <div className="flex space-x-2">{row.original.category?.name}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Category" />
    ),
    cell: ({ row }) => {
      //const label = labels.find((label) => label.value === row.original.name);

      return <div className="flex space-x-2">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => {
      // const status = statuses.find(
      //   (status) => status.value === row.getValue("url")
      // );

      // if (!status) {
      //   return null;
      // }

      return (
        <div className="flex w-[100px] items-center">
          {/* {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span> */}
          {row.original.url}
        </div>
      );
    },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id));
    // },
  },
  {
    accessorKey: "featured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Featured" />
    ),
    cell: ({ row }) => {
      //const featured = row.getValue("featured");

      return (
        <span className="text-muted-foreground ">
          {row.original.featured ? (
            <BadgeCheck className="stroke-green-300" />
          ) : (
            <BadgeMinus />
          )}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="">Actions</span>,
    cell: ({ row }) => <CellActions rowData={row.original} />,
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  rowData: SubCategory;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { openModal } = useModal();
  const [loading, setLoading] = useState(false);
  //const router = useRouter();
  const queryClient = useQueryClient();
  if (!rowData || !rowData.id) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => {
          openModal(
            <CustomModal>
              <SubCategoryDetails
                data={{ ...rowData, image: [{ url: rowData.image }] }}
                categories={[]}
              />
            </CustomModal>,
            async () => {
              const [subCategory, categories] = await Promise.all([
                getSubCategory(rowData?.id),
                getCategories(),
              ]);
              return {
                data: subCategory,
                categories,
              };
            }
          );
        }}
        variant="outline"
        size="icon"
        className="h-7 w-7 cursor-pointer bg-green-100"
      >
        <Edit className="h-3 w-3 text-gray-600" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 cursor-pointer bg-red-100"
          >
            <Trash className="h-3 w-3 text-gray-600" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              This action cannot be undone. This will permanently delete the
              category and related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center">
            <AlertDialogCancel className="mb-2 cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              className="bg-destructive hover:bg-destructive mb-2 text-white cursor-pointer"
              onClick={async () => {
                setLoading(true);
                await deleteSubCategory(rowData.id);
                toast.success("sub-category deleted successfully");
                setLoading(false);
                queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
