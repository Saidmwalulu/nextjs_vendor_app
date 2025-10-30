import React from "react";
import SubCategoryTableClient from "./sub-categories-table-client";

export default function AdminSubCategoriesPage() {
  return (
    <div className="container mx-auto">
      <div className="px-3 pt-3">
        <SubCategoryTableClient />
      </div>
    </div>
  );
}
