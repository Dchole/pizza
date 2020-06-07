import { Request, Response, NextFunction } from "express";
import User from "../../model/user-model";

export function checkAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.isAuthenticated()) {
      return next();
    }

    req.session.path = req.baseUrl;
    req.flash("error_msg", "Please login to view this page");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
}

export function checkNotAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.isAuthenticated()) {
      req.session.path
        ? res.redirect(`/${req.session.path}`)
        : res.redirect("/home");
    }

    return next();
  } catch (err) {
    console.log(err);
  }
}

export async function checkAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user?.admin) {
      next();
    }

    req.flash("error_msg", "You are Unauthorized to view the admin page");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
}
