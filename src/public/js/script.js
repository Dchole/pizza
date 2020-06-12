/* eslint-disable no-undef */
M.AutoInit();

const SEARCH_INPUT = document.querySelector('input[name="search"]');
const STORE = document.querySelector("#store ul");

/* SEARCH */
SEARCH_INPUT?.addEventListener("keyup", event => {
  const term = event.target.value.toLowerCase();
  const pizzas = STORE.getElementsByTagName("li");

  [...pizzas].forEach(pizza => {
    const title = pizza.querySelector("#name").textContent;

    if (title.toLowerCase().includes(term)) pizza.style.display = "block";
    else pizza.style.display = "none";
  });
});

/* ADD TO CARD */
const cards = STORE?.querySelectorAll("li");

cards?.forEach(card => {
  const actionBtn = card.querySelector("#add-to-cart");

  if (card.dataset.item.includes(card.dataset.id)) {
    actionBtn.classList = ["waves-effect waves-light btn"];
    actionBtn.innerHTML = `<i class="material-icons left">remove_shopping_cart</i>Remove pizza`;
  }

  let cart = card.dataset.item;

  actionBtn.addEventListener("click", async () => {
    if (cart.includes(card.dataset.id)) {
      try {
        const res = await fetch("/cart/remove", {
          method: "PUT",
          body: card.dataset.id,
          headers: {
            "Content-Type": "text/plain"
          }
        });

        cart = (await res.json()).cart;
      } catch (err) {
        console.log(err);
      }

      actionBtn.classList = ["waves-effect waves-light btn amber accent-4"];
      actionBtn.innerHTML = `<i class="material-icons left">add_shopping_cart</i>Add to cart`;
    } else {
      try {
        const res = await fetch("/cart/add", {
          method: "PUT",
          body: card.dataset.id,
          headers: {
            "Content-Type": "text/plain"
          }
        });

        cart = (await res.json()).cart;

        actionBtn.classList = ["waves-effect waves-light btn"];
        actionBtn.innerHTML = `<i class="material-icons left">remove_shopping_cart</i>Remove pizza`;
      } catch (err) {
        console.log(err);
      }
    }
  });
});

/* INCREASE AND DECREASE QUANTITY */
const cartItems = document.querySelectorAll("#cart li");
const totalPrice = document.querySelector("#cart h2 span");

cartItems.forEach(item => {
  const QUANTITY = item.querySelector(".quantity");
  const DECREASE_QUANTITY = item.querySelector(".config button");
  const INCREASE_QUANTITY = item.querySelector(".config button:last-child");
  const removeBtn = item.querySelector("#cart .card-action a:last-child");

  INCREASE_QUANTITY.addEventListener("click", async () => {
    QUANTITY.textContent++;
    totalPrice.textContent = `GH₵ ${
      Number(totalPrice.textContent.split(" ")[1]) + Number(item.dataset.price)
    }`;

    try {
      await fetch("/cart/add", {
        method: "PUT",
        body: item.dataset.id,
        headers: {
          "Content-Type": "text/plain"
        }
      });
    } catch (err) {
      console.log(err);
    }

    item.style.border = "none";
    removeBtn.classList = ["waves-effect waves-light btn right"];
    removeBtn.innerHTML = `<i class="material-icons left">remove</i>Remove`;
  });

  DECREASE_QUANTITY.addEventListener("click", async () => {
    if (+QUANTITY.textContent) {
      QUANTITY.textContent--;
      totalPrice.textContent = `GH₵ ${
        Number(totalPrice.textContent.split(" ")[1]) -
        Number(item.dataset.price)
      }`;

      try {
        await fetch("/cart/remove", {
          method: "PUT",
          body: item.dataset.id,
          headers: {
            "Content-Type": "text/plain"
          }
        });
      } catch (err) {
        console.log(err);
      }
    }

    if (!+QUANTITY.textContent) {
      item.style.border = "1px solid red";
      removeBtn.innerHTML = `<i class="material-icons left">clear</i>Removed`;
      removeBtn.classList = ["waves-effect waves-light btn right red"];
    }
  });

  removeBtn?.addEventListener("click", async () => {
    try {
      await fetch("/cart/item-remove", {
        method: "PUT",
        body: item.dataset.id,
        headers: {
          "Content-Type": "text/plain"
        }
      });

      QUANTITY.textContent = 0;

      item.style.border = "1px solid red";
      removeBtn.innerHTML = `<i class="material-icons left">clear</i>Removed`;
      removeBtn.classList = ["waves-effect waves-light btn right red"];
    } catch (err) {
      console.log(err);
    }
  });
});

/* UPDATE USER ACCOUNT */
const ACCOUNT_DETAILS = document.querySelectorAll("#account>ul>li");
const SUBMIT_BTN = document.querySelector("#submit-update");

SUBMIT_BTN?.addEventListener("click", async () => {
  const body = {};
  [...ACCOUNT_DETAILS].slice(0, 3).forEach(detail => {
    const { name, value } = detail.querySelector("input");

    body[name] = value;
  });

  try {
    await fetch("/account", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    });

    await M.toast({
      html: '<i class="material-icons">check_circle</i>&nbsp;Updated Account',
      classes: "green"
    });
  } catch (err) {
    console.log(err);
  }
});
