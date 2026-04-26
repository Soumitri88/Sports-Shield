import { motion } from "framer-motion";
import { useGetTracking, getGetTrackingQueryKey, useGetSourceBreakdown, getGetSourceBreakdownQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Twitter, Tv, MessageCircle, Hash, Globe, Youtube, Activity, Smartphone, Apple, Monitor, AlertOctagon } from "lucide-react";

const APP_META: Record<string, { icon: React.ReactNode; category: string; blurb: string }> = {
  "Telegram":      { icon: <Send className="h-5 w-5" />,        category: "Messaging",     blurb: "Private channels redistributing live HD streams." },
  "Twitter/X":     { icon: <Twitter className="h-5 w-5" />,     category: "Social",        blurb: "Short clips and embedded live windows of broadcasts." },
  "Illegal IPTV":  { icon: <Tv className="h-5 w-5" />,          category: "IPTV App",      blurb: "Standalone apps streaming pirated channel bundles." },
  "YouTube":       { icon: <Youtube className="h-5 w-5" />,     category: "Video",         blurb: "Restream channels masquerading as fan content." },
  "Discord":       { icon: <MessageCircle className="h-5 w-5"/>,category: "Community",     blurb: "Voice rooms with embedded live players." },
  "Reddit":        { icon: <Hash className="h-5 w-5" />,        category: "Forum",         blurb: "Megathreads aggregating illegal stream links." },
  "Web Stream":    { icon: <Globe className="h-5 w-5" />,       category: "Web",           blurb: "Generic web players hosted on bulletproof infra." },
};

export default function AppList() {
  const { data: tracking, isLoading: loadingTracking } = useGetTracking({ query: { queryKey: getGetTrackingQueryKey(), refetchInterval: 15000 } });
  const { data: sources, isLoading: loadingSources } = useGetSourceBreakdown({ query: { queryKey: getGetSourceBreakdownQueryKey(), refetchInterval: 15000 } });

  const incidentsBySource = new Map<string, { count: number; viewers: number }>();
  tracking?.activeIncidents?.forEach((i) => {
    const cur = incidentsBySource.get(i.source) ?? { count: 0, viewers: 0 };
    cur.count += 1;
    cur.viewers += i.viewers ?? 0;
    incidentsBySource.set(i.source, cur);
  });

  const totalSourceIncidents = sources?.sources?.reduce((sum, s) => sum + (s.incidents ?? 0), 0) ?? 0;

  const apps = Array.from(new Set([
    ...(sources?.sources?.map((s) => s.source) ?? []),
    ...(tracking?.activeIncidents?.map((i) => i.source) ?? []),
  ])).map((source) => {
    const meta = APP_META[source] ?? APP_META["Web Stream"];
    const live = incidentsBySource.get(source);
    const sourceData = sources?.sources?.find((s) => s.source === source);
    const share = totalSourceIncidents > 0 ? ((sourceData?.incidents ?? 0) / totalSourceIncidents) * 100 : 0;
    return {
      source,
      ...meta,
      activeIncidents: live?.count ?? 0,
      totalViewers: (live?.viewers ?? 0) + (sourceData?.viewers ?? 0),
      share,
    };
  });

  const loading = loadingTracking || loadingSources;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Monitored Platforms</h1>
        <p className="text-muted-foreground">Apps and surfaces under continuous surveillance for unauthorized rebroadcast.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertOctagon className="h-5 w-5 text-destructive" /> Rogue Streaming Apps</CardTitle>
          <CardDescription>Identified piracy applications across mobile, web, and connected-TV stores.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border/60">
          {ROGUE_APPS.map((app) => {
            const Icon = PLATFORM_ICON[app.platform] ?? Globe;
            return (
              <div key={app.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-accent/30 transition-colors">
                <div className="col-span-5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-destructive/15 text-destructive flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold">{app.name}</div>
                    <div className="text-xs text-muted-foreground">ID: {app.id}</div>
                  </div>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">{app.platform}</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={RISK_CLS[app.risk_level]}>{app.risk_level.toUpperCase()}</Badge>
                </div>
                <div className="col-span-3 text-right text-sm font-semibold text-primary">{app.status}</div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => (
            <motion.div key={app.source} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                        {app.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{app.source}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">{app.category}</Badge>
                      </div>
                    </div>
                    {app.activeIncidents > 0 && (
                      <span className="flex items-center gap-1 text-xs text-destructive font-medium">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                        </span>
                        Live
                      </span>
                    )}
                  </div>
                  <CardDescription className="pt-2">{app.blurb}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <Metric label="Incidents" value={String(app.activeIncidents)} />
                    <Metric label="Viewers" value={app.totalViewers >= 1000 ? `${(app.totalViewers / 1000).toFixed(1)}k` : String(app.totalViewers)} />
                    <Metric label="Share" value={`${Number(app.share).toFixed(0)}%`} />
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Activity className="h-3 w-3 text-sky-400" /> Continuous monitoring active
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

const ROGUE_APPS: { id: number; name: string; platform: "Android" | "iOS" | "Web" | "Smart TV"; risk_level: "Low" | "Medium" | "High" | "Critical"; status: string }[] = [
  { id: 1, name: "LiveSportsFree HD", platform: "Android",  risk_level: "High",     status: "Action Required" },
  { id: 2, name: "SoccerStreams Pro", platform: "iOS",      risk_level: "Critical", status: "Takedown Initiated" },
  { id: 3, name: "SportsHub Plus",    platform: "Web",      risk_level: "Low",      status: "Monitoring" },
  { id: 4, name: "GameDay Streams",   platform: "Smart TV", risk_level: "Medium",   status: "Under Investigation" },
];

const PLATFORM_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Android: Smartphone,
  iOS: Apple,
  Web: Globe,
  "Smart TV": Monitor,
};

const RISK_CLS: Record<string, string> = {
  Low:      "bg-sky-500/15 text-sky-400 border-sky-500/30 font-bold text-[10px] tracking-wider",
  Medium:   "bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold text-[10px] tracking-wider",
  High:     "bg-orange-500/15 text-orange-400 border-orange-500/30 font-bold text-[10px] tracking-wider",
  Critical: "bg-destructive/15 text-destructive border-destructive/30 font-bold text-[10px] tracking-wider animate-pulse",
};

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 py-2">
      <div className="text-base font-bold font-mono">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
