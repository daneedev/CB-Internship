import bodyParser from "body-parser";
import flash from "connect-flash";
import connectSessionSequelize from "connect-session-sequelize";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import session from "express-session";
import nunjucks from "nunjucks";
import passport from "passport";
import path from "path";
import { connect, db } from "./handlers/db";
import loadPassport from "./handlers/passport";
import { rateLimit } from 'express-rate-limit'


dotenv.config();

// ROUTES
import authRoutes from "./routes/auth.routes"
import dashRoutes from "./routes/dash.routes"
import businessRoutes from "./routes/business.routes"
import surveyRoutes from "./routes/survey.routes"
import apiRoutes from "./routes/api.routes"

const app = express();

app.use(flash());


const SequelizeStore = connectSessionSequelize(session.Store);

app.use(
  session({
    secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    store: new SequelizeStore({ db: db }),
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

nunjucks.configure("src/views", {
  autoescape: true,
  express: app,
  watch: true,
});

// DB
connect();

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
loadPassport();

app.use("/public", express.static("src/public"));

// TODO: Divide rate limit on specific routes
const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 70, 
  message: "Too many requests, please try again later.",
  handler: (req, res) => {
    res.status(429).render("message.html", {
      title: "Too Many Requests",
      errormsg: "You have exceeded the number of requests allowed. Please try again later."
    });
  }
});

app.use(limiter);

app.get("/", function (req: Request, res: Response) {
  res.send("Hello world!");
});

app.use("/auth", authRoutes)
app.use("/dash", dashRoutes)
app.use("/business", businessRoutes)
app.use("/survey", surveyRoutes)
app.use("/api", apiRoutes)

app.use("/", express.static("src/views"));

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on ${process.env.PORT}`);
});
