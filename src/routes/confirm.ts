import { Router, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import User from "../model/user-model";
import userController from "../controllers/user-controller";

const router = Router();

interface IVerify {
  userId: string;
}

router.get("/", (_, res: Response) => {
  return res.render("confirm", { title: "Confirm Email" });
});

router.get("/resend", (req: Request, res: Response) => {
  try {
    const user = req.session.user;
    userController.sendMail(req.hostname, user._id, user.email);

    req.flash("success", "Confirmation message has been resent");
    res.redirect("/login");
  } catch (err) {
    res.redirect("/login");
  }
});

router.get("/:token", async (req: Request, res: Response) => {
  try {
    const { userId } = verify(
      req.params.token,
      process.env.TOKEN_SECRET
    ) as IVerify;
    await User.findByIdAndUpdate(userId, { confirmed: true });

    req.flash(
      "success_msg",
      "Your email has been confirmed successfully. You can now login"
    );

    res.redirect("/login");
  } catch (err) {
    req.flash("error_msg", "Something went wrong, Please try again");
    res.redirect("/login");
  }
});

export default router;
