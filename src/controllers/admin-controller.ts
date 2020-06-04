import Admin, { IAdmin } from "../model/admin-model";

export async function createUser({ fullName, email, password }: IAdmin) {
  Admin.create({ fullName, email, password })
    .then((data: IAdmin) => data)
    .catch((err: Error) => {
      throw err;
    });
}
