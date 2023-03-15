import { prisma } from "@/config";

async function findStages(userId: number) {
  return prisma.stage.findMany({
    include: {
      Activities: {
        include: { 
          _count: true,
          ActivityBooking: {
            select: { id: true },
            where: { userId: userId }
          }
        },
        orderBy: { id: "asc" }
      }
    },
  });
}

async function findActivitiesByDateStage(date: Date, stageId: number) {
  return prisma.activity.findMany({
    where: { date, stageId },
    orderBy: { id: 'asc'}
  })
}

async function findActivitiesByUserId(userId: number) {
  return prisma.activityBooking.findMany({
    select: { Activity: true },
    where: { userId }
  })
}

async function findActivityById(id: number) {
  return prisma.activity.findUnique({
    where: { id }
  })
}

async function findDates() {
  return prisma.activity.groupBy({
    by: ['date'],
    orderBy: { date: 'asc' }
  });
}

async function findBookingById(userId: number, activityId: number) {
  return prisma.activityBooking.findFirst({
    where: { userId, activityId }
  });
}

async function createBooking(userId: number, activityId: number) {
  return prisma.activityBooking.create({
    data: { userId, activityId }
  });
}

const activitiesRepository = {
  findStages,
  findDates,
  findBookingById,
  createBooking,
  findActivityById,
  findActivitiesByDateStage,
  findActivitiesByUserId
};

export default activitiesRepository;
