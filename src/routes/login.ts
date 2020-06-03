import { Router, Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { IUser } from "../model/user-model";
import { checkNotAuthenticated } from "./middleware/auth";
import passport from "passport";

const router = Router();

router.get("/", (_, res: Response) => {
  res.render("login", { title: "Login" });
});

interface ICustomReq extends Request {
  body: IUser;
}

router.post(
  "/",
  [
    check("email", "Invalid Email Address").exists().isEmail(),
    check("password", "Password is too short").exists().isLength({ min: 8 })
  ],
  checkNotAuthenticated,
  async (req: ICustomReq, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      const errors = result.array().map(error => error.msg);

      if (!result.isEmpty()) {
        return res.render("login", { errors });
      }
      console.log("login", req.session.path);

      const successRedirect = req.session.path ? req.session.path : "/home";

      passport.authenticate("local", {
        successRedirect,
        failureRedirect: "/login",
        failureFlash: true
      })(req, res, next);
    } catch (err) {
      req.flash("error_msg", "Something went wrong! Please try again");
      res.redirect("/login");
    }
  }
);

export default router;
