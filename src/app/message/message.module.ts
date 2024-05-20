import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NestjsFormDataModule } from "nestjs-form-data";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { MessageController } from "./message.controller";
import { MessageValidation } from "./message.validation";
import { MessageService } from "./message.service";

import { AuthModule } from "../auth/auth.module";

import { MessageSchema } from "../../model/message.schema";
import { UserSchema } from "../../model/user.schema";

import { FormatResponse } from "../../trait/format-response";

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: "NOTIFICATION_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "notification_queue",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Message", schema: MessageSchema },
    ]),
    NestjsFormDataModule,
  ],
  controllers: [MessageController],
  providers: [MessageValidation, MessageService, FormatResponse],
})
export class MessageModule {}
