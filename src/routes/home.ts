import { Router, Response, Request } from "express";
import { checkAuthenticated } from "./middleware/auth";
import Recipe from "../model/recipe-model";

const router = Router();

router.get("/", checkAuthenticated, async (req: Request, res: Response) => {
  const pizza = (await Recipe.find()).reverse();

  res.render("home", { title: "Home Page", pizza, cart: req.user?.cart });
});

export default router;
