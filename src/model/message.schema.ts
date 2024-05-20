import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from "uuid";

import toJSON from "../helper/to.json";

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
})
export class Message {
  @Prop({ type: String, required: true, default: () => uuidv4() })
  _id: string;

  @Prop({ type: String, required: false, default: null })
  sender_id: string;

  @Prop({ type: String, required: false, default: null })
  receiver_id: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({
    type: String,
    required: false,
    ref: "User",
  })
  sender: string;

  @Prop({
    type: String,
    required: false,
    ref: "User",
  })
  receiver: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message).plugin(toJSON);
