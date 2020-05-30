import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.render("index", { title: "Welcome to our store" });
});

export default router;
