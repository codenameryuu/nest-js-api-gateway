import { Body, Controller, Get, HttpCode, Post, Query, UseGuards } from "@nestjs/common";
import { FormDataRequest } from "nestjs-form-data";

import { ViewMessageDto } from "./dto/view.message.dto";
import { SendMessageDto } from "./dto/send.message.dto";

import { MessageValidation } from "./message.validation";
import { MessageService } from "./message.service";

import { JwtAuthGuard } from "../../middleware/jwt/jwt.guard";

import { FormatResponse } from "../../trait/format-response";

@Controller("api")
export class MessageController {
  constructor(private messageValidation: MessageValidation, private messageService: MessageService, private formatResponse: FormatResponse) {}

  @Get("viewMessages")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async viewMessage(@Query() request: ViewMessageDto): Promise<any> {
    const validation = await this.messageValidation.viewMessage(request);

    if (!validation.status) {
      return this.formatResponse.sendResponse(validation);
    }

    const result = await this.messageService.viewMessage(request);

    return this.formatResponse.sendResponse(result);
  }

  @Post("sendMessage")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @FormDataRequest()
  async sendMessage(@Body() request: SendMessageDto): Promise<any> {
    const validation = await this.messageValidation.sendMessage(request);

    if (!validation.status) {
      return this.formatResponse.sendResponse(validation);
    }

    const result = await this.messageService.sendMessage(request);

    return this.formatResponse.sendResponse(result);
  }
}
