import { ComponentType, SVGProps } from "react";

export interface DashboardSidebarMenuInterface {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  link: string;
}

