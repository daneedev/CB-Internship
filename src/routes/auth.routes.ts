import express, { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import passport from 'passport';

const router = express.Router();

router.get("/login", function (req: Request, res: Response) {
    res.render("auth/login.html");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/dash",
    failureRedirect: "/auth/login",
    failureFlash: true,
}))

router.get("/register", function (req: Request, res: Response)  {
    res.render("auth/register.html");
});

router.post("/register", async function (req: Request, res: Response) {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        req.flash("error", "Username already exists");
        res.redirect("/auth/register");
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        username,
        password: hashedPassword,
        email,
    });
    
    req.flash("success", "User created successfully");
    res.redirect("/auth/login");
});

export default router;