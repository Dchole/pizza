import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.render("login", { title: "Login" });
});

router.post("/", async (req, res) => {
  try {
    res.redirect("/home");
  } catch (err) {
    res.redirect("/login");
    console.log(err);
  }
});

export default router;
