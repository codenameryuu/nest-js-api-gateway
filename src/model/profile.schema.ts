import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from "uuid";

import { GENDER } from "../common/constant";

import toJSON from "../helper/to.json";

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
})
export class Profile {
  @Prop({ type: String, required: false, default: () => uuidv4() })
  _id: string;

  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: String, required: false, enum: GENDER })
  gender: string;

  @Prop({
    type: Date,
    required: false,
  })
  date_of_birth: Date;

  @Prop({ type: String, required: false })
  horoscope: string;

  @Prop({ type: String, required: false })
  zodiac: string;

  @Prop({ type: Number, required: false, default: 0 })
  height: number;

  @Prop({ type: Number, required: false, default: 0 })
  weight: number;

  @Prop({ type: [String], required: false })
  interest: [string];

  @Prop({ type: String, required: false })
  image: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile).plugin(toJSON);
