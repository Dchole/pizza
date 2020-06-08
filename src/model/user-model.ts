import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmed: boolean;
  cart: string[] | never[];
  transactions: string[] | never[];
  admin: boolean;
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
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
