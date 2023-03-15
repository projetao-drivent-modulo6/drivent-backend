import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getDates, getStages, postActivityBooking } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/stages", getStages)
  .get("/dates", getDates)
  .post("/booking/:activityId", postActivityBooking)

export { activitiesRouter };
