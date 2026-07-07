import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowRightLeft,
  Bell,
  Calculator,
  LineChart,
  Loader2,
  Play,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { buildUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { pnlClass, formatPnl } from "@/lib/utils";

interface UserInfo {
  status: string;
  user_id: number;
  email: string;
  name: string | null;
  balance_forex: number;
  balance_arb: number;
  balance_fut: number;
  total_profit: number;
  total_pl: number;
  active_trade: number;
  win_rate: number;
}

interface Trade {
  id: number;
  symbol: string;
  side: "BUY" | "SELL";
  status: "PENDING" | "COMPLETED" | "ACTIVE" | "OPEN";
  profit_loss: string | number;
  amount: string | number;
  created_at?: string;
}

interface Notification {
  id: number;
  action: string;
  details: string;
  created_at: string;
  read: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

const formatPercent = (value: number) => `${Number(value || 0).toFixed(0)}%`;

const authenticatedFetcher = async (context: { queryKey: readonly unknown[]; signal?: AbortSignal }) => {
  const { queryKey, signal } = context;
  const [path] = queryKey as [string];
  const token = sessionStorage.getItem("token");

  if (!token) throw new Error("UNAUTHORIZED");

  const res = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  if (res.status === 401) {
    sessionStorage.clear();
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || "API Error");
  }

  return res.json();
};

function StatCard({ title, value, caption, trend, icon: Icon, isLoading }: {
  title: string;
  value: string | number;
  caption: string;
  trend?: string;
  icon: React.ElementType;
  isLoading: boolean;
}) {
  return (
    <Card className="group relative overflow-hidden rounded-xl border-border bg-card p-5 shadow-lg transition-colors hover:border-primary/35">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-primary/5 transition-transform group-hover:scale-110" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-grotesk text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          {isLoading ? <Skeleton className="mt-3 h-8 w-28 bg-secondary" /> : <p className="mt-2 font-grotesk text-3xl font-bold text-white">{value}</p>}
          <p className="mt-1 text-sm text-slate-400">{caption}</p>
          {trend && <p className="mt-3 text-xs font-bold text-green-400">{trend}</p>}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function ModuleCard({ title, value, caption, icon: Icon, href, tone }: {
  title: string;
  value: string;
  caption: string;
  icon: React.ElementType;
  href: string;
  tone: string;
}) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer rounded-xl border-border bg-card p-5 shadow-lg transition-all hover:-translate-y-0.5 hover:border-primary/35">
        <div className="mb-5 flex items-start justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", tone)}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 font-grotesk text-xs font-bold text-slate-400">
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-500" /> Stopped
          </span>
        </div>
        <h3 className="font-grotesk text-base font-bold text-white">{title}</h3>
        <p className="mt-2 font-grotesk text-3xl font-bold text-white">{value}</p>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <span>{caption}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Card>
    </Link>
  );
}

