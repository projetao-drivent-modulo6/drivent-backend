import { prisma } from '@/config';
import { Booking } from '@prisma/client';

type CreateParams = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateParams = Omit<Booking, 'createdAt' | 'updatedAt'>;

async function create({ roomId, userId }: CreateParams): Promise<Booking> {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function findByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
      Room: true,
    },
  });
}

async function findByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: {
        include: { Hotel: true, _count: true }
      }
    }
  });
}

async function upsertBooking({ id, roomId, userId }: UpdateParams) {
  return prisma.booking.upsert({
    where: {
      id,
    },
    create: {
      roomId,
      userId,
    },
    update: {
      roomId,
    },
  });
}

async function deleteBooking({ id }: any) {
  return prisma.booking.delete({
    where: {
      id: id,
    },
  });
}
const bookingRepository = {
  create,
  findByRoomId,
  findByUserId,
  upsertBooking,
  deleteBooking,
};

export default bookingRepository;
