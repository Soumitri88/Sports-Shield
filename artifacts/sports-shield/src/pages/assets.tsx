import { useGetAssets, getGetAssetsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Fingerprint, Droplets, ShieldCheck, Activity } from "lucide-react";

import championsLeagueImg from "@/assets/champions-league.png";
import nbaFinalsImg from "@/assets/nba-finals.png";
import f1GrandPrixImg from "@/assets/f1-grand-prix.png";
import nflSuperBowlImg from "@/assets/nfl-super-bowl.png";
import wimbledonImg from "@/assets/wimbledon.png";

const getImageForLeague = (league: string) => {
  if (league.includes("Champions League") || league.includes("UEFA")) return championsLeagueImg;
  if (league.includes("NBA")) return nbaFinalsImg;
  if (league.includes("F1") || league.includes("Formula")) return f1GrandPrixImg;
  if (league.includes("NFL") || league.includes("Super Bowl")) return nflSuperBowlImg;
  if (league.includes("Wimbledon") || league.includes("Tennis")) return wimbledonImg;
  return championsLeagueImg; // fallback
};

export default function Assets() {
  const { data, isLoading } = useGetAssets({ query: { queryKey: getGetAssetsQueryKey(), refetchInterval: 60000 } });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Protected Assets</h1>
        <p className="text-muted-foreground mt-1">Broadcast streams secured with digital DNA and dynamic watermarking.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="bg-card border-border/50 overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <CardContent className="p-4 space-y-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.assets?.map((asset) => {
            const integrityNum = parseInt(asset.integrity.replace('%', ''));
            return (
              <Card key={asset.id} className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="h-40 w-full relative overflow-hidden bg-muted">
                  <img 
                    src={getImageForLeague(asset.league)} 
                    alt={asset.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-md text-foreground border-border">
                    {asset.league}
                  </Badge>
                  <div className="absolute bottom-3 left-4">
                    <h3 className="font-bold text-lg leading-tight text-white drop-shadow-md">{asset.name}</h3>
                  </div>
                </div>
                
                <CardContent className="p-5 space-y-5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-sky-400" />
                      <span>Protected since</span>
                    </div>
                    <span className="font-medium font-mono">{asset.protectedSince}</span>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Fingerprint className={`h-4 w-4 ${asset.dnaGenerated ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={asset.dnaGenerated ? 'text-foreground' : 'text-muted-foreground'}>Digital DNA</span>
                      </div>
                      {asset.dnaGenerated ? (
                        <Badge variant="outline" className="text-sky-400 border-sky-400/30 bg-sky-400/10">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Droplets className={`h-4 w-4 ${asset.watermarkEmbedded ? 'text-blue-500' : 'text-muted-foreground'}`} />
                        <span className={asset.watermarkEmbedded ? 'text-foreground' : 'text-muted-foreground'}>Dyn. Watermark</span>
                      </div>
                      {asset.watermarkEmbedded ? (
                        <Badge variant="outline" className="text-sky-400 border-sky-400/30 bg-sky-400/10">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3" /> Stream Integrity</span>
                      <span className={`font-mono font-medium ${integrityNum < 90 ? 'text-amber-500' : 'text-sky-400'}`}>
                        {asset.integrity}
                      </span>
                    </div>
                    <Progress value={integrityNum} className={`h-1.5 ${integrityNum < 90 ? '[&>div]:bg-amber-500' : '[&>div]:bg-sky-400'}`} />
                  </div>

                  <div className="bg-background/50 rounded-md p-3 flex justify-between items-center text-sm border border-border/30">
                    <span className="text-muted-foreground">Leak Attempts</span>
                    <span className="font-mono font-bold text-destructive">{asset.leakAttempts}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
