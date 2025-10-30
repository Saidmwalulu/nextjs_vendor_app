"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { useUserStore } from "@/store/user.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import Logo from "../shared/logo";
import {
  adminDashboardSidebarOptions,
  SellerDashboardSidebarOptions,
} from "@/constants/data";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

export default function DashboardSidebar() {
  const user = useUserStore((state) => state.user);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();

  console.log("The role is", user?.role);

  const navigation =
    user?.role === "ADMIN"
      ? adminDashboardSidebarOptions
      : SellerDashboardSidebarOptions;

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        {/* User Profile at the top */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.photo} alt={user?.name} />
                    <AvatarFallback className="rounded-lg bg-blue-500 text-primary-foreground">
                      AU
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4 cursor-pointer" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isCollapsed ? "right" : "bottom"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Logo and Brand */}
        <div className="flex items-center gap-2 px-4 py-2 border-t border-sidebar-border pt-4">
          <div className="flex h-9 w-9 items-center justify-center  overflow-hidden">
            <Logo width="50" height="50" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-sidebar-foreground">
              {user?.role === "ADMIN" ? "Admin Hub" : "Seller Hub"}
            </span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              Management Portal
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            {user ? (
              <SidebarMenu>
                {navigation.map((item) => {
                  const storeUrl = user?.stores?.[0]?.url ?? "";
                  const fullPath =
                    user?.role === "ADMIN"
                      ? item.link
                        ? `${item.link}`
                        : `/dashboard`
                      : item.link
                      ? `/dashboard/seller/stores/${storeUrl}/${item.link}`
                      : `/dashboard/seller/stores/${storeUrl}`;

                  console.log({ label: item.label, pathname, fullPath });

                  // ✅ Exact match for dashboard, startsWith for subpages only
                  const isActive =
                    pathname === fullPath ||
                    (!!item.link && pathname.startsWith(`${fullPath}/`));

                  const isDisabled = user?.role !== "ADMIN" && !storeUrl;

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        data-active={isActive ? "true" : undefined} // 👈 set manually
                        className={clsx(
                          "transition-colors",
                          "data-[active=true]:bg-blue-100 data-[active=true]:text-black",
                          "hover:bg-muted text-sidebar-foreground",
                          isDisabled &&
                            "cursor-not-allowed text-gray-400 hover:bg-transparent"
                        )}
                        tooltip={isCollapsed ? item.label : undefined}
                      >
                        {isDisabled ? (
                          // If disabled, render a span instead of Link
                          <span className="flex items-center gap-2">
                            <item.icon />
                            <span>{item.label}</span>
                          </span>
                        ) : (
                          <Link
                            href={fullPath}
                            className="flex items-center gap-2"
                          >
                            <item.icon />
                            <span>{item.label}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            ) : (
              <div className="p-4 text-sm text-muted-foreground">
                Loading user...
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
