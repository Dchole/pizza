import { Router, Response, Request } from "express";
import { checkAuthenticated } from "./middleware/auth";

const router = Router();

router.get("/", checkAuthenticated, (req: Request, res: Response) => {
  res.render("account", { title: "Account", user: req.user });
});

export default router;
