import { Router, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import User from "../model/user-model";

const router = Router();

interface IVerify {
  userId: string;
}

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
