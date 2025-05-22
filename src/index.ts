import express, { Request, Response } from "express"
import dotenv from "dotenv"
import nunjucks from "nunjucks"
import fs from "fs"
import path from "path"
import { connect } from "./handlers/db"
dotenv.config()

const app = express()


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

app.get("/:file", function (req: Request, res: Response) {
    if (!fs.readFileSync(`src/views/${req.params.file}`)) {
        res.status(404).send("File not found")
    } else {
    res.render(`${req.params.file}`, {})
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on ${process.env.PORT}`)
})