import { config } from "dotenv";
import { connect } from "mongoose";
import path from "path";
import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import hbs from "express-handlebars";
import flash from "connect-flash";
import passport from "passport";

import indexRoute from "./routes/index";
import homeRoute from "./routes/home";
import registerRoute from "./routes/register";
import loginRoute from "./routes/login";
import confirmRoute from "./routes/confirm";
import userController from "./controllers/user-controller";

userController.passportLocal(passport);

config();
const app: Application = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: path.join(__dirname, "/views/layouts/")
  })
);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});

connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => console.log("Connected to DB"))
  .catch((err: Error) => console.log(err));

app.use("/", indexRoute);
app.use("/home", homeRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/confirm", confirmRoute);

app.listen(process.env.PORT, () =>
  console.log(`App running on port ${process.env.PORT}`)
);
