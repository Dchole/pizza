import { Router, Response, Request, NextFunction } from "express";
import { checkAuthenticated } from "./middleware/auth";
import User from "../model/user-model";

const router = Router();

router.get("/", checkAuthenticated, (_, res: Response) => {
  res.render("cart", { title: "Shopping Cart" });
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
      const cart = req.user?.cart.filter(
        (item: any) => item.toString() !== req.body
      );
      await User.findByIdAndUpdate(req.user?._id, { cart });
      res.json({ cart });
    } catch (err) {
      console.log(err);
    }
  }
);

export default router;
