import faker from '@faker-js/faker';
import { prisma } from '@/config';
import { Ticket, TicketStatus, TicketType } from '@prisma/client';

export async function createTicketType() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: faker.datatype.boolean(),
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketTypeRemote() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: true,
      includesHotel: faker.datatype.boolean(),
    },
  });
}

export async function createTicketTypeWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: false,
      includesHotel: true,
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export function createMockTicketType(isRemote: boolean, includesHotel: boolean): TicketType {
  return {
    id: 1,
    name: faker.name.findName(),
    price: faker.datatype.number(),
    isRemote: isRemote,
    includesHotel: includesHotel,
    createdAt: new Date('19/03/2023'),
    updatedAt: new Date('19/03/2023'),
  };
}

export function createMockTicket(
  status: TicketStatus,
  ticketType: TicketType,
): Ticket & {
  TicketType: TicketType;
} {
  return {
    id: 1,
    enrollmentId: 1,
    status: status,
    ticketTypeId: 1,
    createdAt: new Date('19/03/2023'),
    updatedAt: new Date('19/03/2023'),
    TicketType: ticketType,
  };
}
