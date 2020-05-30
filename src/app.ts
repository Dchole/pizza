import { config } from "dotenv";
import path from "path";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import hbs from "express-handlebars";
import indexRoute from "./routes/index";

config();
const app = express();

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
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false
  })
);

app.use("/", indexRoute);

app.listen(process.env.PORT, () =>
  console.log(`App running on port ${process.env.PORT}`)
);
