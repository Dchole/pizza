import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../model/user-model";

const router = Router();

router.get("/", (_, res: Response) => {
  res.render("login", { title: "Login" });
});

router.post(
  "/",
  [
    check("email").exists().isEmail(),
    check("password").exists().isLength({ min: 8 })
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session!.errors = errors;
        return res.redirect("/login");
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.session!.error = { message: "User does not exists" };
        res.redirect("/login");
      } else if (!user.confirmed) {
        req.session!.error = {
          message: "Please confirm your email before login"
        };
        res.redirect("/login");
      } else res.redirect("/home");
    } catch (err) {
      res.redirect("/login");
      console.log(err);
    }
  }
);

export default router;
