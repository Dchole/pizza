import { Router, Response, Request } from "express";
import { checkAuthenticated } from "./middleware/auth";
import User from "../model/user-model";

const router = Router();

router.get("/", checkAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate("cart");

    res.render("cart", {
      title: "Shopping Cart",
      itemInCart: user?.cart
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
