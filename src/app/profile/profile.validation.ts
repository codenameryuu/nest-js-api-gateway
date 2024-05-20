import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

import { GENDER } from "../../common/constant";
import { VALIDATION_SUCCESS } from "../../common/message";

import { FileHelper } from "../../helper/file.helper";

import { Joi } from "../../library/joi/joi.validation";

import { User } from "../../model/user.schema";

@Injectable()
export class ProfileValidation {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private fileHelper: FileHelper
  ) {}

  async getProfile(userId: string): Promise<any> {
    let result = {
      status: true,
      message: VALIDATION_SUCCESS,
    };

    // * Check user id is exist
    const user = await this.userModel.findById(userId);

    if (!user) {
      result.status = false;
      result.message = "User ID not found !";
      return result;
    }

    // * Check profile is exist
    if (!user.profile_id) {
      result.status = false;
      result.message = "Profile not found !";
      return result;
    }

    return result;
  }

  async createProfile(request: CreateProfileDto): Promise<any> {
    let result = {
      status: true,
      message: VALIDATION_SUCCESS,
    };

    const schema = Joi.object({
      user_id: Joi.string().required().messages({
        "string.base": "User ID must be string !",
        "string.empty": "User ID is required !",
        "any.required": "User ID is required !",
      }),

      name: Joi.string().required().messages({
        "string.base": "Name must be string !",
        "string.empty": "Name is required !",
        "any.required": "Name is required !",
      }),

      gender: Joi.string()
        .valid(...GENDER)
        .required()
        .messages({
          "string.base": "Gender must be string !",
          "string.empty": "Gender is required !",
          "any.required": "Gender is required !",
          "any.only": "Gender must be one Male or Female !",
        }),

      date_of_birth: Joi.date().format("YYYY-MM-DD").required().messages({
        "date.base": "Birthdate must be date !",
        "date.empty": "Birthdate is required !",
        "any.required": "Birthdate is required !",
        "date.format": "Birthdate must be in YYYY-MM-DD format !",
      }),

      height: Joi.number().required().messages({
        "number.base": "Height must be number !",
        "number.empty": "Height is required !",
        "any.required": "Height is required !",
      }),

      weight: Joi.number().required().messages({
        "number.base": "Weight must be number !",
        "number.empty": "Weight is required !",
        "any.required": "Weight is required !",
      }),

      interest: Joi.array().items(Joi.string()).required().messages({
        "array.base": "Interest must be array !",
        "string.empty": "Interest is required !",
        "any.required": "Interest is required !",
      }),
    });

    const validate = {
      user_id: request.user_id,
      name: request.name,
      gender: request.gender,
      date_of_birth: request.date_of_birth,
      height: request.height,
      weight: request.weight,
      interest: request.interest,
    };

    try {
      await schema.validateAsync(validate);
    } catch (error) {
      result.status = false;
      result.message = error.details[0].message.replace(/("|\[\d\])/g, "");
      return result;
    }

    // * Check user id is exist
    const user = await this.userModel.findById(request.user_id);

    if (!user) {
      result.status = false;
      result.message = "User ID not found !";
      return result;
    }

    // * Check profile is exist
    if (user.profile_id) {
      result.status = false;
      result.message = "Profile already created !";
      return result;
    }

    // * Check image is exist
    if (request.image) {
      const isValidImage = await this.fileHelper.isValidImage(request.image);

      if (!isValidImage) {
        result.status = false;
        result.message = "Image must be jpg, jpeg or png format !";
        return result;
      }
    }

    return result;
  }

  async updateProfile(request: UpdateProfileDto): Promise<any> {
    let result = {
      status: true,
      message: VALIDATION_SUCCESS,
    };

    const schema = Joi.object({
      user_id: Joi.string().required().messages({
        "string.base": "User ID must be string !",
        "string.empty": "User ID is required !",
        "any.required": "User ID is required !",
      }),

      name: Joi.string().required().messages({
        "string.base": "Name must be string !",
        "string.empty": "Name is required !",
        "any.required": "Name is required !",
      }),

      gender: Joi.string()
        .valid(...GENDER)
        .required()
        .messages({
          "string.base": "Gender must be string !",
          "string.empty": "Gender is required !",
          "any.required": "Gender is required !",
          "any.only": "Gender must be one Male or Female !",
        }),

      date_of_birth: Joi.date().format("YYYY-MM-DD").required().messages({
        "date.base": "Birthdate must be date !",
        "date.empty": "Birthdate is required !",
        "any.required": "Birthdate is required !",
        "date.format": "Birthdate must be in YYYY-MM-DD format !",
      }),

      height: Joi.number().required().messages({
        "number.base": "Height must be number !",
        "number.empty": "Height is required !",
        "any.required": "Height is required !",
      }),

      weight: Joi.number().required().messages({
        "number.base": "Weight must be number !",
        "number.empty": "Weight is required !",
        "any.required": "Weight is required !",
      }),

      interest: Joi.array().items(Joi.string()).required().messages({
        "array.base": "Interest must be array !",
        "string.empty": "Interest is required !",
        "any.required": "Interest is required !",
      }),
    });

    const validate = {
      user_id: request.user_id,
      name: request.name,
      gender: request.gender,
      date_of_birth: request.date_of_birth,
      height: request.height,
      weight: request.weight,
      interest: request.interest,
    };

    try {
      await schema.validateAsync(validate);
    } catch (error) {
      result.status = false;
      result.message = error.details[0].message.replace(/("|\[\d\])/g, "");
      return result;
    }

    // * Check user id is exist
    const user = await this.userModel.findById(request.user_id);

    if (!user) {
      result.status = false;
      result.message = "User ID not found !";
      return result;
    }

    // * Check profile exist
    if (!user.profile_id) {
      result.status = false;
      result.message = "Profile not found !";
      return result;
    }

    // * Check image exist
    if (request.image) {
      const isValidImage = await this.fileHelper.isValidImage(request.image);

      if (!isValidImage) {
        result.status = false;
        result.message = "Image must be jpg, jpeg or png format !";
        return result;
      }
    }

    return result;
  }
}
