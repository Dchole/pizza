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
    req.session.success = true;

    res.redirect("/login");
  } catch (err) {
    req.session.errors = err.message;
    res.redirect("/login");
  }
});

export default router;
