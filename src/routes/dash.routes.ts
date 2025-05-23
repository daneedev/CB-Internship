import express, { Request, Response } from "express"

const router = express.Router()

router.get("/", function (req: Request, res: Response) {
    res.render("dashboard/index.html", {
        title: "Dashboard",
        user: req.user,
        flash: req.flash("info"),
    })
})

export default router