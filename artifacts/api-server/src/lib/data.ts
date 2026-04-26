import type {
  PredictionEvent,
  TrackingIncident,
  EnforcementAction,
  Asset,
  TimeseriesPoint,
  RegionStat,
  SourceStat,
} from "@workspace/api-zod";

// ============================================================================
// Predictions — high-risk upcoming sports broadcast events
// ============================================================================
export const predictions: PredictionEvent[] = [
  {
    id: 1,
    match: "Manchester United vs Liverpool",
    league: "Premier League",
    riskLevel: "Critical",
    timeToEvent: "30 mins",
    estimatedPiracy: "1.2M+ viewers",
    estimatedViewers: 1_240_000,
    confidence: 0.94,
  },
  {
    id: 2,
    match: "Real Madrid vs Barcelona — El Clásico",
    league: "La Liga",
    riskLevel: "Critical",
    timeToEvent: "2h 15m",
    estimatedPiracy: "2.1M+ viewers",
    estimatedViewers: 2_140_000,
    confidence: 0.97,
  },
  {
    id: 3,
    match: "Lakers vs Celtics",
    league: "NBA",
    riskLevel: "High",
    timeToEvent: "5h 40m",
    estimatedPiracy: "640K+ viewers",
    estimatedViewers: 640_000,
    confidence: 0.88,
  },
  {
    id: 4,
    match: "Monaco Grand Prix — Final Practice",
    league: "Formula 1",
    riskLevel: "High",
    timeToEvent: "8h 02m",
    estimatedPiracy: "410K+ viewers",
    estimatedViewers: 410_000,
    confidence: 0.82,
  },
  {
    id: 5,
    match: "Bayern Munich vs PSG",
    league: "UEFA Champions League",
    riskLevel: "Critical",
    timeToEvent: "1d 03h",
    estimatedPiracy: "1.8M+ viewers",
    estimatedViewers: 1_810_000,
    confidence: 0.95,
  },
  {
    id: 6,
    match: "Chiefs vs 49ers — Divisional Round",
    league: "NFL",
    riskLevel: "High",
    timeToEvent: "1d 12h",
    estimatedPiracy: "780K+ viewers",
    estimatedViewers: 780_000,
    confidence: 0.86,
  },
  {
    id: 7,
    match: "Djokovic vs Alcaraz — Semifinal",
    league: "Wimbledon",
    riskLevel: "Medium",
    timeToEvent: "2d 04h",
    estimatedPiracy: "320K+ viewers",
    estimatedViewers: 320_000,
    confidence: 0.74,
  },
  {
    id: 8,
    match: "India vs Pakistan — T20 World Cup",
    league: "ICC",
    riskLevel: "Critical",
    timeToEvent: "3d 09h",
    estimatedPiracy: "4.5M+ viewers",
    estimatedViewers: 4_550_000,
    confidence: 0.99,
  },
  {
    id: 9,
    match: "Inter Miami vs LAFC",
    league: "MLS",
    riskLevel: "Medium",
    timeToEvent: "4d 11h",
    estimatedPiracy: "180K+ viewers",
    estimatedViewers: 180_000,
    confidence: 0.69,
  },
  {
    id: 10,
    match: "All Blacks vs Springboks",
    league: "Rugby Championship",
    riskLevel: "High",
    timeToEvent: "5d 02h",
    estimatedPiracy: "290K+ viewers",
    estimatedViewers: 290_000,
    confidence: 0.81,
  },
];

