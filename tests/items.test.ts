import { prisma } from "../src/database";
import supertest from "supertest";
import app from "../src/app";
import { createItem, insertItem } from "./factory/itemFactory";

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "items"`;
});

describe("Testa POST /items ", () => {
  it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
    const item = await createItem();
    const response = await supertest(app).post("/items").send(item);
    expect(response.status).toEqual(201);
  });
  it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
    const item = await insertItem();
    delete item.id;
    const response = await supertest(app).post("/items").send(item);
    expect(response.status).toEqual(409);
  });
});

describe("Testa GET /items ", () => {
  it("Deve retornar status 200 e o body no formato de Array", async () => {
    const response = await supertest(app).get("/items");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("Testa GET /items/:id ", () => {
  it("Deve retornar status 200 e um objeto igual a o item cadastrado", async () => {
    const item = await insertItem();
    const response = await supertest(app).get(`/items/${item.id}`);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(item);
  });
  it("Deve retornar status 404 caso não exista um item com esse id", async () => {
    const response = await supertest(app).get(`/items/-1`);
    expect(response.status).toEqual(404);
  });
});
