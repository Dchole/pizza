import { Router, Request, Response } from "express";
import { genSalt, hash } from "bcryptjs";
import { check, validationResult } from "express-validator";
import { checkNotAuthenticated } from "./middleware/auth";
import User, { IUser } from "../model/user-model";
import userController from "../controllers/user-controller";

const router = Router();

router.get("/", checkNotAuthenticated, (_, res: Response) => {
  res.render("register", { title: "Sign Up" });
});

interface ICustomReq extends Request {
  body: IUser;
}

router.post(
  "/",
  [
    check("firstName", "Field is required").exists(),
    check("lastName", "Field is required").exists(),
    check("email", "Invalid Email Address").exists().isEmail().normalizeEmail(),
    check("password", "Password is too weak").exists().isLength({ min: 8 }),
    check("confirm", "Passwords do not match").exists().equals("password")
  ],
  async (req: ICustomReq, res: Response) => {
    try {
      const result = validationResult(req);
      const errors = result.array().map(error => error.msg);

      if (!result.isEmpty()) {
        return res.render("register", { title: "register", errors });
      }

      const user = await User.findOne({ email: req.body.email });
      if (user) {
        errors.push("Email is taken");
        return res.render("register", { title: "register", errors });
      }

      const salt = await genSalt(10);
      const hashedPassword = await hash(req.body.password, salt);

      const newUser = await userController.CreateUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
      });

      req.session.user = newUser;

      userController.sendMail(req.hostname, newUser._id, req.body.email);

      req.flash(
        "success",
        "Confirmation link has been sent to your email, please confirm before login"
      );
      res.redirect("/confirm");
    } catch (err) {
      res.redirect("/register");
    }
  }
);

export default router;
