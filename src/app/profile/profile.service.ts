import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

import { GET_DATA_SUCCESS, SAVE_DATA_SUCCESS } from "../../common/message";

import { FileHelper } from "../../helper/file.helper";
import { horoscopeHelper } from "../../helper/horoscope.helper";
import { zodiacHelper } from "../../helper/zodiac.helper";

import { Profile } from "../../model/profile.schema";
import { User } from "../../model/user.schema";

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Profile.name)
    private profileModel: Model<Profile>,
    private fileHelper: FileHelper
  ) {}

  async getProfile(userId: string): Promise<any> {
    const user = await this.userModel.findById(userId);

    const data = await this.profileModel.findById(user.profile_id);

    const result = {
      status: true,
      message: GET_DATA_SUCCESS,
      data: data,
    };

    return result;
  }

  async createProfile(request: CreateProfileDto): Promise<any> {
    const horoscope = horoscopeHelper(request.date_of_birth);
    const zodiac = zodiacHelper(request.date_of_birth);

    let profilePayload: any = {
      name: request.name,
      gender: request.gender,
      date_of_birth: request.date_of_birth,
      height: request.height,
      weight: request.weight,
      interest: request.interest,
      horoscope: horoscope,
      zodiac: zodiac,
    };

    if (request.image) {
      profilePayload.image = await this.fileHelper.saveFile(request.image);
    }

    const profile = await this.profileModel.create(profilePayload);

    await this.userModel.findByIdAndUpdate(request.user_id, {
      profile_id: profile._id,
      profile: profile._id,
    });

    const data = await this.profileModel.findById(profile._id);

    const result = {
      status: true,
      message: SAVE_DATA_SUCCESS,
      data: data,
    };

    return result;
  }

  async updateProfile(request: UpdateProfileDto): Promise<any> {
    const user = await this.userModel.findById(request.user_id);
    const profile = await this.profileModel.findById(user.profile_id);

    const horoscope = horoscopeHelper(request.date_of_birth);
    const zodiac = zodiacHelper(request.date_of_birth);

    let profilePayload: any = {
      name: request.name,
      gender: request.gender,
      date_of_birth: request.date_of_birth,
      height: request.height,
      weight: request.weight,
      interest: request.interest,
      horoscope: horoscope,
      zodiac: zodiac,
    };

    if (request.image) {
      if (profile.image) {
        await this.fileHelper.deleteFile(profile.image);
      }

      profilePayload.image = await this.fileHelper.saveFile(request.image);
    }

    await this.profileModel.where("_id", profile._id).updateOne(profilePayload);

    const data = await this.profileModel.findById(profile._id);

    const result = {
      status: true,
      message: SAVE_DATA_SUCCESS,
      data: data,
    };

    return result;
  }
}
