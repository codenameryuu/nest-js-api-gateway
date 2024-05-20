import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";

import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

import { VALIDATION_SUCCESS } from "../../common/message";

import { Joi } from "../../library/joi/joi.validation";

import { User } from "../../model/user.schema";

@Injectable()
export class AuthValidation {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async register(request: RegisterDto): Promise<any> {
    let result = {
      status: true,
      message: VALIDATION_SUCCESS,
    };

    const schema = Joi.object({
      email: Joi.string().required().email().messages({
        "string.base": "Email is required !",
        "string.empty": "Email is required !",
        "any.required": "Email is required !",
        "string.email": "Email is not valid !",
      }),

      username: Joi.string().required().messages({
        "string.base": "Username is required !",
        "string.empty": "Username is required !",
        "any.required": "Username is required !",
      }),

      password: Joi.string().required().messages({
        "string.base": "Password is required !",
        "string.empty": "Password is required !",
        "any.required": "Password is required !",
      }),

      password_confirmation: Joi.string().valid(Joi.ref("password")).required().messages({
        "string.base": "Password confirmation is required !",
        "string.empty": "Password confirmation is required !",
        "any.required": "Password confirmation is required !",
      }),
    });

    const validate = {
      email: request.email,
      username: request.username,
      password: request.password,
      password_confirmation: request.password_confirmation,
    };

    try {
      await schema.validateAsync(validate);
    } catch (error) {
      result.status = false;
      result.message = error.details[0].message.replace(/("|\[\d\])/g, "");
      return result;
    }

    // * Check email is already registered
    const checkEmail = await this.userModel.findOne({ email: request.email });

    if (checkEmail) {
      result.status = false;
      result.message = "Email is already registered !";
      return result;
    }

    // * Check username is already registered
    const checkUsername = await this.userModel.findOne({ username: request.username });

    if (checkUsername) {
      result.status = false;
      result.message = "Username is already registered !";
      return result;
    }

    return result;
  }

  async login(request: LoginDto): Promise<any> {
    let result = {
      status: true,
      message: VALIDATION_SUCCESS,
    };

    const schema = Joi.object({
      email_or_username: Joi.string().required().messages({
        "string.base": "Email or Username is required !",
        "string.empty": "Email or Username is required !",
        "any.required": "Email or Username is required !",
      }),

      password: Joi.string().required().messages({
        "string.base": "Password is required !",
        "string.empty": "Password is required !",
        "any.required": "Password is required !",
      }),
    });

    const validate = {
      email_or_username: request.email_or_username,
      password: request.password,
    };

    try {
      await schema.validateAsync(validate);
    } catch (error) {
      result.status = false;
      result.message = error.details[0].message.replace(/("|\[\d\])/g, "");
      return result;
    }

    let statusEmail = true;
    let statusUsername = true;
    let statusPassword = true;

    // * Check email is already registered
    const checkEmail = await this.userModel.findOne({ email: request.email_or_username });

    if (!checkEmail) {
      statusEmail = false;
    }

    // * Check username is already registered
    const checkUsername = await this.userModel.findOne({ username: request.email_or_username });

    if (!checkUsername) {
      statusUsername = false;
    }

    // * Confirm email or username is already registered
    if (!statusEmail && !statusUsername) {
      result.status = false;
      result.message = "Email or Username not registered !";
      return result;
    }

    // * Check password is match
    if (checkEmail) {
      statusPassword = await bcrypt.compare(request.password, checkEmail.password);
    } else {
      statusPassword = await bcrypt.compare(request.password, checkUsername.password);
    }

    if (!statusPassword) {
      result.status = false;
      result.message = "Incorrect password !";
      return result;
    }

    return result;
  }
}
