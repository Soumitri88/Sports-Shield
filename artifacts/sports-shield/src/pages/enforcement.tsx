import { motion } from "framer-motion";
import { useGetEnforcementActions, getGetEnforcementActionsQueryKey, useGetTracking, getGetTrackingQueryKey, useTriggerEnforcement } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Gavel, Shield, Zap, Send, Bot, CheckCircle2, Clock } from "lucide-react";

const ENFORCEMENT_OPTIONS = [
  { value: "DMCA Takedown", label: "DMCA Takedown Notice", icon: <Gavel className="h-4 w-4" /> },
  { value: "Content Poisoning", label: "Content Poisoning Injection", icon: <Zap className="h-4 w-4" /> },
  { value: "Platform Notification", label: "Platform Trust & Safety Alert", icon: <Send className="h-4 w-4" /> },
  { value: "Stream Disruption", label: "Stream Disruption Packet", icon: <Shield className="h-4 w-4" /> },
];

export default function Enforcement() {
  const queryClient = useQueryClient();
  const { data: actions, isLoading: loadingActions } = useGetEnforcementActions({ query: { queryKey: getGetEnforcementActionsQueryKey(), refetchInterval: 10000 } });
  const { data: tracking, isLoading: loadingTracking } = useGetTracking({ query: { queryKey: getGetTrackingQueryKey(), refetchInterval: 15000 } });

  const [open, setOpen] = useState(false);
  const [incidentId, setIncidentId] = useState<string>("");
  const [action, setAction] = useState<string>("");

  const enforce = useTriggerEnforcement({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTrackingQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetEnforcementActionsQueryKey() });
        toast.success("Enforcement dispatched", { icon: <Shield className="h-4 w-4 text-sky-400" /> });
        setOpen(false); setIncidentId(""); setAction("");
      },
      onError: () => toast.error("Failed to dispatch enforcement"),
    },
  });

  const handleDispatch = () => {
    if (!incidentId || !action) return;
    enforce.mutate({ data: { incidentId: Number(incidentId), action } });
  };

  const total = actions?.actions?.length ?? 0;
  const successful = actions?.actions?.filter((a: any) => a.status === "Success" || a.status === "Completed").length ?? 0;
  const pending = actions?.actions?.filter((a: any) => a.status === "Pending" || a.status === "Processing").length ?? 0;

  const statusBadge = (status: string) => {
    if (status === "Success" || status === "Completed") return <Badge className="bg-sky-400 text-white hover:bg-sky-400"><CheckCircle2 className="w-3 h-3 mr-1" /> {status}</Badge>;
    if (status === "Pending" || status === "Processing") return <Badge variant="outline" className="text-amber-500 border-amber-500/50"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enforcement Agent</h1>
          <p className="text-muted-foreground">Dispatch automated takedowns and review the action ledger.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Bot className="h-4 w-4" /> Dispatch Action
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard icon={<Gavel className="h-5 w-5 text-primary" />} label="Total Actions" value={total} />
        <KpiCard icon={<CheckCircle2 className="h-5 w-5 text-sky-400" />} label="Successful" value={successful} />
        <KpiCard icon={<Clock className="h-5 w-5 text-amber-500" />} label="In-Flight" value={pending} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Action Ledger</CardTitle>
          <CardDescription>Append-only log of every dispatched enforcement action.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingActions ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Incident</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions?.actions?.slice().reverse().map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{a.action}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.target ?? "—"}</TableCell>
                    <TableCell className="font-mono text-xs">#{a.incidentId}</TableCell>
                    <TableCell className="text-right">{statusBadge(a.status)}</TableCell>
                  </TableRow>
                ))}
                {actions?.actions?.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No actions yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispatch Enforcement Action</DialogTitle>
            <DialogDescription>Select an active incident and the action to execute.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Incident</label>
              <Select value={incidentId} onValueChange={setIncidentId} disabled={loadingTracking}>
                <SelectTrigger><SelectValue placeholder="Select incident..." /></SelectTrigger>
                <SelectContent>
                  {tracking?.activeIncidents?.map((i) => (
                    <SelectItem key={i.id} value={String(i.id)}>#{i.id} · {i.source} · {i.match}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Action</label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger><SelectValue placeholder="Select enforcement action..." /></SelectTrigger>
                <SelectContent>
                  {ENFORCEMENT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      <span className="flex items-center gap-2">{o.icon} {o.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleDispatch} disabled={!incidentId || !action || enforce.isPending}>
              {enforce.isPending ? "Dispatching…" : "Dispatch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">{icon}</div>
      </CardContent>
    </Card>
  );
}
