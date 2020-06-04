import { Request, Response, NextFunction } from "express";

export function checkAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.session.path = req.baseUrl;
  req.flash("error_msg", "Please login to view this page");
  res.redirect("/login");
}

export function checkNotAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    res.redirect(`${req.baseUrl}`);
  }

  return next();
}
