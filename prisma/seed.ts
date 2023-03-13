import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }
  console.log({ event });

  const ticketsTypesSeed = [
    {
      name: 'Remoto',
      price: 100,
      isRemote: true,
      includesHotel: false,
    },
    {
      name: 'PresencialComHotel',
      price: 200,
      isRemote: false,
      includesHotel: true,
    },
    {
      name: 'PresencialSemHotel',
      price: 150,
      isRemote: false,
      includesHotel: false,
    },
  ];

  let ticketsTypes = await prisma.ticketType.findFirst();
  if (!ticketsTypes) {
    const ticketsTypesCreation = await prisma.ticketType.createMany({
      data: ticketsTypesSeed,
    });

    console.log(ticketsTypesCreation);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
