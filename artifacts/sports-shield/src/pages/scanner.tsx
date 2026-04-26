import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScanLine, Radar, ShieldCheck, AlertTriangle, Fingerprint, Globe, Lock, Zap } from "lucide-react";

type ScanStage = { label: string; status: "pending" | "running" | "done"; detail?: string };

type ScanResult = {
  url: string;
  riskScore: number;
  verdict: "Clean" | "Suspicious" | "Confirmed Piracy";
  matchedAsset: string | null;
  fingerprint: string;
  region: string;
  estViewers: number;
  protocol: string;
};

const SAMPLE_URLS = [
  "t.me/+RedDevilsHD-EPL",
  "youtube.com/live/laliga-hd-stream-es",
  "iptv-cricstream.app/channel/star-sports-1",
  "x.com/elclasico_live/status/183920",
];

export default function Scanner() {
  const [url, setUrl] = useState("");
  const [stages, setStages] = useState<ScanStage[]>([]);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);

  const runScan = async (target: string) => {
    if (!target.trim()) return;
    setScanning(true);
    setResult(null);

    const initialStages: ScanStage[] = [
      { label: "Resolving target endpoint", status: "pending" },
      { label: "Probing media stream signature", status: "pending" },
      { label: "Comparing against fingerprint vault", status: "pending" },
      { label: "Geo-tagging viewer cluster", status: "pending" },
      { label: "Computing risk score", status: "pending" },
    ];
    setStages(initialStages);

    for (let i = 0; i < initialStages.length; i++) {
      setStages((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: "running" } : s)));
      await new Promise((r) => setTimeout(r, 550 + Math.random() * 350));
      const detail = [
        "Endpoint resolved · 3 hops",
        "H.264 1080p · 60fps · 6 Mbps",
        "Match: UEFA Champions League Final 2026",
        "Cluster: South Asia · 47.2K concurrent",
        "Confidence 0.94",
      ][i];
      setStages((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: "done", detail } : s)));
    }

    const seed = target.length;
    const verdicts: ScanResult["verdict"][] = ["Confirmed Piracy", "Suspicious", "Clean"];
    const protocols = ["HLS", "RTMP", "WebRTC", "DASH"];
    const regions = ["South Asia", "Europe", "South America", "MENA", "North America"];

    setResult({
      url: target,
      riskScore: 60 + (seed % 40),
      verdict: verdicts[seed % verdicts.length],
      matchedAsset: seed % 7 === 0 ? null : "UEFA Champions League Final 2026",
      fingerprint: `0x${(seed * 9973).toString(16).padStart(8, "0").slice(0, 8).toUpperCase()}`,
      region: regions[seed % regions.length],
      estViewers: 5_000 + ((seed * 311) % 95_000),
      protocol: protocols[seed % protocols.length],
    });
    setScanning(false);
  };

  const verdictBadge = (v: ScanResult["verdict"]) => {
    if (v === "Confirmed Piracy") return <Badge variant="destructive" className="animate-pulse">{v}</Badge>;
    if (v === "Suspicious") return <Badge className="bg-amber-500 text-white hover:bg-amber-500">{v}</Badge>;
    return <Badge className="bg-sky-400 text-white hover:bg-sky-400">{v}</Badge>;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stream Scanner</h1>
        <p className="text-muted-foreground">Probe a stream URL or channel handle for piracy signals against the fingerprint vault.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Radar className="h-5 w-5 text-primary" /> Live Probe</CardTitle>
          <CardDescription>Paste any stream URL, telegram handle, or social link. Probe runs against the protected asset fingerprints.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. t.me/+RedDevilsHD-EPL or https://stream.example.com/live"
              className="flex-1"
              disabled={scanning}
              onKeyDown={(e) => e.key === "Enter" && runScan(url)}
            />
            <Button onClick={() => runScan(url)} disabled={scanning || !url.trim()} className="gap-2">
              <ScanLine className="h-4 w-4" />
              {scanning ? "Scanning…" : "Run Scan"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center">Try:</span>
            {SAMPLE_URLS.map((s) => (
              <button
                key={s}
                onClick={() => { setUrl(s); runScan(s); }}
                disabled={scanning}
                className="text-xs px-2.5 py-1 rounded-md border border-border bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-colors font-mono disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {stages.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Probe Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stages.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5">
                      {s.status === "done" ? <ShieldCheck className="h-4 w-4 text-sky-400" /> :
                       s.status === "running" ? <Zap className="h-4 w-4 text-primary animate-pulse" /> :
                       <div className="h-4 w-4 rounded-full border border-border" />}
                    </div>
                    <div className="flex-1">
                      <div className={s.status === "pending" ? "text-muted-foreground" : "text-foreground"}>{s.label}</div>
                      {s.detail && <div className="text-xs text-muted-foreground font-mono mt-0.5">{s.detail}</div>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-primary" /> Scan Report
                    </CardTitle>
                    <CardDescription className="font-mono text-xs mt-1 break-all">{result.url}</CardDescription>
                  </div>
                  {verdictBadge(result.verdict)}
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Risk Score</span>
                    <span className="font-mono font-bold text-lg">{result.riskScore}/100</span>
                  </div>
                  <Progress value={result.riskScore} className="h-2" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Stat icon={<Fingerprint className="h-4 w-4" />} label="Fingerprint" value={result.fingerprint} mono />
                  <Stat icon={<Globe className="h-4 w-4" />} label="Region" value={result.region} />
                  <Stat icon={<Radar className="h-4 w-4" />} label="Est. Viewers" value={result.estViewers.toLocaleString()} />
                  <Stat icon={<Lock className="h-4 w-4" />} label="Protocol" value={result.protocol} />
                </div>

                <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
                  <div className="text-xs text-muted-foreground mb-1">Matched Protected Asset</div>
                  <div className="font-medium">{result.matchedAsset ?? "No match in fingerprint vault"}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Stat({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md border border-border p-3 bg-card">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">{icon}{label}</div>
      <div className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
