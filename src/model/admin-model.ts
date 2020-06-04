import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document {
  fullName: string;
  email: string;
  password: string;
}

const AdminSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      min: 3,
      required: true,
      unique: true
    },
    password: {
      type: String,
      min: 8,
      required: true
    },
    admin: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default model<IAdmin>("Admin", AdminSchema);
