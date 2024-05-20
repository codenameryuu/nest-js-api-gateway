import { Body, Controller, Headers, HttpCode, Post, UseGuards } from "@nestjs/common";
import { FormDataRequest } from "nestjs-form-data";

import { AuthValidation } from "./auth.validation";
import { AuthService } from "./auth.service";

import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

import { JwtAuthGuard } from "../../middleware/jwt/jwt.guard";

import { FormatResponse } from "../../trait/format-response";

@Controller("api")
export class AuthController {
  constructor(private authValidation: AuthValidation, private authService: AuthService, private formatResponse: FormatResponse) {}

  @Post("register")
  @HttpCode(200)
  @FormDataRequest()
  async register(@Body() request: RegisterDto): Promise<any> {
    const validation = await this.authValidation.register(request);

    if (!validation.status) {
      return this.formatResponse.sendResponse(validation);
    }

    const result = await this.authService.register(request);

    return this.formatResponse.sendResponse(result);
  }

  @Post("login")
  @HttpCode(200)
  @FormDataRequest()
  async login(@Body() request: LoginDto): Promise<any> {
    const validation = await this.authValidation.login(request);

    if (!validation.status) {
      return this.formatResponse.sendResponse(validation);
    }

    const result = await this.authService.login(request);

    return this.formatResponse.sendResponse(result);
  }

  @Post("logout")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async logout(@Headers("Authorization") auth: string): Promise<any> {
    const result = await this.authService.logout(auth);

    return this.formatResponse.sendResponse(result);
  }
}
