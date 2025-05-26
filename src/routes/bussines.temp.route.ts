import express, { Request, Response } from "express"
import { checkAuth } from "../handlers/checkAuth"

const router = express.Router()

router.get("/", checkAuth, function (req: Request, res: Response) {
    res.render("dashboard/bussinesses.html", {
        title: "Dashboard",
        user: req.user,
        success: req.flash("success"),
        error: req.flash("error"),
    })
})

export default router