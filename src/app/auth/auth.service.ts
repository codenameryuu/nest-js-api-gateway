import { Headers, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { DateTime } from "luxon";
import { Model } from "mongoose";

import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

import { GET_DATA_SUCCESS, SAVE_DATA_SUCCESS } from "../../common/message";

import { User } from "../../model/user.schema";
import { Token } from "../../model/token.schema";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Token.name)
    private tokenModel: Model<Token>,
    private jwtService: JwtService
  ) {}

  async register(request: RegisterDto): Promise<any> {
    const password = await bcrypt.hash(request.password, 10);

    const user = await this.userModel.create({
      email: request.email,
      username: request.username,
      password: password,
    });

    const uniqueKey = DateTime.now().toFormat("yyyyLLddhhmmss") + Math.random().toString(36).slice(2, 17);
    const token = await this.jwtService.signAsync({ id: user._id, uniqueKey: uniqueKey });

    await this.tokenModel.create({
      user_id: user._id,
      token: token,
      unique_key: uniqueKey,
    });

    const data = await this.userModel.findById(user._id);

    const result = {
      status: true,
      message: SAVE_DATA_SUCCESS,
      data: data,
      token: token,
    };

    return result;
  }

  async login(request: LoginDto): Promise<any> {
    let user: any;

    const checkEmail = await this.userModel.findOne({ email: request.email_or_username }).populate("profile");
    const checkUsername = await this.userModel.findOne({ username: request.email_or_username }).populate("profile");

    if (checkEmail) {
      user = checkEmail;
    } else {
      user = checkUsername;
    }

    const uniqueKey = DateTime.now().toFormat("yyyyLLddhhmmss") + Math.random().toString(36).slice(2, 17);
    const token = await this.jwtService.signAsync({ id: user._id, uniqueKey: uniqueKey });

    await this.tokenModel.create({
      user_id: user._id,
      token: token,
      unique_key: uniqueKey,
    });

    const result = {
      status: true,
      message: GET_DATA_SUCCESS,
      data: user,
      token: token,
    };

    return result;
  }

  async logout(@Headers("Authorization") auth: string): Promise<any> {
    const token = auth.replace("Bearer ", "");

    await this.tokenModel.deleteOne({ token: token });

    const result = {
      status: true,
      message: "Logout successfully !",
    };

    return result;
  }
}
