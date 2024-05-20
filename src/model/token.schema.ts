import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from "uuid";

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
})
export class Token {
  @Prop({ type: String, required: false, default: () => uuidv4() })
  _id: string;

  @Prop({ type: String, required: false })
  user_id: string;

  @Prop({ type: String, required: false })
  token: string;

  @Prop({ type: String, required: false })
  unique_key: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token).set("toJSON", {
  transform: function (doc, ret, opt) {
    delete ret["__v"];
    return ret;
  },
});
