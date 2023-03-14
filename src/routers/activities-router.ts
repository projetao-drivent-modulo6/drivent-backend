import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getDates, getStages, postBooking } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/stages", getStages)
  .get("/dates", getDates)
  .post("/booking/:activityId", postBooking)

export { activitiesRouter };
