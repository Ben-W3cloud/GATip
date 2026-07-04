import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, ArrowDownRight, ArrowUpRight, BookOpen, CheckCircle2, Clock, DollarSign, Play, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Session {
  name: string;
  range: string;
  active: boolean;
  tone: string;
}

interface CurrencyPair {
  pair: string;
  price: number;
  change: number;
  trend: "up" | "down";
}

const SESSIONS: Session[] = [
  { name: "Asian Session", range: "00:00 - 09:00 UTC", active: true, tone: "border-primary/60 bg-primary/10" },
  { name: "London Session", range: "08:00 - 16:00 UTC", active: false, tone: "border-amber-400/30 bg-amber-400/10" },
  { name: "NY Session", range: "13:00 - 22:00 UTC", active: false, tone: "border-green-400/25 bg-green-400/10" },
  { name: "London/NY Overlap", range: "13:00 - 16:00 UTC", active: false, tone: "border-primary/25 bg-primary/10" },
];

const CURRENCY_PAIRS: CurrencyPair[] = [
  { pair: "EUR/USD", price: 1.0842, change: 0.12, trend: "up" },
  { pair: "GBP/USD", price: 1.2654, change: -0.08, trend: "down" },
  { pair: "USD/JPY", price: 149.82, change: 0.24, trend: "up" },
  { pair: "USD/CHF", price: 0.8834, change: 0.05, trend: "up" },
  { pair: "AUD/USD", price: 0.6523, change: -0.15, trend: "down" },
  { pair: "USD/CAD", price: 1.3845, change: 0.18, trend: "up" },
];

const CHECKLIST = ["Liquidity Sweep", "HTF Structure", "MSS/BOS", "FVG/OB", "PD Array", "Session Active"];

function MetricCard({ title, value, caption, icon: Icon }: { title: string; value: string | number; caption: string; icon: React.ElementType }) {
  return (
    <Card className="group relative overflow-hidden rounded-xl border-border bg-card p-5 shadow-lg hover:border-primary/35">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-primary/5" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-grotesk text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 font-grotesk text-3xl font-bold text-white">{value}</p>
          <p className="mt-1 text-sm text-slate-400">{caption}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export default function Forex() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 font-grotesk text-3xl font-bold tracking-tight text-white">
              <DollarSign className="h-7 w-7 text-amber-400" /> Forex Trading
            </h1>
            <p className="mt-1 text-sm text-slate-400">ICT / Smart Money Concepts - Multi-pair FX</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-border bg-card text-white hover:bg-secondary hover:text-white">
              <BookOpen className="mr-2 h-4 w-4" /> Log Trade
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Play className="mr-2 h-4 w-4" /> Start
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Open Positions" value="0" caption="Max 3/day" icon={Activity} />
          <MetricCard title="Total P&L" value="$0.00" caption="+3.2% this week" icon={TrendingUp} />
          <MetricCard title="Win Rate" value="0%" caption="0/0 trades" icon={DollarSign} />
          <MetricCard title="Active Session" value="Asian" caption={currentTime.toLocaleTimeString()} icon={Clock} />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {SESSIONS.map((session) => (
            <div key={session.name} className={cn("rounded-xl border p-4 font-grotesk shadow-lg transition-colors hover:border-primary/35", session.tone)}>
              <div className="flex items-center justify-between">
                <p className={cn("text-sm font-bold", session.active ? "text-primary" : "text-white")}>{session.name}</p>
                {session.active && <span className="h-2 w-2 rounded-full bg-green-400" />}
              </div>
              <p className="mt-3 text-sm text-slate-400">{session.range}</p>
            </div>
          ))}
        </div>

        <Card className="rounded-xl border-border bg-card p-5 shadow-lg transition-colors hover:border-primary/35">
          <h2 className="mb-5 font-grotesk text-lg font-bold text-white">SMC Entry Checklist</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {CHECKLIST.map((item) => (
              <button key={item} className="rounded-xl bg-secondary/70 px-4 py-3 text-center font-grotesk text-sm font-bold text-primary transition-colors hover:bg-secondary">
                <CheckCircle2 className="mx-auto mb-2 h-4 w-4" />
                {item}
              </button>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden rounded-xl border-border bg-card shadow-lg transition-colors hover:border-primary/35">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-grotesk text-lg font-bold text-white">Trade History</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-border bg-secondary text-white hover:bg-secondary">All Pairs</Button>
              <Button size="sm" variant="outline" className="border-border bg-secondary text-white hover:bg-secondary">All</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-grotesk">
              <thead className="border-b border-border bg-secondary/20 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-4">Pair</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-right">Change</th>
                  <th className="p-4 text-right">Trend</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-sm">
                {CURRENCY_PAIRS.map((pair) => (
                  <tr key={pair.pair} className="hover:bg-secondary/20">
                    <td className="p-4 font-bold text-white">{pair.pair}</td>
                    <td className="p-4 text-right font-mono text-slate-300">{pair.price.toFixed(4)}</td>
                    <td className={cn("p-4 text-right font-mono font-bold", pair.change >= 0 ? "text-green-400" : "text-destructive")}>{pair.change >= 0 ? "+" : ""}{pair.change.toFixed(2)}%</td>
                    <td className="p-4 text-right">{pair.trend === "up" ? <ArrowUpRight className="ml-auto h-5 w-5 text-green-400" /> : <ArrowDownRight className="ml-auto h-5 w-5 text-destructive" />}</td>
                    <td className="p-4 text-right"><Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90">Trade</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

