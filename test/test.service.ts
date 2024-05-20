import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { User } from "../src/model/user.schema";
import { Token } from "../src/model/token.schema";
import { Profile } from "../src/model/profile.schema";
import { Message } from "../src/model/message.schema";
import { DateTime } from "luxon";

@Injectable()
export class TestService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Token.name)
    private tokenModel: Model<Token>,
    @InjectModel(Profile.name)
    private profileModel: Model<Profile>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private jwtService: JwtService
  ) {}

  async getCurrentUser() {
    const email = "test@gmail.com";
    const emailSecond = "test2@gmail.com";

    const userFirst = await this.userModel.findOne({ email: email });
    const userSecond = await this.userModel.findOne({ email: emailSecond });

    const uniqueKey = DateTime.now().toFormat("yyyyLLddhhmmss") + Math.random().toString(36).slice(2, 17);
    const token = await this.jwtService.signAsync({ id: userFirst._id, uniqueKey: uniqueKey });

    await this.tokenModel.create({
      user_id: userFirst._id,
      token: token,
      unique_key: uniqueKey,
    });

    const result = {
      status: true,
      userFirst: userFirst,
      userSecond: userSecond,
      token: token,
    };

    return result;
  }

  async createUser() {
    const email = "test@gmail.com";
    const username = "test";
    const password = await bcrypt.hash("test", 10);

    const emailSecond = "test2@gmail.com";
    const usernameSecond = "test2";
    const passwordSecond = await bcrypt.hash("test2", 10);

    const userFirst = await this.userModel.create({ email: email, username: username, password: password });
    const userSecond = await this.userModel.create({ email: emailSecond, username: usernameSecond, password: passwordSecond });

    const uniqueKey = DateTime.now().toFormat("yyyyLLddhhmmss") + Math.random().toString(36).slice(2, 17);
    const token = await this.jwtService.signAsync({ id: userFirst._id, uniqueKey: uniqueKey });

    await this.tokenModel.create({
      user_id: userFirst._id,
      token: token,
      unique_key: uniqueKey,
    });

    const result = {
      status: true,
      userFirst: userFirst,
      userSecond: userSecond,
      token: token,
    };

    return result;
  }

  async createUserWithProfile() {
    const email = "test@gmail.com";
    const username = "test";
    const password = await bcrypt.hash("test", 10);

    const emailSecond = "test2@gmail.com";
    const usernameSecond = "test2";
    const passwordSecond = await bcrypt.hash("test2", 10);

    const userFirst = await this.userModel.create({ email: email, username: username, password: password });
    const userSecond = await this.userModel.create({ email: emailSecond, username: usernameSecond, password: passwordSecond });

    const profileFirst = await this.profileModel.create({
      name: "Test",
      gender: "Male",
      date_of_birth: "1998-09-12",
      height: "176",
      weight: "100",
      interest: ["Playing games"],
    });

    userFirst.profile_id = profileFirst._id;
    await userFirst.save();

    const profileSecond = await this.profileModel.create({
      name: "Test 2",
      gender: "Male",
      date_of_birth: "1998-09-12",
      height: "176",
      weight: "100",
      interest: ["Playing games"],
    });

    userSecond.profile_id = profileSecond._id;
    await userSecond.save();

    const uniqueKey = DateTime.now().toFormat("yyyyLLddhhmmss") + Math.random().toString(36).slice(2, 17);
    const token = await this.jwtService.signAsync({ id: userFirst._id, uniqueKey: uniqueKey });

    await this.tokenModel.create({
      user_id: userFirst._id,
      token: token,
      unique_key: uniqueKey,
    });

    const result = {
      status: true,
      userFirst: userFirst,
      userSecond: userSecond,
      token: token,
    };

    return result;
  }

  async deleteUser() {
    const email = "test@gmail.com";
    const emailSecond = "test2@gmail.com";

    const userFirst = await this.userModel.findOne({ email: email });
    const userSecond = await this.userModel.findOne({ email: emailSecond });

    if (userFirst) {
      await this.tokenModel.deleteMany({ user_id: userFirst._id });

      if (userFirst.profile_id) {
        await this.profileModel.deleteOne({ _id: userFirst.profile_id });
      }

      await this.userModel.deleteOne({ _id: userFirst._id });
    }

    if (userSecond) {
      await this.tokenModel.deleteMany({ user_id: userSecond._id });

      if (userSecond.profile_id) {
        await this.profileModel.deleteOne({ _id: userSecond.profile_id });
      }

      await this.userModel.deleteOne({ _id: userSecond._id });
    }
  }
}
