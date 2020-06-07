/* eslint-disable no-undef */
M.AutoInit();

const SEARCH_INPUT = document.querySelector('input[name="search"]');
const STORE = document.querySelector("#store ul");

SEARCH_INPUT.addEventListener("keyup", event => {
  const term = event.target.value.toLowerCase();
  const pizzas = STORE.getElementsByTagName("li");

  [...pizzas].forEach(pizza => {
    const title = pizza.querySelector("#recipe").textContent;

    if (title.toLowerCase().includes(term)) pizza.style.display = "block";
    else pizza.style.display = "none";
  });
});

const cards = STORE.querySelectorAll("li");

[...cards].forEach(card => {
  const actionBtn = card.querySelector("#add-to-cart");

  if (card.dataset.item.includes(card.dataset.id)) {
    actionBtn.classList = ["waves-effect waves-light btn blue"];
    actionBtn.innerHTML = `<i class="material-icons left">remove_shopping_cart</i>Remove pizza`;
  }

  let cart = card.dataset.item;

  actionBtn.addEventListener("click", async () => {
    console.log(cart);

    if (cart.includes(card.dataset.id)) {
      actionBtn.classList = ["waves-effect waves-light btn amber accent-4"];
      actionBtn.innerHTML = `<i class="material-icons left">add_shopping_cart</i>Add to cart`;

      try {
        const res = await fetch("/cart/remove", {
          method: "PUT",
          body: card.dataset.id,
          headers: {
            "Content-Type": "text/plain"
          }
        });

        cart = (await res.json()).cart;
        console.log(cart);
      } catch (err) {
        console.log(err);
      }
    } else {
      actionBtn.classList = ["waves-effect waves-light btn blue"];
      actionBtn.innerHTML = `<i class="material-icons left">remove_shopping_cart</i>Remove pizza`;

      try {
        const res = await fetch("/cart/add", {
          method: "PUT",
          body: card.dataset.id,
          headers: {
            "Content-Type": "text/plain"
          }
        });

        cart = (await res.json()).cart;
        console.log(cart);
      } catch (err) {
        console.log(err);
      }
    }
  });
});
