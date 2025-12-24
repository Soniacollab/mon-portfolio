// src/models/Message.ts
// message (id, name, email, content, created_at)
import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  content: string;
  created_at: Date;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IMessage>("Message", MessageSchema);
