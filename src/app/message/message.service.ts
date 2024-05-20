import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { ViewMessageDto } from "./dto/view.message.dto";
import { SendMessageDto } from "./dto/send.message.dto";

import { GET_DATA_SUCCESS, SAVE_DATA_SUCCESS } from "../../common/message";

import { Message } from "../../model/message.schema";
import { User } from "../../model/user.schema";

import { paginate } from "../../trait/paginate";

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    @Inject("NOTIFICATION_SERVICE") private readonly clinet: ClientProxy
  ) {}

  async viewMessage(request: ViewMessageDto): Promise<any> {
    const page = Number(request.page);
    const perPage = Number(request.per_page);

    const paginatedData = await paginate(
      this.messageModel
        .find({ $or: [{ sender_id: request.sender_id }, { receiver: request.sender_id }] })
        .sort("created_at")
        .populate(["sender", "receiver"]),
      { page: page, perPage: perPage }
    );

    const data = paginatedData.data;
    const pagination = paginatedData.metadata;

    const result = {
      status: true,
      message: GET_DATA_SUCCESS,
      data: data,
      pagination: pagination,
    };

    return result;
  }

  async sendMessage(request: SendMessageDto): Promise<any> {
    const message = await this.messageModel.create({
      sender_id: request.sender_id,
      receiver_id: request.receiver_id,
      message: request.message,
      sender: request.sender_id,
      receiver: request.receiver_id,
    });

    const data = await this.messageModel.findById(message._id).populate(["sender", "receiver"]);
    this.clinet.emit("send_message", data);

    const result = {
      status: true,
      message: SAVE_DATA_SUCCESS,
      data: data,
    };

    return result;
  }
}
