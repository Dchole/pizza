import { Router, Response, Request } from "express";
import { checkAuthenticated } from "./middleware/auth";
import userController from "../controllers/user-controller";
import Pizza from "../model/pizza-model";
import User from "../model/user-model";

const router = Router();

router.get("/cash", checkAuthenticated, async (req: Request, res: Response) => {
  try {
    const products = await Pizza.find({ _id: { $in: req.user?.cart } });
    const productNames = products.map(product => product.name);
    let productNamesString = productNames[0];

    if (productNames.length > 1) {
      const lastName = productNames.pop();
      productNames.push(`and ${lastName}`);
      productNamesString = productNames.join(", ");
    }

    userController
      .sendOrderMsg(req.user?.fullName!, productNamesString)
      .then(() => {
        User.findByIdAndUpdate(req.user?._id, { cart: [] }).then(() =>
          res.sendStatus(200).redirect("/cart")
        );
      })
      .catch(() => res.sendStatus(500));
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
