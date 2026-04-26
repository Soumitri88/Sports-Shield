import { useState } from "react";
import { useGetTracking, getGetTrackingQueryKey, useGetEnforcementActions, getGetEnforcementActionsQueryKey, useTriggerEnforcement } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ShieldAlert, ExternalLink, Activity, CheckCircle2, Shield, Zap, Radio, AlertTriangle, Gavel } from "lucide-react";

export default function Tracking() {
  const queryClient = useQueryClient();
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [enforcementAction, setEnforcementAction] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: tracking, isLoading: loadingTracking } = useGetTracking({ query: { queryKey: getGetTrackingQueryKey(), refetchInterval: 15000 } });
  const { data: actions, isLoading: loadingActions } = useGetEnforcementActions({ query: { queryKey: getGetEnforcementActionsQueryKey(), refetchInterval: 15000 } });
  
  const enforceMutation = useTriggerEnforcement({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTrackingQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetEnforcementActionsQueryKey() });
        toast.success("Enforcement action triggered successfully", {
          description: `Action applied to incident #${selectedIncident}`,
          icon: <Shield className="h-4 w-4 text-emerald-500" />
        });
        setIsDialogOpen(false);
        setSelectedIncident(null);
        setEnforcementAction("");
      },
      onError: () => {
        toast.error("Failed to trigger enforcement action");
      }
    }
  });

  const handleEnforce = () => {
    if (selectedIncident && enforcementAction) {
      enforceMutation.mutate({ data: { incidentId: selectedIncident, action: enforcementAction } });
    }
  };

  const openDialog = (id: number) => {
    setSelectedIncident(id);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Tracking': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-500"><Activity className="w-3 h-3 mr-1"/> Tracking</Badge>;
      case 'Enforcement Pending': return <Badge variant="outline" className="text-amber-500 border-amber-500/50"><AlertTriangle className="w-3 h-3 mr-1"/> Pending</Badge>;
      case 'Takedown Issued': return <Badge variant="default" className="bg-primary/80"><Gavel className="w-3 h-3 mr-1"/> Issued</Badge>;
      case 'Resolved': return <Badge variant="outline" className="text-emerald-500 border-emerald-500/50"><CheckCircle2 className="w-3 h-3 mr-1"/> Resolved</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Live Tracking</h1>
        <p className="text-muted-foreground mt-1">Real-time monitoring of illegal streams and piracy spread.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <Card className="lg:col-span-3 bg-card/50 backdrop-blur-sm border-border/50 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-destructive animate-pulse" />
                  Active Incidents
                </CardTitle>
                <CardDescription>Live streams currently broadcasting protected content</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono bg-background">
                {tracking?.activeIncidents?.length || 0} LIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0 px-6 pb-6">
            {loadingTracking ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : (
              <div className="rounded-md border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-md">
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Match / Event</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead className="text-right">Viewers</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tracking?.activeIncidents?.map((incident) => (
                      <TableRow key={incident.id} className="hover:bg-muted/30 transition-colors group">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{incident.source}</span>
                            <span className="text-xs text-muted-foreground uppercase">{incident.type}</span>
                          </div>
                          <a href={incident.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center mt-1">
                            {incident.url} <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </TableCell>
                        <TableCell className="font-medium text-sm">{incident.match}</TableCell>
                        <TableCell className="text-muted-foreground">{incident.region}</TableCell>
                        <TableCell className="text-right font-mono text-destructive">{incident.viewers.toLocaleString()}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(incident.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant={incident.status === 'Tracking' ? 'default' : 'secondary'}
                            onClick={() => openDialog(incident.id)}
                            disabled={incident.status === 'Resolved'}
                            className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                          >
                            <Zap className="h-4 w-4 mr-1" /> Enforce
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!tracking?.activeIncidents || tracking.activeIncidents.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No active incidents detected.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Actions</CardTitle>
            <CardDescription>Enforcement log</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pr-4">
            {loadingActions ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {actions?.actions?.map((action, i) => (
                  <div key={action.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 text-primary">
                      {action.status === 'Success' ? <CheckCircle2 className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border/50 bg-background/50 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-foreground">{action.action}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">{action.target}</div>
                      <div className="text-[10px] text-muted-foreground/80 font-mono">
                        {new Date(action.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Trigger Enforcement
            </DialogTitle>
            <DialogDescription>
              Select an AI enforcement action to take against Incident #{selectedIncident}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Select value={enforcementAction} onValueChange={setEnforcementAction}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select enforcement action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Issue DMCA Takedown">Issue DMCA Takedown</SelectItem>
                  <SelectItem value="Inject Content Poisoning">Inject Content Poisoning</SelectItem>
                  <SelectItem value="Block Stream Origin">Block Stream Origin</SelectItem>
                  <SelectItem value="Notify Platform">Notify Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {enforcementAction === 'Inject Content Poisoning' && (
              <div className="text-xs text-amber-500 bg-amber-500/10 p-3 rounded-md border border-amber-500/20">
                Warning: Content poisoning will actively disrupt the stream for all viewers. Ensure high confidence before proceeding.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEnforce} disabled={!enforcementAction || enforceMutation.isPending}>
              {enforceMutation.isPending ? "Triggering..." : "Execute Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
