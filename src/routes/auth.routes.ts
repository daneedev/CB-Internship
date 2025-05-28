import express, { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { checkAuth, checkNotAuth } from '../handlers/checkAuth';


const router = express.Router();

router.get("/logout", checkAuth, function (req: Request, res: Response) {
    req.logout(function(err) {
        if (err) {
            req.flash("error", "Error logging out");
            return res.redirect("/dash");
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/auth/login");
    });
});

router.post("/delete", checkAuth, async function (req: Request, res: Response) {
    const userId = (req.user as User).id;
    try {
        await User.destroy({ where: { id: userId } });
        req.logout(function(err) {
            if (err) {
                req.flash("error", "Error logging out");
                return res.redirect("/dash");
            }
            req.flash("success", "Account deleted successfully");
            res.redirect("/auth/login");
        });
    } catch (error) {
        req.flash("error", "Error deleting account");
        res.redirect("/dash");
    }
});

router.post("/update", checkAuth, async function (req: Request, res: Response) {
    const userId = (req.user as User).id;
    const { username, email, password } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
        req.flash("error", "User not found");
        res.redirect("/dash");
        return;
    }
    if (username) {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser && existingUser.id !== userId) {
            req.flash("error", "Username already exists");
            res.redirect("/dash/profile");
            return;
        }
        user.username = username;
    }
    if (email) {
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail && existingEmail.id !== userId) {
            req.flash("error", "Email already exists");
            res.redirect("/dash/profile");
            return;
        }
        user.email = email;
    }
    if (password) {
        if (password.length < 6) {
            req.flash("error", "Password must be at least 6 characters long");
            res.redirect("/dash/profile");
            return;
        }
        user.password = await bcrypt.hash(password, 10);
    }
    await user.save().then(() => {;
    req.flash("success", "Profile updated successfully");
    res.redirect("/dash/profile");
    })
});

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