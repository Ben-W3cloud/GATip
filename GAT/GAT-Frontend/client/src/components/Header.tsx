import { Link, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AtSign,
  Bell,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Settings,
  TrendingUp,
  User,
  Wallet,
  X,
  Zap,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { notifySuccess } from "@/lib/notify";
import { buildUrl } from "@/lib/api";

interface UserInfo {
  email: string;
  username?: string;
  name?: string | null;
  isAdmin?: boolean;
}

interface Notification {
  id: number;
  action: string;
  details: string | null;
  created_at: string;
  read?: boolean;
}

const authenticatedFetcher = async <T,>(context: { queryKey: readonly unknown[] }): Promise<T> => {
  const [path] = context.queryKey as string[];
  const token = sessionStorage.getItem("token");

  const res = await fetch(buildUrl(path), {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });

  if (!res.ok) throw new Error("Failed to fetch");
  return res.json() as T;
};

const navLinks = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/wallet", label: "Wallet", icon: Wallet },
  { path: "/forex", label: "Forex", icon: LineChart },
  { path: "/arbitrage", label: "Arbitrage", icon: ArrowRightLeft },
  { path: "/futures", label: "Futures", icon: TrendingUp },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/settings", label: "Account", icon: AtSign },
];

function getInitials(user?: UserInfo) {
  const source = user?.name || user?.username || user?.email || "User";
  return source
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

function SidebarContent({ location, onNavigate, onLogout }: { location: string; onNavigate?: () => void; onLogout: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Link href="/dashboard" onClick={onNavigate} className="flex h-24 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Zap className="h-6 w-6" />
        </div>
        <div className="leading-tight">
          <p className="font-grotesk text-sm font-bold tracking-wide text-white">GAT</p>
          <p className="font-grotesk text-[10px] font-semibold uppercase tracking-wider text-primary">Auto Trading</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navLinks.map(({ path, label, icon: Icon }) => {
          const active = location === path;
          return (
            <Link key={path} href={path} onClick={onNavigate}>
              <span
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 font-grotesk text-sm font-semibold transition-all",
                  active
                    ? "border-primary/25 bg-primary/10 text-primary shadow-sm"
                    : "border-transparent text-slate-300 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-left font-grotesk text-sm font-semibold text-slate-400 transition-colors hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function Header() {
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["/auth/user-info"],
    queryFn: authenticatedFetcher,
    retry: false,
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/dash/notification"],
    queryFn: authenticatedFetcher,
    retry: false,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setUserMenuOpen(false);
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) setNotifMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setNotifMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    queryClient.clear();
    notifySuccess({ title: "Signed out", description: "You have been securely signed out." });
    setTimeout(() => (window.location.href = "/"), 250);
  };

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent location={location} onLogout={handleLogout} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/70" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-sidebar-border shadow-2xl">
            <div className="absolute right-3 top-3 z-10">
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-border bg-secondary p-2 text-slate-300 hover:text-white"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent location={location} onNavigate={() => setMobileOpen(false)} onLogout={handleLogout} />
          </aside>
        </div>
      )}

      <header className="fixed left-0 right-0 top-0 z-30 border-b border-border bg-card/90 backdrop-blur-xl lg:left-64">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-border bg-secondary/70 p-2 text-slate-300 transition-colors hover:text-white lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 font-grotesk text-sm font-medium text-slate-400">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
              System Online
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setNotifMenuOpen((open) => !open)}
                className={cn(
                  "relative rounded-lg p-2.5 text-slate-300 transition-colors hover:bg-secondary hover:text-white",
                  notifMenuOpen && "bg-secondary text-white"
                )}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />}
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
                  <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-3 font-grotesk">
                    <p className="text-sm font-bold text-white">Notifications</p>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {notifications.length} New
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-sm text-slate-500">No new notifications</div>
                    ) : (
                      notifications.slice(0, 6).map((notification) => (
                        <div key={notification.id} className="border-b border-border/50 p-3 last:border-0 hover:bg-secondary/30">
                          <p className="text-sm font-semibold text-slate-100">{notification.action}</p>
                          {notification.details && <p className="mt-1 line-clamp-2 text-xs text-slate-400">{notification.details}</p>}
                          <p className="mt-2 text-[10px] font-mono text-slate-600">{new Date(notification.created_at).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-xl border border-border bg-secondary/70 p-1.5 pl-2 transition-colors hover:bg-secondary"
                aria-label="User menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 font-grotesk text-xs font-bold text-primary">
                  {getInitials(userInfo)}
                </div>
                <ChevronDown className={cn("hidden h-4 w-4 text-slate-400 transition-transform sm:block", userMenuOpen && "rotate-180")} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-xl border border-border bg-card font-grotesk shadow-2xl">
                  <div className="border-b border-border bg-background/40 p-4">
                    <p className="truncate text-sm font-bold text-white">{userInfo?.email || "User"}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-primary">
                      <Activity className="h-3 w-3" /> Active account
                    </p>
                  </div>
                  <div className="p-1.5">
                    <Link href="/profile">
                      <span className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-secondary hover:text-white">
                        <CircleUserRound className="h-4 w-4 text-primary" /> Profile
                      </span>
                    </Link>
                    <Link href="/settings">
                      <span className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-secondary hover:text-white">
                        <Settings className="h-4 w-4 text-primary" /> Account
                      </span>
                    </Link>
                    <div className="my-1 h-px bg-border" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

