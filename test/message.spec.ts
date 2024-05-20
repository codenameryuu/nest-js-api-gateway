import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { TestService } from "./test.service";
import { TestModule } from "./test.module";

import { AppModule } from "../src/app.module";

describe("MessageController", () => {
  let app: INestApplication;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
  });

  describe("POST /api/sendMessage", () => {
    it("should be rejected if the token is wrong", async () => {
      const response = await request(app.getHttpServer()).post("/api/sendMessage").set("Authorization", `wrong`).send({
        sender_id: "",
        receiver_id: "",
        message: "",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it("should be rejected if the token is correct but the request is invalid", async () => {
      await testService.deleteUser();
      const currentUser = await testService.createUserWithProfile();

      const token = currentUser.token;

      const response = await request(app.getHttpServer()).post("/api/sendMessage").set("Authorization", `Bearer ${token}`).send({
        sender_id: "",
        receiver_id: "",
        message: "",
      });

      expect(response.status).toBe(422);
      expect(response.body.message).toBeDefined();
    });

    it("should be send the message", async () => {
      await testService.deleteUser();
      const currentUser = await testService.createUserWithProfile();

      const user = currentUser.userFirst;
      const userSecond = currentUser.userSecond;
      const token = currentUser.token;

      const response = await request(app.getHttpServer()).post("/api/sendMessage").set("Authorization", `Bearer ${token}`).send({
        sender_id: user._id,
        receiver_id: userSecond._id,
        message: "Halo test message",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  describe("GET /api/viewMessages", () => {
    it("should be rejected if the token is wrong", async () => {
      const response = await request(app.getHttpServer()).get("/api/viewMessages").send();

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it("should be rejected if the token is correct but the request is invalid", async () => {
      await testService.deleteUser();
      const currentUser = await testService.createUserWithProfile();

      const token = currentUser.token;

      const response = await request(app.getHttpServer()).get("/api/viewMessages").set("Authorization", `Bearer ${token}`).send({
        page: "",
        per_page: "",
        sender_id: "",
        receiver_id: "",
      });

      expect(response.status).toBe(422);
      expect(response.body.message).toBeDefined();
    });

    it("should be fetched the message", async () => {
      await testService.deleteUser();
      const currentUser = await testService.createUserWithProfile();

      const user = currentUser.userFirst;
      const userSecond = currentUser.userSecond;
      const token = currentUser.token;

      const response = await request(app.getHttpServer()).get("/api/viewMessages").set("Authorization", `Bearer ${token}`).query({
        page: "1",
        per_page: "5",
        sender_id: user._id,
        receiver_id: userSecond._id,
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });
});
