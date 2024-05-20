import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { ViewMessageDto } from "./dto/view.message.dto";
import { SendMessageDto } from "./dto/send.message.dto";

import { VALIDATION_SUCCESS } from "../../common/message";

import { Joi } from "../../library/joi/joi.validation";

import { Message } from "../../model/message.schema";
import { User } from "../../model/user.schema";

@Injectable()
export class MessageValidation {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>
  ) {}

  async viewMessage(request: ViewMessageDto): Promise<any> {
    let result = {
      status: true,
      message: VALIDATION_SUCCESS,
    };

    const schema = Joi.object({
      page: Joi.number().min(1).required().messages({
        "number.base": "Page must be number !",
        "number.empty": "Page is required !",
        "any.required": "Page is required !",
        "number.min": "Page minimum value is 1 !",
      }),

      per_page: Joi.number().min(1).required().messages({
        "number.base": "Per page must be number !",
        "number.empty": "Per page is required !",
        "any.required": "Per page is required !",
        "number.min": "Per page minimum value is 1 !",
      }),

      sender_id: Joi.string().required().messages({
        "string.base": "Sender ID must be string !",
        "string.empty": "Sender ID is required !",
        "any.required": "Sender ID is required !",
      }),

      receiver_id: Joi.string().required().messages({
        "string.base": "Receiver ID must be string !",
        "string.empty": "Receiver ID is required !",
        "any.required": "Receiver ID is required !",
      }),
    });

    const validate = {
      page: request.page,
      per_page: request.per_page,
      sender_id: request.sender_id,
      receiver_id: request.receiver_id,
    };

    try {
      await schema.validateAsync(validate);
    } catch (error) {
      result.status = false;
      result.message = error.details[0].message.replace(/("|\[\d\])/g, "");
      return result;
    }

    // * Check sender id is exist
    const sender = await this.userModel.findById(request.sender_id);

    if (!sender) {
      result.status = false;
      result.message = "Sender ID not found !";
      return result;
    }

    // * Check sender profile is exist
    if (!sender.profile_id) {
      result.status = false;
      result.message = "Sender profile not found !";
      return result;
    }

    // * Check receiver id is exist
    const receiver = await this.userModel.findById(request.receiver_id);

    if (!receiver) {
      result.status = false;
      result.message = "Receiver ID not found !";
      return result;
    }

    // * Check receiver profile is exist
    if (!receiver.profile_id) {
      result.status = false;
      result.message = "Receiver profile not found !";
      return result;
    }

    return result;
  }

  async sendMessage(request: SendMessageDto): Promise<any> {
    let result = {
      status: true,
      message: VALIDATION_SUCCESS,
    };

    const schema = Joi.object({
      sender_id: Joi.string().required().messages({
        "string.base": "Sender ID must be string !",
        "string.empty": "Sender ID is required !",
        "any.required": "Sender ID is required !",
      }),

      receiver_id: Joi.string().required().messages({
        "string.base": "Receiver ID must be string !",
        "string.empty": "Receiver ID is required !",
        "any.required": "Receiver ID is required !",
      }),

      message: Joi.string().required().messages({
        "string.base": "Message must be string !",
        "string.empty": "Message is required !",
        "any.required": "Message is required !",
      }),
    });

    const validate = {
      sender_id: request.sender_id,
      receiver_id: request.receiver_id,
      message: request.message,
    };

    try {
      await schema.validateAsync(validate);
    } catch (error) {
      result.status = false;
      result.message = error.details[0].message.replace(/("|\[\d\])/g, "");
      return result;
    }

    // * Check sender id is exist
    const sender = await this.userModel.findById(request.sender_id);

    if (!sender) {
      result.status = false;
      result.message = "Sender ID not found !";
      return result;
    }

    // * Check profile sender is exist
    if (!sender.profile_id) {
      result.status = false;
      result.message = "Sender profile not found !";
      return result;
    }

    // * Check receiver id is exist
    const receiver = await this.userModel.findById(request.receiver_id);

    if (!receiver) {
      result.status = false;
      result.message = "Receiver ID not found !";
      return result;
    }

    // * Check receiver profile is exist
    if (!receiver.profile_id) {
      result.status = false;
      result.message = "Receiver profile not found !";
      return result;
    }

    return result;
  }
}
