import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { conflictError, forbidderError, notFoundError, paymentRequiredError, unauthorizedError } from '@/errors';
import activitiesRepository from '@/repositories/activities-repository';
import { Activity, Prisma, Stage } from '@prisma/client';

async function getStages(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.TicketType.isRemote) throw unauthorizedError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();

  const stages: StagesFormated = await activitiesRepository.findStages(userId);
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    stage.Activities.forEach((e) => {
      e.registered = e.ActivityBooking.length ? true : false;
      e.bookingCount = e._count.ActivityBooking;

      delete e.ActivityBooking;
      delete e._count;
    });
  }
  return stages;
}

export type StagesFormated = (Stage & {
  Activities: (Activity &
    Partial<{
      _count: Prisma.ActivityCountOutputType;
      ActivityBooking: { id: number }[];
      registered: boolean;
      bookingCount: number;
    }>)[];
})[];

async function getDates(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.TicketType.isRemote) throw unauthorizedError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();

  const dates = await activitiesRepository.findDates();
  return dates;
}

async function postBooking(userId: number, activityId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.TicketType.isRemote) throw unauthorizedError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();

  const booking = await activitiesRepository.findBookingById(userId, activityId);
  if (booking) throw forbidderError();

  const currAct = await getActivityTime(activityId);
  const userActivities = await activitiesRepository.findActivitiesByUserId(userId);

  for (let i = 0; i < userActivities.length; i++) {
    const userAct = await getActivityTime(userActivities[i].Activity.id);

    if (userAct.date.getTime() === currAct.date.getTime()) {
      const initConflict = userAct.initTime >= currAct.initTime && userAct.initTime < currAct.finalTime;
      const finalConflict = userAct.finalTime > currAct.initTime && userAct.finalTime <= currAct.finalTime;
      if (initConflict || finalConflict) throw conflictError('Conflicting activity time!');
    }
  }

  await activitiesRepository.createBooking(userId, activityId);
}

async function getActivityTime(activityId: number) {
  const activity = await activitiesRepository.findActivityById(activityId);
  const activities = await activitiesRepository.findActivitiesByDateStage(activity.date, activity.stageId);

  let initTime = 9;
  for (let i = 0; i < activities.length; i++) {
    const e = activities[i];
    if (activity.id === e.id) break;
    initTime += e.duration;
  }

  const finalTime = initTime + activity.duration;
  return { initTime, finalTime, date: activity.date };
}

const activitiesService = {
  getStages,
  getDates,
  postBooking,
};

export default activitiesService;
