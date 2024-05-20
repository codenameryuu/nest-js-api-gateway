import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NestjsFormDataModule } from "nestjs-form-data";

import { ProfileController } from "./profile.controller";
import { ProfileValidation } from "./profile.validation";
import { ProfileService } from "./profile.service";

import { AuthModule } from "../auth/auth.module";

import { FileHelper } from "../../helper/file.helper";

import { UserSchema } from "../../model/user.schema";
import { ProfileSchema } from "../../model/profile.schema";

import { FormatResponse } from "../../trait/format-response";

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Profile", schema: ProfileSchema },
    ]),
    NestjsFormDataModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileValidation, ProfileService, FileHelper, FormatResponse],
})
export class ProfileModule {}
