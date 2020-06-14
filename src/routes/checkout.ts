import { Router, Request, Response } from "express";
import { createPaymentIntent } from "../controllers/checkout-controller";
import { checkAuthenticated } from "./middleware/auth";
import fetch from "node-fetch";
import User from "../model/user-model";

const router = Router();

router.get("/", checkAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate("cart");

    const amount = user?.cart.reduce(
      (acc: any, curr: any) => acc + curr.price,
      0
    );

    const result = await fetch(
      "http://data.fixer.io/api/latest?access_key=9451a01aeca8f577e9da34c8ed20ee18"
    );

    const {
      rates: { GHS, USD }
    } = await result.json();

    const convertToUSD = Math.round(((amount * 100) / GHS) * USD);

    const { client_secret } = await createPaymentIntent(convertToUSD, "usd");

    res.render("checkout", {
      title: "Checkout",
      name: req.user?.fullName,
      client_secret,
      amount
    });
  } catch (err) {
    res.redirect("/cart");
  }
});

export default router;
