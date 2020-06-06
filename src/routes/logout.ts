import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

export default router;
