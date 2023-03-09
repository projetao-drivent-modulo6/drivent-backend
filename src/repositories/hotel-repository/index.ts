import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany({
    include: {
      Rooms: {
        select: { capacity: true, _count: true },
      }
    }
  });
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: {
        select: { id: true, name: true, capacity: true, _count: true },
        orderBy: { id: 'asc' }
      },
    }
  });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
};

export default hotelRepository;
