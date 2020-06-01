import { Router, Request, Response } from "express";
import { genSalt, hash } from "bcryptjs";
import { check, validationResult } from "express-validator";
import User from "../model/user-model";
import nodemailer from "nodemailer";
import userController from "../controllers/user-controller";

const router = Router();

router.get("/", (_, res: Response) => {
  res.render("register", { title: "Sign Up" });
});

router.post(
  "/",
  [
    check("username").exists().isLength({ min: 3 }),
    check("email").exists().isEmail(),
    check("password").exists().isLength({ min: 8 })
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const userExist = await User.findOne({ email: req.body.email });
      if (userExist) return res.status(400).send("Email is already taken");

      const salt = await genSalt(10);
      const hashedPassword = await hash(req.body.password, salt);

      await userController.CreateUser({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
      });

      res.redirect("/register");
    } catch (err) {
      res.redirect("/register");
      console.log(err);
    }
  }
);

export default router;
