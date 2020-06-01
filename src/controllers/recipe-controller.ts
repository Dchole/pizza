import Recipe, { IRecipe } from "../model/recipe-model";

interface ICreateUser {
  recipe: IRecipe["recipe"];
  price: IRecipe["price"];
  description: IRecipe["description"];
  soldTo: IRecipe["soldTo"];
}

async function CreateRecipe({
  recipe,
  price,
  description,
  soldTo
}: ICreateUser): Promise<IRecipe> {
  return Recipe.create({
    recipe,
    price,
    description,
    soldTo
  })
    .then((data: IRecipe) => data)
    .catch((error: Error) => {
      throw error;
    });
}

export default { CreateRecipe };
