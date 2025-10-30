import CategoryTableClient from "./categories-table-client";

export default async function AdminCategoriesPage() {
  return (
    <div className="container mx-auto">
      <div className="px-3 pt-3">
         <CategoryTableClient />
      </div>
    </div>
  );
}
