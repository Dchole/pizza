import User, { IUser } from "../model/user-model";
import { Strategy as LocalStrategy } from "passport-local";
import { compare } from "bcryptjs";
import { PassportStatic } from "passport";
import { createTransport } from "nodemailer";
import { sign } from "jsonwebtoken";
import { Response } from "express";

interface ICreateUserInput {
  fullName: IUser["fullName"];
  email: IUser["email"];
  password: IUser["password"];
}

async function CreateUser({
  fullName,
  email,
  password
}: ICreateUserInput): Promise<IUser> {
  return User.create({
    fullName,
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
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await User.findOne({ email });
        if (!user)
          return done(null, false, { message: "Email is not registered" });

        if (!user.confirmed)
          return done(null, false, {
            message: "Please confirm email before login"
          });

        compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) return done(null, user);
          else return done(null, false, { message: "Password incorrect" });
        });
      }
    )
  );

  passport.serializeUser((user: IUser, done) => done(null, user._id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
}

function sendMail(hostname: string, id: string, email: string) {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  sign(
    { userId: id },
    process.env.TOKEN_SECRET,
    { expiresIn: "24h" },
    async (err, token) => {
      if (err) throw err;

      const URL = `http://${hostname}/confirm/${token}`;

      transporter
        .sendMail({
          from: `"Moshood's pizza 🍕" ${process.env.EMAIL}`,
          to: email,
          subject: "Confirm Email",
          html: `<h5>Your account has been successfully registered.</h5>
          <p>Please click on the link below to confirm your email</h3>
          <br />
          <a href=${URL}>${URL}</a>`
        })
        .catch((err: Error) => console.log(err));
    }
  );
}

async function sendOrderMsg(username: string, product: string) {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  await transporter.sendMail({
    from: `"Moshood's pizza 🍕" ${process.env.EMAIL}`,
    to: process.env.EMAIL,
    subject: `Order from ${username}.`,
    html: `<p>An order has been made by ${username} for <b>${product}</b> on ${new Date().toDateString()} at ${new Date().toLocaleTimeString()}</p>`
  });
}

export default { CreateUser, passportLocal, sendMail, sendOrderMsg };
