import { Router, type IRouter } from "express";
import {
  GetDashboardSummaryResponse,
  GetRegionBreakdownResponse,
  GetSourceBreakdownResponse,
  GetTrafficTimeseriesResponse,
} from "@workspace/api-zod";
import {
  buildDashboardSummary,
  buildRegionBreakdown,
  buildSourceBreakdown,
  buildTimeseries,
} from "../lib/data";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const payload = GetDashboardSummaryResponse.parse(buildDashboardSummary());
  res.json(payload);
});

router.get("/dashboard/regions", async (_req, res): Promise<void> => {
  const payload = GetRegionBreakdownResponse.parse({
    regions: buildRegionBreakdown(),
  });
  res.json(payload);
});

router.get("/dashboard/sources", async (_req, res): Promise<void> => {
  const payload = GetSourceBreakdownResponse.parse({
    sources: buildSourceBreakdown(),
  });
  res.json(payload);
});

router.get("/dashboard/timeseries", async (_req, res): Promise<void> => {
  const payload = GetTrafficTimeseriesResponse.parse({
    points: buildTimeseries(),
  });
  res.json(payload);
});

export default router;
