import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingRoom, listBooking, changeBooking, deleteBooking } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("", listBooking)
  .post("", bookingRoom)
  .put("/:bookingId", changeBooking)
 .delete("/:bookingId",deleteBooking);

export { bookingRouter };
