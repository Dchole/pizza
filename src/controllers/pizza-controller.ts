import Pizza, { IPizza } from "../model/pizza-model";

interface ICreatePizzaInput {
  name: IPizza["name"];
  price: IPizza["price"];
  image: IPizza["image"];
  description: IPizza["description"];
}

async function CreatePizza({
  name,
  price,
  image,
  description
}: ICreatePizzaInput): Promise<IPizza> {
  return Pizza.create({
    name,
    price,
    image,
    description
  })
    .then((data: IPizza) => data)
    .catch((error: Error) => {
      throw error;
    });
}

export default { CreatePizza };
