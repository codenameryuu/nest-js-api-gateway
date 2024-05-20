import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from "uuid";

import toJSON from "../helper/to.json";

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
})
export class User {
  @Prop({ type: String, required: false, default: () => uuidv4() })
  _id: string;

  @Prop({ type: String, required: false, default: null })
  profile_id: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    required: false,
    ref: "Profile",
  })
  profile: string;
}

export const UserSchema = SchemaFactory.createForClass(User).plugin(toJSON);