// ============================================================================
// Tracking — live piracy incidents
// ============================================================================
export const trackingIncidents: TrackingIncident[] = [
  {
    id: 101,
    source: "Telegram",
    type: "Live Stream",
    viewers: 15_400,
    region: "Europe",
    status: "Tracking",
    match: "Manchester United vs Liverpool",
    detectedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    url: "t.me/+RedDevilsHD-EPL",
  },
  {
    id: 102,
    source: "Twitter/X",
    type: "Short Clip",
    viewers: 47_200,
    region: "Global",
    status: "Enforcement Pending",
    match: "El Clásico",
    detectedAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
    url: "x.com/elclasico_live/status/183920",
  },
  {
    id: 103,
    source: "Illegal IPTV",
    type: "App",
    viewers: 121_800,
    region: "Asia",
    status: "Takedown Issued",
    match: "India vs Pakistan",
    detectedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    url: "iptv-cricstream.app/channel/star-sports-1",
  },
  {
    id: 104,
    source: "YouTube",
    type: "Live Stream",
    viewers: 28_900,
    region: "South America",
    status: "Tracking",
    match: "Real Madrid vs Barcelona",
    detectedAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    url: "youtube.com/live/laliga-hd-stream-es",
  },
  {
    id: 105,
    source: "Discord",
    type: "Embedded Player",
    viewers: 8_400,
    region: "North America",
    status: "Tracking",
    match: "Lakers vs Celtics",
    detectedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    url: "discord.gg/nba-livestreams",
  },
  {
    id: 106,
    source: "Reddit",
    type: "Stream Index",
    viewers: 19_700,
    region: "Global",
    status: "Enforcement Pending",
    match: "Monaco Grand Prix",
    detectedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    url: "reddit.com/r/formula1streams/post/9k2",
  },
  {
    id: 107,
    source: "TikTok",
    type: "Short Clip",
    viewers: 92_300,
    region: "Asia",
    status: "Tracking",
    match: "Bayern Munich vs PSG",
    detectedAt: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
    url: "tiktok.com/@uclclips/video/74829",
  },
  {
    id: 108,
    source: "Pirate IPTV",
    type: "M3U Playlist",
    viewers: 64_500,
    region: "Middle East",
    status: "Takedown Issued",
    match: "El Clásico",
    detectedAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
    url: "freeiptv.club/playlists/spanish-football.m3u",
  },
  {
    id: 109,
    source: "Twitch",
    type: "Re-stream",
    viewers: 11_200,
    region: "Europe",
    status: "Resolved",
    match: "Chiefs vs 49ers",
    detectedAt: new Date(Date.now() - 1000 * 60 * 73).toISOString(),
    url: "twitch.tv/nflgameday_eu",
  },
  {
    id: 110,
    source: "Facebook",
    type: "Live Stream",
    viewers: 33_600,
    region: "Africa",
    status: "Enforcement Pending",
    match: "All Blacks vs Springboks",
    detectedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    url: "facebook.com/rugbylivehq/videos/82910",
  },
  {
    id: 111,
    source: "Telegram",
    type: "Channel Index",
    viewers: 24_100,
    region: "Asia",
    status: "Tracking",
    match: "Wimbledon Semifinal",
    detectedAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    url: "t.me/wimbledon_hd_2026",
  },
  {
    id: 112,
    source: "Illegal IPTV",
    type: "Set-top Box",
    viewers: 87_900,
    region: "Europe",
    status: "Takedown Issued",
    match: "Premier League Sunday",
    detectedAt: new Date(Date.now() - 1000 * 60 * 58).toISOString(),
    url: "premiumbox.tv/uk-sports-pack",
  },
];

