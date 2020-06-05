import { Router, Response } from "express";
import { checkAuthenticated } from "./middleware/auth";

const router = Router();

router.get("/", checkAuthenticated, (_, res: Response) => {
  res.render("home", { title: "Home Page" });
});

export default router;
