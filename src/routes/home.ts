import { Router, Response, Request } from "express";
import { checkAuthenticated } from "./middleware/auth";

const router = Router();

router.get("/", checkAuthenticated, (req: Request, res: Response) => {
  res.render("home", { title: "Home Page" });
});

export default router;