// ============================================================================
// Enforcement Actions log (mutable — appended when /enforcement is POSTed)
// ============================================================================
export const enforcementActions: EnforcementAction[] = [
  {
    id: 9001,
    incidentId: 103,
    action: "DMCA Takedown Notice",
    target: "iptv-cricstream.app",
    status: "Delivered",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 9002,
    incidentId: 108,
    action: "Content Poisoning Injected",
    target: "freeiptv.club",
    status: "Active",
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
  },
  {
    id: 9003,
    incidentId: 109,
    action: "Platform Notification",
    target: "Twitch Trust & Safety",
    status: "Acknowledged",
    timestamp: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
  },
  {
    id: 9004,
    incidentId: 112,
    action: "DMCA Takedown Notice",
    target: "premiumbox.tv",
    status: "Pending Review",
    timestamp: new Date(Date.now() - 1000 * 60 * 36).toISOString(),
  },
  {
    id: 9005,
    incidentId: 102,
    action: "Stream Origin Blocked",
    target: "Twitter/X CDN",
    status: "Active",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
];

let nextActionId = 9100;

export function appendEnforcement(input: {
  incidentId: number;
  action: string;
}): EnforcementAction {
  const incident = trackingIncidents.find((i) => i.id === input.incidentId);
  const target = incident
    ? new URL(
        incident.url.startsWith("http")
          ? incident.url
          : `https://${incident.url}`,
      ).hostname
    : `incident-${input.incidentId}`;

  const action: EnforcementAction = {
    id: nextActionId++,
    incidentId: input.incidentId,
    action: input.action,
    target,
    status: "Drafting",
    timestamp: new Date().toISOString(),
  };
  enforcementActions.unshift(action);

  // Bump the related incident's status to reflect the enforcement
  if (incident && incident.status === "Tracking") {
    incident.status = "Enforcement Pending";
  } else if (incident && incident.status === "Enforcement Pending") {
    incident.status = "Takedown Issued";
  }

  return action;
}

// ============================================================================
// Protected assets (Content DNA + watermarking)
// ============================================================================
export const assets: Asset[] = [
  {
    id: "A1",
    name: "UEFA Champions League Final 2026",
    league: "UEFA",
    dnaGenerated: true,
    watermarkEmbedded: true,
    integrity: "100%",
    protectedSince: "2026-03-12T09:00:00.000Z",
    leakAttempts: 412,
  },
  {
    id: "A2",
    name: "NBA Finals Game 7",
    league: "NBA",
    dnaGenerated: true,
    watermarkEmbedded: true,
    integrity: "98%",
    protectedSince: "2026-04-01T15:30:00.000Z",
    leakAttempts: 287,
  },
  {
    id: "A3",
    name: "Monaco Grand Prix — Race Day",
    league: "Formula 1",
    dnaGenerated: true,
    watermarkEmbedded: true,
    integrity: "99%",
    protectedSince: "2026-04-18T07:15:00.000Z",
    leakAttempts: 196,
  },
  {
    id: "A4",
    name: "Super Bowl LX Broadcast",
    league: "NFL",
    dnaGenerated: true,
    watermarkEmbedded: true,
    integrity: "100%",
    protectedSince: "2026-02-08T20:00:00.000Z",
    leakAttempts: 1_842,
  },
  {
    id: "A5",
    name: "Wimbledon Men's Final",
    league: "ATP",
    dnaGenerated: true,
    watermarkEmbedded: true,
    integrity: "97%",
    protectedSince: "2026-04-22T11:45:00.000Z",
    leakAttempts: 134,
  },
  {
    id: "A6",
    name: "ICC T20 World Cup Final",
    league: "ICC",
    dnaGenerated: true,
    watermarkEmbedded: false,
    integrity: "92%",
    protectedSince: "2026-04-20T14:00:00.000Z",
    leakAttempts: 2_104,
  },
  {
    id: "A7",
    name: "Premier League — Matchday 35",
    league: "Premier League",
    dnaGenerated: true,
    watermarkEmbedded: true,
    integrity: "99%",
    protectedSince: "2026-04-25T12:30:00.000Z",
    leakAttempts: 521,
  },
  {
    id: "A8",
    name: "Six Nations — Final Round",
    league: "Rugby",
    dnaGenerated: false,
    watermarkEmbedded: true,
    integrity: "88%",
    protectedSince: "2026-03-15T16:00:00.000Z",
    leakAttempts: 73,
  },
];

// ============================================================================
// Aggregate dashboard helpers
// ============================================================================
export function buildDashboardSummary() {
  const activeIncidents = trackingIncidents.filter(
    (i) => i.status !== "Resolved",
  ).length;
  const viewersBlocked = trackingIncidents
    .filter((i) => i.status === "Takedown Issued" || i.status === "Resolved")
    .reduce((sum, i) => sum + i.viewers, 0);
  const takedownsToday = enforcementActions.length;
  const protectedAssets = assets.length;
  return {
    activeIncidents,
    viewersBlocked,
    takedownsToday,
    protectedAssets,
    revenueRecovered: "$4.82M",
    avgResponseSeconds: 47,
  };
}

export function buildRegionBreakdown(): RegionStat[] {
  const map = new Map<string, RegionStat>();
  for (const i of trackingIncidents) {
    const cur = map.get(i.region) ?? {
      region: i.region,
      viewers: 0,
      incidents: 0,
    };
    cur.viewers += i.viewers;
    cur.incidents += 1;
    map.set(i.region, cur);
  }
  return [...map.values()].sort((a, b) => b.viewers - a.viewers);
}

export function buildSourceBreakdown(): SourceStat[] {
  const map = new Map<string, SourceStat>();
  for (const i of trackingIncidents) {
    const cur = map.get(i.source) ?? {
      source: i.source,
      viewers: 0,
      incidents: 0,
    };
    cur.viewers += i.viewers;
    cur.incidents += 1;
    map.set(i.source, cur);
  }
  return [...map.values()].sort((a, b) => b.viewers - a.viewers);
}

export function buildTimeseries(): TimeseriesPoint[] {
  const points: TimeseriesPoint[] = [];
  const now = new Date();
  // Generate 24 hourly points — deterministic-ish synthetic curve
  for (let h = 23; h >= 0; h--) {
    const t = new Date(now.getTime() - h * 60 * 60 * 1000);
    const hour = t.toISOString().slice(11, 16); // HH:MM UTC
    const baseline = 80_000;
    const wave =
      Math.sin((t.getUTCHours() / 24) * Math.PI * 2) * 45_000 +
      Math.cos((t.getUTCHours() / 12) * Math.PI) * 22_000;
    const noise = ((t.getUTCHours() * 9301 + 49297) % 233280) / 233280;
    const viewers = Math.max(
      18_000,
      Math.round(baseline + wave + noise * 30_000),
    );
    const blocked = Math.round(viewers * (0.55 + noise * 0.25));
    points.push({ hour, viewers, blocked });
  }
  return points;
}
