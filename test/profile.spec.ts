import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

import { TestService } from "./test.service";
import { TestModule } from "./test.module";

import { AppModule } from "../src/app.module";

describe("ProfileController", () => {
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

  describe("POST /api/createProfile", () => {
    it("should be rejected if the token is wrong", async () => {
      const response = await request(app.getHttpServer()).post("/api/createProfile").set("Authorization", `wrong`).send({
        user_id: "",
        name: "",
        gender: "",
        date_of_birth: "",
        height: "",
        weight: "",
        interest: "",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it("should be rejected if the token is correct but the request is invalid", async () => {
      await testService.deleteUser();
      const currentUser = await testService.createUser();

      const token = currentUser.token;

      const response = await request(app.getHttpServer()).post("/api/createProfile").set("Authorization", `Bearer ${token}`).send({
        user_id: "",
        name: "",
        gender: "",
        date_of_birth: "",
        height: "",
        weight: "",
        interest: "",
      });

      expect(response.status).toBe(422);
      expect(response.body.message).toBeDefined();
    });

    it("should be created the profile", async () => {
      await testService.deleteUser();
      const currentUser = await testService.createUser();

      const user = currentUser.userFirst;
      const token = currentUser.token;

      const response = await request(app.getHttpServer())
        .post("/api/createProfile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          user_id: user._id,
          name: "Test",
          gender: "Male",
          date_of_birth: "1998-09-12",
          height: "176",
          weight: "100",
          interest: ["Playing games"],
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  describe("GET /api/getProfile/:userId", () => {
    it("should be rejected if the token is wrong", async () => {
      await testService.deleteUser();
      const currentUser = await testService.createUserWithProfile();

      const user = currentUser.userFirst;

      const response = await request(app.getHttpServer())
        .get("/api/getProfile/" + user._id)
        .send();

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it("should be fetched the profile", async () => {
      await testService.deleteUser();
      const currentUser = await testService.createUserWithProfile();

      const user = currentUser.userFirst;
      const token = currentUser.token;

      const response = await request(app.getHttpServer())
        .get("/api/getProfile/" + user._id)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  describe("PUT /api/updateProfile/:userId", () => {
    it("should be rejected if the token is wrong", async () => {
      await testService.deleteUser();
      const currentUser = await testService.createUserWithProfile();

      const user = currentUser.userFirst;

      const response = await request(app.getHttpServer())
        .put("/api/updateProfile/" + user._id)
        .send({
          user_id: "",
          name: "",
          gender: "",
          date_of_birth: "",
          height: "",
          weight: "",
          interest: "",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });

    it("should be rejected if the token is correct but the request is invalid", async () => {
      await testService.deleteUser();
      const currentUser = await testService.createUserWithProfile();

      const user = currentUser.userFirst;
      const token = currentUser.token;

      const response = await request(app.getHttpServer())
        .put("/api/updateProfile/" + user._id)
        .set("Authorization", `Bearer ${token}`)
        .send({
          user_id: "",
          name: "",
          gender: "",
          date_of_birth: "",
          height: "",
          weight: "",
          interest: "",
        });

      expect(response.status).toBe(422);
      expect(response.body.message).toBeDefined();
    });

    it("should be updated the profile", async () => {
      await testService.deleteUser();
      const currentUser = await testService.createUserWithProfile();

      const user = currentUser.userFirst;
      const token = currentUser.token;

      const response = await request(app.getHttpServer())
        .put("/api/updateProfile/" + user._id)
        .set("Authorization", `Bearer ${token}`)
        .send({
          user_id: user._id,
          name: "Testing 123",
          gender: "Male",
          date_of_birth: "1998-09-12",
          height: "176",
          weight: "100",
          interest: ["Playing games"],
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });
});
