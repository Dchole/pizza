declare namespace Express {
  interface Request {
    user?: import("./src/model/user-model").IUser;
  }
}
