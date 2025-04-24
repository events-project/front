import { NavItem } from "./type";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { BookOpen, Key } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

const items: NavItem[] = [
  {
    title: "Api Keys",
    url: "/developers/keys",
    icon: <Key />,
  },
  {
    title: "Api Reference",
    url: "/developers/docs",
    icon: <BookOpen />,
  },
];

const NavDevelopers = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Developers</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
export default memo(NavDevelopers);
