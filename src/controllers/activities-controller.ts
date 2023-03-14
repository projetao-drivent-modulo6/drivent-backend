import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import activitiesService from "@/services/activities-service";

export async function getStages(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const stages = await activitiesService.getStages(userId);
    return res.status(httpStatus.OK).send(stages);
  } catch (error) {
    if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === "UnauthorizedError") return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (error.name === "PaymentRequiredError") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getDates(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const dates = await activitiesService.getDates(userId);
    return res.status(httpStatus.OK).send(dates);
  } catch (error) {
    if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === "UnauthorizedError") return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (error.name === "PaymentRequiredError") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const activityId = Number(req.params.activityId);

  if (!activityId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    await activitiesService.postBooking(userId, activityId);
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "NotFoundError") return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === "UnauthorizedError") return res.sendStatus(httpStatus.UNAUTHORIZED);
    if (error.name === "PaymentRequiredError") return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    if (error.name === "ForbiddenError") return res.sendStatus(httpStatus.FORBIDDEN);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