function TradeRow({ trade }: { trade: Trade }) {
  const pnl = Number(trade.profit_loss || 0);
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/25 px-3 py-3">
      <div>
        <p className="font-grotesk text-sm font-bold text-white">{trade.symbol}</p>
        <p className="text-xs text-slate-500">{trade.side} - {trade.status}</p>
      </div>
      <p className={cn("font-mono text-sm font-bold", pnlClass(pnl))}>{formatPnl(pnl, 2)}</p>
    </div>
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: userInfo, isLoading: userLoading, error: userError } = useQuery<UserInfo>({
    queryKey: ["/auth/user-info"],
    queryFn: authenticatedFetcher,
    retry: 1,
  });

  const { data: recentTrades = [], isLoading: tradesLoading } = useQuery<Trade[]>({
    queryKey: ["/dash/recent-trades"],
    queryFn: authenticatedFetcher,
  });

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/dash/notification"],
    queryFn: authenticatedFetcher,
  });

  useEffect(() => {
    if (userError?.message === "UNAUTHORIZED") setLocation("/login");
  }, [userError, setLocation]);

  const stats = useMemo(() => {
    if (!userInfo) return null;
    return {
      totalBalance: (userInfo.balance_arb || 0) + (userInfo.balance_forex || 0) + (userInfo.balance_fut || 0),
      totalPnl: userInfo.total_pl || 0,
      activeTrades: userInfo.active_trade || 0,
      winRate: userInfo.win_rate || 0,
      totalProfit: userInfo.total_profit || 0,
    };
  }, [userInfo]);

  const isLoading = userLoading || tradesLoading;

  if (userError && userError.message !== "UNAUTHORIZED") {
    return (
      <Layout>
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
          <AlertCircle className="mb-4 h-14 w-14 text-destructive" />
          <h2 className="font-grotesk text-2xl font-bold text-white">Failed to load dashboard</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-400">We could not fetch your account data. Please check your connection.</p>
          <Button onClick={() => window.location.reload()} className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">Retry</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-grotesk text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">Welcome back - your system is online</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Zap className="mr-2 h-4 w-4" /> Execute Trade
            </Button>
            <Button variant="outline" className="border-primary/25 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary">
              <Activity className="mr-2 h-4 w-4" /> GAT Platform v1.0
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Balance" value={stats ? formatCurrency(stats.totalBalance) : "$0.00"} caption="All wallets combined" trend="+5.2% this week" icon={Wallet} isLoading={isLoading} />
          <StatCard title="Total Profit" value={stats ? formatCurrency(stats.totalProfit) : "$0.00"} caption="All-time earnings" trend="+12.4% this month" icon={LineChart} isLoading={isLoading} />
          <StatCard title="Active Trades" value={stats?.activeTrades || 0} caption="Across all modules" icon={Activity} isLoading={isLoading} />
          <StatCard title="Win Rate" value={stats ? formatPercent(stats.winRate) : "0%"} caption="Last 30 days" trend="+3% vs last month" icon={TrendingUp} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ModuleCard title="Arbitrage Trading" value={formatCurrency(userInfo?.balance_arb || 0)} caption="L2 scanner and routing" href="/arbitrage" icon={ArrowRightLeft} tone="border-cyan-400/25 bg-cyan-400/10 text-cyan-300" />
          <ModuleCard title="Futures Trading" value={formatCurrency(userInfo?.balance_fut || 0)} caption="Margin and positions" href="/futures" icon={TrendingUp} tone="border-violet-400/25 bg-violet-400/10 text-violet-300" />
          <ModuleCard title="Forex Trading" value={formatCurrency(userInfo?.balance_forex || 0)} caption="ICT / Smart Money" href="/forex" icon={LineChart} tone="border-amber-400/25 bg-amber-400/10 text-amber-300" />
        </div>

        <button className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-5 text-left shadow-lg transition-colors hover:border-primary/35">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <p className="font-grotesk font-bold text-white">Trade Simulator</p>
              <p className="text-sm text-slate-400">Calculate potential outcomes before going live</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-500" />
        </button>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card className="rounded-xl border-border bg-card shadow-lg">
            <div className="border-b border-border p-5">
              <h2 className="font-grotesk text-lg font-bold text-white">Recent Trades</h2>
            </div>
            <div className="space-y-2 p-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full bg-secondary" />)
              ) : recentTrades.length === 0 ? (
                <div className="flex min-h-44 flex-col items-center justify-center text-center text-slate-500">
                  <Play className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">No recent trading activity.</p>
                </div>
              ) : (
                recentTrades.slice(0, 6).map((trade, idx) => <TradeRow key={trade.id || idx} trade={trade} />)
              )}
            </div>
          </Card>

          <Card className="rounded-xl border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-grotesk text-lg font-bold text-white">Notifications</h2>
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-4 p-5">
              {notifications.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">You are all caught up.</p>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex gap-3 rounded-lg border border-border/50 bg-secondary/20 p-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{notification.action}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-400">{notification.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
