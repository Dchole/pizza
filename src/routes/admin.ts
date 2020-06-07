import { Router, Request, Response, NextFunction } from "express";
import {
  checkNotAuthenticated,
  checkAuthenticated,
  checkAdmin
} from "./middleware/auth";
import { check, validationResult } from "express-validator";
import { IUser } from "../model/user-model";
import passport from "passport";

const router = Router();

router.get("/", (_, res: Response) => {
  res.redirect("/admin/login");
});

router.get("/dashboard", checkAuthenticated, (_, res: Response) => {
  res.render("adminDashboard", { title: "Admin Dashboard" });
});

router.get("/login", checkNotAuthenticated, (_, res: Response) => {
  res.render("adminLogin", { title: "Admin Login" });
});

interface ICustomReq extends Request {
  body: IUser;
}

router.post(
  "/login",
  [
    check("email", "Invalid Email Address").exists().isEmail(),
    check("password", "Password is too short").exists().isLength({ min: 8 })
  ],
  // checkAdmin,
  async (req: ICustomReq, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      const errors = result.array().map(error => error.msg);

      if (!result.isEmpty()) {
        return res.render("login", {
          title: "Admin Login",
          admin: true,
          errors
        });
      }

      const successRedirect = req.session.path
        ? req.session.path
        : "/admin/dashboard";

      passport.authenticate("local", {
        successRedirect,
        failureRedirect: "/admin/login",
        failureFlash: true
      })(req, res, next);
    } catch (err) {
      req.flash("error_msg", "Something went wrong! Please try again");
      res.redirect("/admin/login");
    }
  }
);

export default router;
