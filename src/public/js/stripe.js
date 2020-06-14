/* eslint-disable no-undef */
const stripe = Stripe("pk_test_rFVgNe7UaPrNdQDkk0b2EXh2");
const elements = stripe.elements();

// Set up Stripe.js and Elements to use in checkout form

const style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

const card = elements.create("card", { style });
card.mount("#card-element");

card.on("change", ({ error }) => {
  const displayError = document.getElementById("card-errors");
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = "";
  }
});

const form = document.getElementById("payment-form");
const button = form.querySelector("button");
console.log(JSON.stringify(button.dataset.secret));

form.addEventListener("submit", event => {
  event.preventDefault();
  stripe
    .confirmCardPayment(button.dataset.secret, {
      payment_method: {
        card,
        billing_details: {
          name: button.dataset.name
        }
      }
    })
    .then(function (result) {
      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        console.log(result.error.message);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === "succeeded") {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.

          console.log(result);
        }
      }
    });
});
