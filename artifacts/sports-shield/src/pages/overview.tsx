import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetDashboardSummary, getGetDashboardSummaryQueryKey,
  useGetTrafficTimeseries, getGetTrafficTimeseriesQueryKey,
  useGetRegionBreakdown, getGetRegionBreakdownQueryKey,
  useGetSourceBreakdown, getGetSourceBreakdownQueryKey,
  useGetTracking, getGetTrackingQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { Shield, Eye, TrendingUp, Users, Crosshair, Activity, AlertTriangle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Overview() {
  const queryClient = useQueryClient();
  const [scanning, setScanning] = useState(false);
  const [poisoning, setPoisoning] = useState(false);

  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey(), refetchInterval: 15000 } });
  const { data: traffic, isLoading: loadingTraffic } = useGetTrafficTimeseries({ query: { queryKey: getGetTrafficTimeseriesQueryKey(), refetchInterval: 15000 } });
  const { data: regions, isLoading: loadingRegions } = useGetRegionBreakdown({ query: { queryKey: getGetRegionBreakdownQueryKey(), refetchInterval: 15000 } });
  const { data: sources, isLoading: loadingSources } = useGetSourceBreakdown({ query: { queryKey: getGetSourceBreakdownQueryKey(), refetchInterval: 15000 } });
  const { data: tracking, isLoading: loadingTracking } = useGetTracking({ query: { queryKey: getGetTrackingQueryKey(), refetchInterval: 10000 } });

  const forceGlobalScan = async () => {
    setScanning(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getGetTrackingQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getGetTrafficTimeseriesQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getGetRegionBreakdownQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getGetSourceBreakdownQueryKey() }),
    ]);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Global scan complete", { description: "All intelligence streams refreshed.", icon: <Crosshair className="h-4 w-4 text-primary" /> });
    setScanning(false);
  };

  const initiatePoisoning = async () => {
    setPoisoning(true);
    await new Promise((r) => setTimeout(r, 1100));
    toast.success("Content poisoning dispatched", { description: "Corrupted segments injected into 14,200 nodes.", icon: <Zap className="h-4 w-4 text-destructive" /> });
    setPoisoning(false);
  };

  const activeStreams = (summary?.activeIncidents ?? 0) * 1290;
  const piratedViews = summary?.viewersBlocked ?? 0;
  const revenueSaved = summary?.revenueRecovered ?? "—";
  const takedowns = summary?.takedownsToday ?? 0;
  const cumulativeTakedowns = takedowns * 170 + 4;

  const stats = [
    { title: "Active Unauthorized Streams", value: activeStreams.toLocaleString(), icon: Shield, iconColor: "text-primary", trendIcon: TrendingUp, trend: "+12% since last hour", trendColor: "text-destructive" },
    { title: "Total Pirated Views", value: piratedViews.toLocaleString(), icon: Eye, iconColor: "text-destructive", trendIcon: AlertTriangle, trend: "High Risk Level", trendColor: "text-destructive", pulse: true },
    { title: "Est. Revenue Saved ($)", value: revenueSaved, icon: TrendingUp, iconColor: "text-sky-400", trendIcon: TrendingUp, trend: "+$150k today", trendColor: "text-sky-400", valueColor: "text-sky-400" },
    { title: "Automated Takedowns", value: cumulativeTakedowns.toLocaleString(), icon: Users, iconColor: "text-primary", trendIcon: TrendingUp, trend: "94% Success Rate", trendColor: "text-sky-400" },
  ];

  const incidents = tracking?.activeIncidents?.slice(0, 4) ?? [];

  const riskBadge = (status: string) => {
    if (status === "Tracking") return { label: "HIGH", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" };
    if (status === "Enforcement Pending") return { label: "MEDIUM", cls: "bg-sky-500/15 text-sky-400 border-sky-500/30" };
    if (status === "Takedown Issued") return { label: "CRITICAL", cls: "bg-destructive/15 text-destructive border-destructive/30 animate-pulse" };
    return { label: "LOW", cls: "bg-muted text-muted-foreground border-border" };
  };

  const statusColor = (status: string) => {
    if (status === "Takedown Issued") return "text-destructive";
    if (status === "Enforcement Pending") return "text-amber-400";
    return "text-primary";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-sky-400 to-blue-300 bg-clip-text text-transparent">
            Global Piracy Overview
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Real-time tracking of unauthorized sports media broadcasts</p>
        </div>
        <Button onClick={forceGlobalScan} disabled={scanning} className="gap-2 bg-primary hover:bg-primary/90">
          <Crosshair className={`h-4 w-4 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning…" : "Force Global Scan"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="bg-card/60 backdrop-blur-sm border-border/60 hover:border-primary/40 transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </CardHeader>
              <CardContent>
                {loadingSummary ? (
                  <Skeleton className="h-9 w-32" />
                ) : (
                  <div className={`text-3xl font-bold ${stat.valueColor ?? "text-foreground"}`}>{stat.value}</div>
                )}
                <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${stat.trendColor} ${stat.pulse ? "px-2 py-0.5 rounded bg-destructive/10" : ""}`}>
                  <stat.trendIcon className="h-3.5 w-3.5" />
                  <span>{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/60 backdrop-blur-sm border-border/60">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-primary" /> Live Piracy Incidents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-border/60">
            {loadingTracking ? (
              <div className="p-4 space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : incidents.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No live incidents.</div>
            ) : (
              incidents.map((inc) => {
                const r = riskBadge(inc.status);
                return (
                  <div key={inc.id} className="flex items-center justify-between gap-4 p-4 hover:bg-accent/30 transition-colors">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{inc.match}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Source: {inc.source} | {inc.viewers.toLocaleString()} viewers
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="outline" className={`${r.cls} font-bold text-[10px] tracking-wider`}>{r.label}</Badge>
                      <span className={`text-xs font-semibold ${statusColor(inc.status)}`}>{inc.status}</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm border-border/60 relative overflow-hidden flex flex-col items-center justify-center min-h-[350px] p-8">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.25) 0%, transparent 60%)" }} />
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 70%, hsl(var(--chart-2) / 0.2) 0%, transparent 50%)" }} />
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full border border-primary/30"
                style={{
                  width: `${120 + i * 80}px`,
                  height: `${120 + i * 80}px`,
                  transform: "translate(-50%, -50%)",
                  animation: `ping 3s cubic-bezier(0, 0, 0.2, 1) ${i * 0.7}s infinite`,
                }}
              />
            ))}
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4 text-center max-w-sm">
            <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center border border-primary/30">
              <Activity className="h-7 w-7 text-primary animate-pulse" />
            </div>
            <h2 className="text-xl font-bold">Virus-like Spread Tracker</h2>
            <p className="text-muted-foreground text-sm">
              AI is currently tracking <span className="text-foreground font-semibold">{activeStreams.toLocaleString()}</span> nodes globally.
              The highest density of illegal distribution is currently concentrated in <span className="text-foreground font-semibold">Southeast Asia</span>.
            </p>
            <Button onClick={initiatePoisoning} disabled={poisoning} variant="destructive" className="gap-2 mt-2">
              <Zap className={`h-4 w-4 ${poisoning ? "animate-pulse" : ""}`} />
              {poisoning ? "Injecting…" : "Initiate Content Poisoning"}
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/60 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>24h Piracy Traffic</CardTitle>
            <CardDescription>Estimated viewers vs blocked viewers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              {loadingTraffic ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={traffic?.points} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} itemStyle={{ color: "hsl(var(--foreground))" }} />
                    <Area type="monotone" dataKey="viewers" stroke="hsl(var(--chart-1))" strokeWidth={2} fillOpacity={1} fill="url(#colorViewers)" name="Total Viewers" />
                    <Area type="monotone" dataKey="blocked" stroke="hsl(var(--chart-2))" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" name="Blocked Viewers" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm border-border/60">
          <CardHeader>
            <CardTitle>Source Platforms</CardTitle>
            <CardDescription>Incidents by origin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              {loadingSources ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sources?.sources} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="source" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-25} textAnchor="end" height={60} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }} />
                    <Bar dataKey="incidents" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} barSize={26} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-border/60">
        <CardHeader>
          <CardTitle>Regional Distribution</CardTitle>
          <CardDescription>Piracy viewer concentration by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full">
            {loadingRegions ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regions?.regions} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="region" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }} />
                  <Bar dataKey="viewers" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
