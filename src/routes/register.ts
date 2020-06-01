import { Router, Request, Response } from "express";
import { genSalt, hash } from "bcryptjs";
import { check, validationResult } from "express-validator";
import { createTransport } from "nodemailer";
import { sign } from "jsonwebtoken";
import User, { IUser } from "../model/user-model";
import userController from "../controllers/user-controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.render("register", {
    title: "Sign Up",
    success: req.session.success,
    errors: req.session.errors
  });

  req.session.errors = null;
  req.session.success = false;
});

interface ICustomReq extends Request {
  body: IUser;
}

router.post(
  "/",
  [
    check("username").exists().isLength({ min: 3 }),
    check("email").exists().isEmail().normalizeEmail(),
    check("password").exists().isLength({ min: 8 }),
    check("confirm").exists().equals("password")
  ],
  async (req: ICustomReq, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.errors = errors;
        req.session.success = false;
        return res.redirect("/register");
      }

      const user = await User.findOne({ email: req.body.email });
      if (user) {
        req.session.errors = { message: "Email is taken" };
        req.session.success = false;
        return res.redirect("/register");
      }
      req.session.success = true;

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
        {
          expiresIn: "24h"
        },
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

      res.redirect("/register");
    } catch (err) {
      console.log(err);
      res.redirect("/register");
    }
  }
);

export default router;
