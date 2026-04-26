import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Bell, Shield, ShieldAlert, Activity, Database, LogOut, Menu } from "lucide-react";
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { title: "Overview", url: "/", icon: Activity },
  { title: "Predictions", url: "/predictions", icon: ShieldAlert },
  { title: "Tracking", url: "/tracking", icon: Shield },
  { title: "Assets", url: "/assets", icon: Database },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-start px-4 border-b border-border/50">
        <div className="flex items-center gap-2 font-bold text-lg text-primary">
          <ShieldAlert className="h-6 w-6" />
          <span>Sports Shield</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Mission Control</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function Topbar() {
  const [syncedAgo, setSyncedAgo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSyncedAgo((prev) => (prev + 1) % 15);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-border/50 flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search intelligence..."
            className="w-full pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground hidden sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live · synced {syncedAgo}s ago
        </div>
        <div className="h-8 w-px bg-border/50 hidden sm:block"></div>
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></span>
        </button>
        <Avatar className="h-8 w-8 border border-border/50">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">SA</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-background text-foreground">
        <Topbar />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
