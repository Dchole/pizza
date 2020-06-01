import { config } from "dotenv";
import { connect } from "mongoose";
import path from "path";
import express, { Application } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import hbs from "express-handlebars";
import flash from "express-flash";

import indexRoute from "./routes/index";
import registerRoute from "./routes/register";
import loginRoute from "./routes/login";
import confirmRoute from "./routes/confirm";

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
app.use(flash());

connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => console.log("Connected to DB"))
  .catch((err: Error) => console.log(err));

app.use("/", indexRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/confirm", confirmRoute);

app.listen(process.env.PORT, () =>
  console.log(`App running on port ${process.env.PORT}`)
);
