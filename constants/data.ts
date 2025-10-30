import { DashboardSidebarMenuInterface } from "@/lib/types";
import { iconMap } from "./icons";

export const adminDashboardSidebarOptions: DashboardSidebarMenuInterface[] = [
  {
    label: "Dashboard",
    icon: iconMap["dashboard"],
    link: "/dashboard/admin",
  },
  {
    label: "Stores",
    icon: iconMap["store"],
    link: "/dashboard/admin/stores",
  },
  {
    label: "Orders",
    icon: iconMap["box-list"],
    link: "/dashboard/admin/orders",
  },
  {
    label: "Categories",
    icon: iconMap["categories"],
    link: "/dashboard/admin/categories",
  },
  {
    label: "Sub-Categories",
    icon: iconMap["categories"],
    link: "/dashboard/admin/sub-categories",
  },
  {
    label: "Offer Tags",
    icon: iconMap["offer"],
    link: "/dashboard/admin/offer-tags",
  },
  {
    label: "Coupons",
    icon: iconMap["coupon"],
    link: "/dashboard/admin/coupons",
  },
  {
    label: "Tasks",
    icon: iconMap["tasks"],
    link: "/dashboard/admin/tasks",
  },
];

export const SellerDashboardSidebarOptions: DashboardSidebarMenuInterface[] = [
  {
    label: "Dashboard",
    icon: iconMap["dashboard"],
    link: "",
  },
  {
    label: "Products",
    icon: iconMap["products"],
    link: "products",
  },
  {
    label: "Orders",
    icon: iconMap["box-list"],
    link: "orders",
  },
  {
    label: "Inventory",
    icon: iconMap["inventory"],
    link: "inventory",
  },
  {
    label: "Coupons",
    icon: iconMap["coupon"],
    link: "coupons",
  },
  {
    label: "Shipping",
    icon: iconMap["shipping"],
    link: "shipping",
  },
  {
    label: "Settings",
    icon: iconMap["settings"],
    link: "settings",
  },
];
