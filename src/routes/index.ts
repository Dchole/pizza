import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { IUser } from "../model/user-model";
import newsletterController from "../controllers/newsletter-controller";

const router = Router();

router.get("/", (_, res) => {
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
      if (!errors.isEmpty()) {
        req.session.success = false;
      } else {
        await newsletterController.CreateNewsLetter({ email: req.body.email });
        req.session.success = true;
      }

      res.redirect("/");
    } catch (err) {
      console.log(err);
      req.session.success = false;
    }
  }
);

export default router;
