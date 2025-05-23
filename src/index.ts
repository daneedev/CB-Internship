import express, { Request, Response } from "express"
import dotenv from "dotenv"
import nunjucks from "nunjucks"
import fs from "fs"
import path from "path"
import { connect } from "./handlers/db"
import flash from "connect-flash"
dotenv.config()

const app = express()

app.use(flash())

nunjucks.configure('src/views', {
    autoescape: true,
    express: app,
    watch: true
});

// DB
connect()

app.use("/public", express.static(path.join(__dirname, 'public')));

app.get("/", function (req: Request, res: Response) {
    res.send("Hello world!")
})

app.use("/", express.static(path.join(__dirname, 'views')));

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}`)
})