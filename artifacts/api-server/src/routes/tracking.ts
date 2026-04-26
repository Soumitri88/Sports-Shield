import { Router, type IRouter } from "express";
import { GetTrackingResponse } from "@workspace/api-zod";
import { trackingIncidents } from "../lib/data";

const router: IRouter = Router();

router.get("/tracking", async (_req, res): Promise<void> => {
  const payload = GetTrackingResponse.parse({
    activeIncidents: trackingIncidents,
  });
  res.json(payload);
});

export default router;
