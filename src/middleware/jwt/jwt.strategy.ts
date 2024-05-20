import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from "../../model/user.schema";
import { Token } from "../../model/token.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Token.name)
    private tokenModel: Model<Token>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(request: any) {
    const user = await this.userModel.findById(request.id);
    const token = await this.tokenModel.findOne({ unique_key: request.uniqueKey });

    if (!user || !token) {
      const message = "Unauthenticated !";

      throw new HttpException(
        {
          status: false,
          message: message,
        },
        401
      );
    }

    return user;
  }
}
