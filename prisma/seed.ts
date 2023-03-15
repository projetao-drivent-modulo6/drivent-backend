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

  const stagesIds: number[] = [];
  let stage = await prisma.stage.findFirst();
  if (stage) await prisma.stage.deleteMany();

  const stages = ['Auditório Principal', 'Auditório Lateral', 'Sala de Workshop'];
  for (let i = 0; i < stages.length; i++) {
    const name = stages[i];
    stage = await prisma.stage.create({ data: { name } });
    stagesIds.push(stage.id);
  }

  const dates = [new Date('2023-10-21'), new Date('2023-10-22'), new Date('2023-10-23')]
  const activity = await prisma.activity.findFirst();
  if (activity) await prisma.activity.deleteMany();
  
  await prisma.activity.createMany({
    data: [
      { name: 'Minecraft: montando o PC ideal', duration: 1, capacity: 30, date: dates[0], stageId: stagesIds[0] },
      { name: 'LoL: montando o PC ideal', duration: 1, capacity: 0, date: dates[0], stageId: stagesIds[0] },
      { name: 'Palestra x', duration: 2, capacity: 30, date: dates[0], stageId: stagesIds[1] },
      { name: 'Palestra y', duration: 1, capacity: 30, date: dates[0], stageId: stagesIds[2] },
      { name: 'Palestra z', duration: 1, capacity: 30, date: dates[0], stageId: stagesIds[2] },

      { name: 'Palestra x', duration: 2, capacity: 30, date: dates[1], stageId: stagesIds[0] },
      { name: 'Palestra y', duration: 1, capacity: 30, date: dates[1], stageId: stagesIds[1] },
      { name: 'Palestra z', duration: 1, capacity: 30, date: dates[1], stageId: stagesIds[2] },

      { name: 'Palestra x', duration: 1, capacity: 30, date: dates[2], stageId: stagesIds[0] },
      { name: 'Palestra y', duration: 1, capacity: 30, date: dates[2], stageId: stagesIds[1] },
      { name: 'Palestra z', duration: 2, capacity: 30, date: dates[2], stageId: stagesIds[2] },
    ]
  });

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
