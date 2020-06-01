import NewsLetter, { INewsLetter } from "../model/newsletter-model";

interface ICreateNewsLetterInput {
  email: INewsLetter["email"];
}

async function CreateNewsLetter({
  email
}: ICreateNewsLetterInput): Promise<INewsLetter> {
  return NewsLetter.create({
    email
  })
    .then((data: INewsLetter) => data)
    .catch((error: Error) => {
      throw error;
    });
}

export default { CreateNewsLetter };
