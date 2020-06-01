import User, { IUser } from "../model/user-model";

interface ICreateUserInput {
  username: IUser["username"];
  email: IUser["email"];
  password: IUser["password"];
}

async function CreateUser({
  username,
  email,
  password
}: ICreateUserInput): Promise<IUser> {
  return User.create({
    username,
    email,
    password
  })
    .then((data: IUser) => data)
    .catch((error: Error) => {
      throw error;
    });
}

export default { CreateUser };
