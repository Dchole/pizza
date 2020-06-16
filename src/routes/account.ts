import { Router, Response, Request } from "express";
import { checkAuthenticated } from "./middleware/auth";
import User from "../model/user-model";

const router = Router();

router.get("/", checkAuthenticated, (req: Request, res: Response) => {
  res.render("account", { title: "Account", user: req.user });
});

router.put("/", checkAuthenticated, async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.user?._id, {
      fullName: req.body.fullName,
      email: req.body.email,
      telNo: req.body.telNo
    });

    res.sendStatus(302);
  } catch (err) {
    res.sendStatus(500);
  }
});

export default router;
