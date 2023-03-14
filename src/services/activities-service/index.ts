import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { forbidderError, notFoundError, paymentRequiredError, unauthorizedError } from "@/errors";
import activitiesRepository from "@/repositories/activities-repository";
import { Activity, Prisma, Stage } from "@prisma/client";

async function getStages(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.TicketType.isRemote) throw unauthorizedError();
  if (ticket.status !== "PAID") throw paymentRequiredError();

  const stages: StagesFormated = await activitiesRepository.findStages(userId);
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    stage.Activities.forEach(e => {
      e.registered = (e.ActivityBooking.length) ? true : false;
      e.bookingCount = e._count.ActivityBooking;

      delete e.ActivityBooking;
      delete e._count;
    });
  }
  return stages;
}

type StagesFormated = (Stage & {
  Activities: (Activity & 
    Partial<{
      _count: Prisma.ActivityCountOutputType;
      ActivityBooking: { id: number }[];
      registered: boolean;
      bookingCount: number;
    }>
  )[];
})[]

async function getDates(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.TicketType.isRemote) throw unauthorizedError();
  if (ticket.status !== "PAID") throw paymentRequiredError();

  const dates = await activitiesRepository.findDates();
  return dates;
}

async function postBooking(userId: number, activityId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.TicketType.isRemote) throw unauthorizedError();
  if (ticket.status !== "PAID") throw paymentRequiredError();

  const booking = await activitiesRepository.findBooking(userId, activityId);
  if (booking) throw forbidderError();
  
  await activitiesRepository.createBooking(userId, activityId);
}

const activitiesService = {
  getStages,
  getDates,
  postBooking
};

export default activitiesService;
