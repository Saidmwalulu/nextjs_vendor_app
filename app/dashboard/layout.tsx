import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <DashboardSidebar />
      <SidebarInset>
        {/* Header */}
        <DashboardHeader />
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
