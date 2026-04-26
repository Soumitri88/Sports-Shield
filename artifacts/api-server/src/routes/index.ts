import { Router, type IRouter } from "express";
import healthRouter from "./health";
import predictionsRouter from "./predictions";
import trackingRouter from "./tracking";
import enforcementRouter from "./enforcement";
import assetsRouter from "./assets";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(predictionsRouter);
router.use(trackingRouter);
router.use(enforcementRouter);
router.use(assetsRouter);
router.use(dashboardRouter);

export default router;
