import { useGetPredictions, getGetPredictionsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Filter, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Predictions() {
  const { data, isLoading } = useGetPredictions({ query: { queryKey: getGetPredictionsQueryKey(), refetchInterval: 30000 } });

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'Critical': return <Badge variant="destructive" className="animate-pulse">{level}</Badge>;
      case 'High': return <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">{level}</Badge>;
      case 'Medium': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">{level}</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Predictive Intelligence</h1>
          <p className="text-muted-foreground mt-1">AI-driven forecasts for upcoming high-risk broadcasting events.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="w-[200px] pl-9 bg-card border-border/50"
            />
          </div>
          <Button variant="outline" size="icon" className="border-border/50">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Forecasted Risk Events</CardTitle>
          <CardDescription>Events analyzed and scored by likelihood of large-scale piracy</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Match / Event</TableHead>
                    <TableHead>League</TableHead>
                    <TableHead>Time to Event</TableHead>
                    <TableHead>Est. Piracy</TableHead>
                    <TableHead className="text-right">Est. Viewers</TableHead>
                    <TableHead className="text-center">Confidence</TableHead>
                    <TableHead className="text-right">Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.highRiskEvents?.map((event) => (
                    <TableRow key={event.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{event.match}</TableCell>
                      <TableCell className="text-muted-foreground">{event.league}</TableCell>
                      <TableCell>{event.timeToEvent}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${event.riskLevel === 'Critical' ? 'text-destructive' : 'text-muted-foreground'}`} />
                          {event.estimatedPiracy}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{event.estimatedViewers.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
                          {event.confidence}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{getRiskBadge(event.riskLevel)}</TableCell>
                    </TableRow>
                  ))}
                  {(!data?.highRiskEvents || data.highRiskEvents.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No upcoming high-risk events detected.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
