import { Schema, model, Document } from "mongoose";

export interface IPizza extends Document {
  name: string;
  price: number;
  image: string;
  description: string;
  soldTo: string[];
}

const PizzaSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: String,
    description: String,
    soldTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

export default model<IPizza>("Pizza", PizzaSchema);
