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

async function findDates() {
  return prisma.activity.groupBy({
    by: ['date'],
  });
}

async function findBooking(userId: number, activityId: number) {
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
  findBooking,
  createBooking
};

export default activitiesRepository;
