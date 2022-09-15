import { prisma } from "../../src/database";
import { faker } from "@faker-js/faker";

export async function insertItem() {
  const item = await createItem();
  const insertedItem = await prisma.items.create({ data: item });

  return insertedItem;
}

export async function createItem() {
  const item = {
    title: faker.animal.cat(),
    url: faker.image.business(),
    description: faker.hacker.phrase(),
    amount: faker.datatype.number(),
  };
  return item;
}
