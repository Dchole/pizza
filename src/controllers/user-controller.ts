import User, { IUser } from "../model/user-model";
import { Strategy as LocalStragedy } from "passport-local";
import { compare } from "bcryptjs";
import { PassportStatic } from "passport";

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

function passportLocal(passport: PassportStatic) {
  passport.use(
    new LocalStragedy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, { message: "Email is not registered" });
          }

          if (!user.confirmed)
            return done(null, false, {
              message: "Please confirm email before login"
            });

          compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) return done(null, user);
            else return done(null, false, { message: "Password incorrect" });
          });
        })
        .catch((err: Error) => console.log(err));
    })
  );

  passport.serializeUser((user: IUser, done) => done(null, user._id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
}

export default { CreateUser, passportLocal };
