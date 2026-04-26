import { Router, type IRouter } from "express";
import { GetPredictionsResponse } from "@workspace/api-zod";
import { predictions } from "../lib/data";

const router: IRouter = Router();

router.get("/predictions", async (_req, res): Promise<void> => {
  const payload = GetPredictionsResponse.parse({ highRiskEvents: predictions });
  res.json(payload);
});

export default router;
