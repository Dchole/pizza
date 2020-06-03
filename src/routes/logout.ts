import { Router, Request, Response } from "express";

const router = Router();

router.get("/logout", (req: Request, res: Response) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

export default router;
