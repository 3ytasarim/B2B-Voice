import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import seoRouter from "./seo";
import trackingRouter from "./tracking";
import blogRouter from "./blog";
import adminRouter from "./admin";
import referencesRouter from "./references";
import partnersRouter from "./partners";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(seoRouter);
router.use(trackingRouter);
router.use(blogRouter);
router.use(adminRouter);
router.use(referencesRouter);
router.use(partnersRouter);

export default router;
