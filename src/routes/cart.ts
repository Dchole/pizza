import { Router, Response, Request, NextFunction } from "express";
import { checkAuthenticated } from "./middleware/auth";
import User from "../model/user-model";

const router = Router();

router.get("/", checkAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate("cart");

    //@ts-ignore
    const itemsInCart = user?.cart.map(item => {
      const quantity = user.cart.filter(i => i === item).length;

      item.quantity = quantity;
      return item;
    });

    res.render("cart", {
      title: "Shopping Cart",
      itemsInCart: [...new Set(itemsInCart)]
    });
  } catch (err) {
    console.log(err);
  }
});

router.put("/add", checkAuthenticated, async (req: Request, res: Response) => {
  try {
    const cart = [...req.user?.cart, req.body];

    await User.findByIdAndUpdate(req.user?._id, { cart });
    res.json({ cart });
  } catch (err) {
    console.log(err);
  }
});

router.put(
  "/remove",
  checkAuthenticated,
  async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      req.user?.cart.splice(req.user.cart.indexOf(req.body), 1);
      await User.findByIdAndUpdate(req.user?._id, { cart: req.user?.cart });
      res.json({ cart: req.user?.cart });
    } catch (err) {
      console.log(err);
    }
  }
);

router.put(
  "/item-remove",
  checkAuthenticated,
  async (req: Request, _, next: NextFunction) => {
    try {
      const cart = req.user?.cart.filter(
        (item: any) => item.toString() !== req.body
      );
      await User.findByIdAndUpdate(req.user?._id, { cart });

      next();
    } catch (err) {
      console.log(err);
    }
  }
);

export default router;
