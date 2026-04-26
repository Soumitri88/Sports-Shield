import { useGetDashboardSummary, getGetDashboardSummaryQueryKey, useGetTrafficTimeseries, getGetTrafficTimeseriesQueryKey, useGetRegionBreakdown, getGetRegionBreakdownQueryKey, useGetSourceBreakdown, getGetSourceBreakdownQueryKey, useGetPredictions, getGetPredictionsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Legend } from "recharts";
import { Shield, EyeOff, Gavel, FileLock2, DollarSign, Clock, Activity, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Overview() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey(), refetchInterval: 15000 } });
  const { data: traffic, isLoading: loadingTraffic } = useGetTrafficTimeseries({ query: { queryKey: getGetTrafficTimeseriesQueryKey(), refetchInterval: 15000 } });
  const { data: regions, isLoading: loadingRegions } = useGetRegionBreakdown({ query: { queryKey: getGetRegionBreakdownQueryKey(), refetchInterval: 15000 } });
  const { data: sources, isLoading: loadingSources } = useGetSourceBreakdown({ query: { queryKey: getGetSourceBreakdownQueryKey(), refetchInterval: 15000 } });
  const { data: predictions, isLoading: loadingPredictions } = useGetPredictions({ query: { queryKey: getGetPredictionsQueryKey(), refetchInterval: 15000 } });

  const stats = [
    { title: "Active Incidents", value: summary?.activeIncidents, icon: Activity, color: "text-destructive", trend: "+12%" },
    { title: "Viewers Blocked", value: summary?.viewersBlocked?.toLocaleString(), icon: EyeOff, color: "text-emerald-500", trend: "+5%" },
    { title: "Takedowns Today", value: summary?.takedownsToday, icon: Gavel, color: "text-primary", trend: "+2%" },
    { title: "Protected Assets", value: summary?.protectedAssets, icon: FileLock2, color: "text-blue-500", trend: "0%" },
    { title: "Revenue Recovered", value: summary?.revenueRecovered, icon: DollarSign, color: "text-emerald-500", trend: "+18%" },
    { title: "Avg Response", value: summary ? `${summary.avgResponseSeconds}s` : undefined, icon: Clock, color: "text-amber-500", trend: "-1s" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Operations Overview</h1>
        <p className="text-muted-foreground mt-1">Real-time piracy intelligence and enforcement metrics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {loadingSummary ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={stat.trend.startsWith('+') ? 'text-emerald-500' : stat.trend.startsWith('-') ? 'text-emerald-500' : 'text-muted-foreground'}>{stat.trend}</span> from yesterday
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>24h Piracy Traffic</CardTitle>
            <CardDescription>Estimated viewers vs blocked viewers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {loadingTraffic ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={traffic?.points} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value / 1000)}k`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="viewers" stroke="hsl(var(--chart-1))" strokeWidth={2} fillOpacity={1} fill="url(#colorViewers)" name="Total Viewers" />
                    <Area type="monotone" dataKey="blocked" stroke="hsl(var(--chart-2))" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" name="Blocked Viewers" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>High-Risk Upcoming</CardTitle>
            <CardDescription>Events requiring preemptive action</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingPredictions ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {predictions?.highRiskEvents?.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50">
                    <div>
                      <div className="font-medium text-sm">{event.match}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <span>{event.league}</span>
                        <span>•</span>
                        <span>In {event.timeToEvent}</span>
                      </div>
                    </div>
                    <Badge variant={event.riskLevel === 'Critical' ? 'destructive' : event.riskLevel === 'High' ? 'default' : 'secondary'} className={event.riskLevel === 'Critical' ? 'animate-pulse' : ''}>
                      {event.riskLevel}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>Piracy viewer concentration by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {loadingRegions ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regions?.regions} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="region" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      cursor={{fill: 'hsl(var(--muted))', opacity: 0.2}}
                    />
                    <Bar dataKey="viewers" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Source Platforms</CardTitle>
            <CardDescription>Incident breakdown by origin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {loadingSources ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sources?.sources} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="source" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      cursor={{fill: 'hsl(var(--muted))', opacity: 0.2}}
                    />
                    <Bar dataKey="incidents" fill="hsl(var(--accent-foreground))" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
