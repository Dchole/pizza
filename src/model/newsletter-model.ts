import { Schema, model, Document } from "mongoose";

export interface INewsLetter extends Document {
  email: string;
}

const NewsLetterSchema: Schema = new Schema(
  { email: String },
  { timestamps: true }
);

export default model<INewsLetter>("NewsLetter", NewsLetterSchema);
