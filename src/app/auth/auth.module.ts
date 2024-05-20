import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { NestjsFormDataModule } from "nestjs-form-data";

import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import { AuthService } from "./auth.service";

import { JwtStrategy } from "../../middleware/jwt/jwt.strategy";

import { UserSchema } from "../../model/user.schema";
import { TokenSchema } from "../../model/token.schema";

import { FormatResponse } from "../../trait/format-response";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Token", schema: TokenSchema },
    ]),
    NestjsFormDataModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>("JWT_SECRET"),
          signOptions: {
            expiresIn: config.get<string | number>("JWT_EXPIRE"),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthValidation, AuthService, JwtStrategy, FormatResponse],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
