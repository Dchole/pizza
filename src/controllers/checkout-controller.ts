import Stripe from "stripe";
import { config } from "dotenv";

config();
export const stripeConfig = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-03-02",
    typescript: true
  });

const stripe = stripeConfig();

export const createPaymentIntent = async (amount: number, currency: string) => {
  const params: Stripe.PaymentIntentCreateParams = {
    amount,
    currency,
    metadata: { integration_check: "accept_a_payment" }
  };

  const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
    params
  );

  return paymentIntent;
};
