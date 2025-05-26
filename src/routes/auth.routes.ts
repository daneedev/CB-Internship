import express, { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { checkNotAuth } from '../handlers/checkAuth';


const router = express.Router();

router.use(checkNotAuth);

router.get("/login", function (req: Request, res: Response) {
    res.render("auth/login.html", { error: req.flash("error"), success: req.flash("success") });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/dash",
    failureRedirect: "/auth/login",
    failureFlash: true,
}))

router.get("/register", function (req: Request, res: Response)  {
    res.render("auth/register.html", { error: req.flash("error"), success: req.flash("success") });
});

router.post("/register", async function (req: Request, res: Response) {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        req.flash("error", "Username already exists");
        res.redirect("/auth/register");
        return;
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
        req.flash("error", "Email already exists");
        res.redirect("/auth/register");
        return;
    }
    if (password.length < 6) {
        req.flash("error", "Password must be at least 6 characters long");
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