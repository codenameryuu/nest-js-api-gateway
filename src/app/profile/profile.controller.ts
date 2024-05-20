import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes } from "@nestjs/common";
import { FormDataRequest, MemoryStoredFile } from "nestjs-form-data";

import { ProfileValidation } from "./profile.validation";
import { ProfileService } from "./profile.service";

import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

import { JwtAuthGuard } from "../../middleware/jwt/jwt.guard";

import { FormatResponse } from "../../trait/format-response";

@Controller("api")
export class ProfileController {
  constructor(private profileValidation: ProfileValidation, private profileService: ProfileService, private formatResponse: FormatResponse) {}

  @Get("getProfile/:userId")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getProfile(@Param("userId") userId: string): Promise<any> {
    const validation = await this.profileValidation.getProfile(userId);

    if (!validation.status) {
      return this.formatResponse.sendResponse(validation);
    }

    const result = await this.profileService.getProfile(userId);

    return this.formatResponse.sendResponse(result);
  }

  @Post("createProfile")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @FormDataRequest({ storage: MemoryStoredFile })
  async createProfile(@Body() request: CreateProfileDto): Promise<any> {
    const validation = await this.profileValidation.createProfile(request);

    if (!validation.status) {
      return this.formatResponse.sendResponse(validation);
    }

    const result = await this.profileService.createProfile(request);

    return this.formatResponse.sendResponse(result);
  }

  @Put("updateProfile/:userId")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @FormDataRequest({ storage: MemoryStoredFile })
  async updateProfile(@Param("userId") userId: string, @Body() request: UpdateProfileDto): Promise<any> {
    request.user_id = userId;
    const validation = await this.profileValidation.updateProfile(request);

    if (!validation.status) {
      return this.formatResponse.sendResponse(validation);
    }

    const result = await this.profileService.updateProfile(request);

    return this.formatResponse.sendResponse(result);
  }
}
