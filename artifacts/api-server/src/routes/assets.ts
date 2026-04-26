import { Router, type IRouter } from "express";
import { GetAssetsResponse } from "@workspace/api-zod";
import { assets } from "../lib/data";

const router: IRouter = Router();

router.get("/assets", async (_req, res): Promise<void> => {
  const payload = GetAssetsResponse.parse({ assets });
  res.json(payload);
});

export default router;
