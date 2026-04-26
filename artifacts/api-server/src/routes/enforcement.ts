import { Router, type IRouter } from "express";
import {
  TriggerEnforcementBody,
  TriggerEnforcementResponse,
  GetEnforcementActionsResponse,
} from "@workspace/api-zod";
import { appendEnforcement, enforcementActions } from "../lib/data";

const router: IRouter = Router();

router.post("/enforcement", async (req, res): Promise<void> => {
  const parsed = TriggerEnforcementBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn(
      { errors: parsed.error.message },
      "Invalid enforcement request",
    );
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const action = appendEnforcement(parsed.data);
  req.log.info(
    { incidentId: action.incidentId, action: action.action },
    "Enforcement action triggered",
  );

  const payload = TriggerEnforcementResponse.parse({
    success: true,
    message: `Action '${action.action}' initiated for incident ${action.incidentId}`,
    agentStatus:
      "Drafting DMCA Notice and content-poisoning sequence — distributing to enforcement partners",
  });
  res.json(payload);
});

router.get("/enforcement/actions", async (_req, res): Promise<void> => {
  const payload = GetEnforcementActionsResponse.parse({
    actions: enforcementActions,
  });
  res.json(payload);
});

export default router;
