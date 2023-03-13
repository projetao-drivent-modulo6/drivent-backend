import { createClient } from "redis";
import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany({
    include: {
      Rooms: {
        select: { capacity: true, _count: true },
      },
    },
  });
}

async function getCacheHotels(key: string) {
  try {
    const redis = createClient({
      url: process.env.REDIS_URL,
    });
    await redis.connect();

    const cacheHotels = await redis.get(key);
    return JSON.parse(cacheHotels);
  } catch (err) {
    console.log(err);
  }
}

async function postCacheHotels(key: string, value: any) {
  try {
    const redis = createClient({
      url: process.env.REDIS_URL,
    });
    await redis.connect();

    const cacheHotels = await redis.set(key, JSON.stringify(value));
    return cacheHotels;
  } catch (err) {
    console.log(err);
  }
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: {
        select: { id: true, name: true, capacity: true, _count: true },
        orderBy: { id: "asc" },
      },
    },
  });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
  getCacheHotels,
  postCacheHotels,
};

export default hotelRepository;
