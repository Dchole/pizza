import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  telNo: number;
  confirmed: boolean;
  cart: string[] | never[];
  transactions: string[] | never[];
  admin: boolean;
}

const UserSchema: Schema = new Schema(
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
    telNo: {
      type: Number,
      min: 10
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pizza"
      }
    ],
    transactions: [
      {
        type: Schema.Types.ObjectId
      }
    ],
    admin: {
      type: Schema.Types.Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema);
