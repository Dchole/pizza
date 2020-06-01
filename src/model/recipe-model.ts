import { Schema, model, Document } from "mongoose";

export interface IRecipe extends Document {
  recipe: string;
  price: number;
  description: string;
  soldTo: string[];
}

const RecipeSchema: Schema = new Schema(
  {
    recipe: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
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

export default model<IRecipe>("Recipe", RecipeSchema);
