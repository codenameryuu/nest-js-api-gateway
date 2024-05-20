import { Module } from "@nestjs/common";
import { TestService } from "./test.service";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";

import { UserSchema } from "../src/model/user.schema";
import { TokenSchema } from "../src/model/token.schema";
import { ProfileSchema } from "../src/model/profile.schema";
import { MessageSchema } from "../src/model/message.schema";
import { JwtStrategy } from "../src/middleware/jwt/jwt.strategy";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Token", schema: TokenSchema },
      { name: "Profile", schema: ProfileSchema },
      { name: "Message", schema: MessageSchema },
    ]),
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
  providers: [TestService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class TestModule {}
