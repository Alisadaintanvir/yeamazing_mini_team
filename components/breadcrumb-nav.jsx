"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbNav() {
  const pathname = usePathname();

  // Simple route to title mapping
  const routeTitles = {
    dashboard: "Dashboard",
    projects: "Projects",
    team: "Team",
    settings: "Settings",
  };

  // Generate breadcrumbs
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { title: "Home", href: "/dashboard", key: "home" },
    ...segments.map((segment, index) => ({
      title:
        routeTitles[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + segments.slice(0, index + 1).join("/"),
      key: segment,
    })),
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.key} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className="hidden md:block">
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>{crumb.title}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
