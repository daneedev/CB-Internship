import express, { Request, Response } from "express"
import dotenv from "dotenv"
import nunjucks from "nunjucks"
import path from "path"
import { connect, db } from "./handlers/db"
import flash from "connect-flash"
import session from "express-session"
import bodyParser from "body-parser"
import connectSessionSequelize from 'connect-session-sequelize';
import loadPassport from "./handlers/passport"
import passport from "passport"

dotenv.config()

// ROUTES
import authRoutes from "./routes/auth.routes"
import dashRoutes from "./routes/dash.routes"

const app = express()

app.use(flash())

const SequelizeStore = connectSessionSequelize(session.Store);

app.use(session({
    secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    },
    store: new SequelizeStore({ db: db})
}))

app.use(bodyParser.urlencoded({ extended: true }))

nunjucks.configure('src/views', {
    autoescape: true,
    express: app,
    watch: true
});

// DB
connect()

// PASSPORT
app.use(passport.initialize())
app.use(passport.session())
loadPassport()

app.use("/public", express.static(path.join(__dirname, 'public')));

app.get("/", function (req: Request, res: Response) {
    res.send("Hello world!")
})

app.use("/auth", authRoutes)
app.use("/dash", dashRoutes)

app.use("/", express.static(path.join(__dirname, 'views')));

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}`)
})