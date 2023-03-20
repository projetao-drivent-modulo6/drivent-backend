import faker from '@faker-js/faker';

export function createMockDates() {
  return [
    {
      date: faker.date.future(),
    },
    {
      date: faker.date.future(),
    },
    {
      date: faker.date.future(),
    },
  ];
}
