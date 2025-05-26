import express, { Request, Response } from "express"
import { checkAuth } from "../handlers/checkAuth"
import Business from "../models/Business"
import User from "../models/User"
import Rating from "../models/Rating"
import { Op } from "sequelize"

const router = express.Router();

router.get("/", checkAuth, async function (req: Request, res: Response) {
    const businesses = await Business.findAll({
        where: { ownerId: (req.user as User).id },
    })
    
    // Add initials for each business
    const business = businesses.map(b => {
        const words = b.name.split(' ');
        const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
        return {
            ...b.toJSON(),
            initials: initials.substring(0, 2) // Limit to first 2 letters if needed
        };
    });

    res.render("dashboard/businesses.html", {
        title: "Businesses",
        user: req.user,
        success: req.flash("success"),
        error: req.flash("error"),
        businesses: business,
    })
})

router.get("/:businessId", checkAuth, async function (req: Request, res: Response) {
    const business = await Business.findByPk(req.params.businessId)
    if (!business) {
        res.render("message.html", {
            title: "Business Not Found",
            errormsg: "The business you are looking for does not exist."
        })
        return
    }
    const user = req.user as User
    if (business.ownerId !== user.id) {
        res.render("message.html", {
            title: "Access Denied",
            errormsg: "You do not have permission to access this business."
        })
        return
    }

    const totalRatings = await Rating.count({
        where: { businessId: business.id }
    })
    const ratingsThisMonth = await Rating.count({
        where: {
            businessId: business.id,
            createdAt: {
                [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
        }
    })
    const ratings = await Rating.findAll({
        where: { businessId: business.id },
    })
    const ratingsToday = await Rating.count({
        where: {
            businessId: business.id,
            createdAt: {
                [Op.gte]: new Date(new Date().setHours(0))
            }
        }
    })
    const ratingsYesterday = await Rating.count({
        where: {
            businessId: business.id,
            createdAt: {
                [Op.gte]: new Date(new Date().setHours(0) - 24 * 60 * 60 * 1000),
                [Op.lt]: new Date(new Date().setHours(0))
            }
        }
    })
    res.render("dashboard/dashboard.html", {
        title: "Dashboard",
        user: req.user,
        success: req.flash("success"),
        error: req.flash("error"),
        totalSurveys: totalRatings,
        surveysMonth: ratingsThisMonth,
        surveys: ratings,
        todaySurveys: ratingsToday,
        todaySurveysPercent: ratingsYesterday > 0 ? (ratingsToday / ratingsYesterday) * 100 : 0,
        page: business.name
    })
    
})

export default router;
