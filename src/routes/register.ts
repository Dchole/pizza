import { Router, Request, Response } from "express";
import { genSalt, hash } from "bcryptjs";
import { check, validationResult } from "express-validator";
import { createTransport } from "nodemailer";
import { sign } from "jsonwebtoken";
import User, { IUser } from "../model/user-model";
import userController from "../controllers/user-controller";
import { checkNotAuthenticated } from "./middleware/auth";

const router = Router();

router.get("/", (_, res: Response) => {
  res.render("register", { title: "Sign Up" });
});

interface ICustomReq extends Request {
  body: IUser;
}

router.post(
  "/",
  [
    check("username", "Username is too short").exists().isLength({ min: 3 }),
    check("email", "Invalid Email Address").exists().isEmail().normalizeEmail(),
    check("password", "Password is too weak").exists().isLength({ min: 8 }),
    check("confirm", "Passwords do not match").exists().equals("password")
  ],
  checkNotAuthenticated,
  async (req: ICustomReq, res: Response) => {
    try {
      const result = validationResult(req);

      const errors = result.array().map(error => error.msg);

      if (!result.isEmpty()) {
        return res.render("register", { errors });
      }

      const user = await User.findOne({ email: req.body.email });
      if (user) {
        errors.push("Email is taken");
        return res.render("register", { errors });
      }

      const salt = await genSalt(10);
      const hashedPassword = await hash(req.body.password, salt);

      const newUser = await userController.CreateUser({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
      });

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
        { userId: newUser._id },
        process.env.TOKEN_SECRET,
        { expiresIn: "24h" },
        async (err, token) => {
          if (err) throw err;

          const URL = `http://${req.headers.host}/confirm/${token}`;

          transporter
            .sendMail({
              from: process.env.EMAIL,
              to: req.body.email,
              subject: "Confirm Email",
              html: `<h5>Your account has been successfully registered.</h5>
              <p>Please click on the link below to confirm your email</h3>
              <br />
              <a href=${URL}>${URL}</a>`
            })
            .catch((err: Error) => console.log(err));
        }
      );

      req.flash(
        "success",
        "Confirmation link has been sent to your email, please confirm before login"
      );
      res.redirect("/login");
    } catch (err) {
      console.log(err);
      res.redirect("/register");
    }
  }
);

export default router;
