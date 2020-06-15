import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { IUser } from "../model/user-model";
import newsletterController from "../controllers/newsletter-controller";
import Pizza from "../model/pizza-model";

const router = Router();

router.get("/", async (req: Request, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }

  const items = (await Pizza.find()).slice(0, 3);

  res.render("index", { title: "Welcome to our store", items });
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
