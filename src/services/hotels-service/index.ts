import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getHotels(userId: number) {
  await listHotels(userId);
  const cacheHotels = await hotelRepository.getCacheHotels("hoteldata");
  if (!cacheHotels) {
    const hotels = await hotelRepository.findHotels();
    const postCacheHotel = await hotelRepository.postCacheHotels("hoteldata", hotels);
    console.log("PostKeyRedis");
    return hotels;
  }
  console.log("GetKeysRedis");
  return cacheHotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  await listHotels(userId);
  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }
  return hotel;
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;

// async function getHotels(userId: number) {
//   await listHotels(userId);
//   const redisClient = Redis.createClient();
//   const CACHE_PREFIX = 'hotel-service:';
//   const cacheKey = `${CACHE_PREFIX}hotels`;
//   const cacheTTL = 60 * 60; // tempo de expiração do cache em segundos

//   // tenta obter os dados do cache
//   const cachedData = await new Promise<string | null>((resolve, reject) => {
//     redisClient.get(cacheKey, (err, reply) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(reply);
//       }
//     });
//   });

//   // se os dados estiverem em cache, retorna-os imediatamente
//   if (cachedData !== null) {
//     return JSON.parse(cachedData);
//   }

//   // se não houver dados em cache, busca do banco de dados
//   const hotels = await hotelRepository.findHotels();

//   // armazena os dados em cache
//   redisClient.set(cacheKey, JSON.stringify(hotels), 'EX', cacheTTL);

//   return hotels;
// }
