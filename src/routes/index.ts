import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { IUser } from "../model/user-model";
import newsletterController from "../controllers/newsletter-controller";

const router = Router();

router.get("/", (req: Request, res) => {
  if (req.isAuthenticated()) {
    return res.render("home", { title: "Home Page" });
  }

  res.render("index", { title: "Welcome to our store" });
});

interface ICustomReq extends Request {
  body: IUser;
}

router.post(
  "/",
  [check("email").exists().isEmail()],
  async (req: ICustomReq, res: Response) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty())
        await newsletterController.CreateNewsLetter({ email: req.body.email });

      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  }
);

export default router;
