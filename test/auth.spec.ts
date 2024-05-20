import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { AppModule } from "../src/app.module";
import { TestService } from "./test.service";
import { TestModule } from "./test.module";

describe("AuthController", () => {
  let app: INestApplication;
  let testService: TestService;

  const email = "test@gmail.com";
  const username = "test";
  const password = "test";

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
  });

  describe("POST /api/register", () => {
    it("should be rejected if request is invalid", async () => {
      await testService.deleteUser();

      const response = await request(app.getHttpServer()).post("/api/register").send({
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
      });

      expect(response.status).toBe(422);
      expect(response.body.message).toBeDefined();
    });

    it("should be able to register", async () => {
      await testService.deleteUser();

      const response = await request(app.getHttpServer()).post("/api/register").send({
        email: email,
        username: username,
        password: password,
        password_confirmation: password,
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.email).toBe(email);
      expect(response.body.data.username).toBe(username);
    });
  });

  describe("POST /api/login", () => {
    it("should be rejected if request is invalid", async () => {
      await testService.deleteUser();
      await testService.createUser();

      const response = await request(app.getHttpServer()).post("/api/login").send({
        email_or_username: "",
        password: "",
      });

      expect(response.status).toBe(422);
      expect(response.body.message).toBeDefined();
    });

    it("should be able to login", async () => {
      await testService.deleteUser();
      await testService.createUser();

      const response = await request(app.getHttpServer()).post("/api/login").send({
        email_or_username: email,
        password: password,
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.data.email).toBe(email);
      expect(response.body.data.username).toBe(password);
      expect(response.body.token).toBeDefined();
    });
  });
});
