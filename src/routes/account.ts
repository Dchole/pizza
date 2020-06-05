import { Router, Response, Request } from "express";
import { checkAuthenticated } from "./middleware/auth";

const router = Router();

router.get("/", checkAuthenticated, (_, res: Response) => {
  res.render("account", { title: "Account" });
});

export default router;
