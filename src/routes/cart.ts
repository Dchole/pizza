import { Router, Response } from "express";
import { checkAuthenticated } from "./middleware/auth";

const router = Router();

router.get("/", checkAuthenticated, (_, res: Response) => {
  res.render("cart", { title: "Shopping Cart" });
});

export default router;
