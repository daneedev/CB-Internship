import calcPercent from "calc-percent";
import express, { Request, Response } from "express";
import { Op } from "sequelize";
import { checkAuth } from "../handlers/checkAuth";
import Business from "../models/Business";
import Rating from "../models/Rating";
import User from "../models/User";
import sha256 from 'crypto-js/sha256';
import Visit from "../models/Visit";
import QRCode from "qrcode"

const router = express.Router();

router.get("/", checkAuth, async function (req: Request, res: Response) {
  const businesses = await Business.findAll({
    where: { ownerId: (req.user as User).id },
  });

  const business = await Promise.all(
    businesses.map(async (b) => {
      const words = b.name.split(" ");
      const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
      const surveys = await Rating.count({ where: { businessId: b.id } });
      const visits = await Visit.count({ where: { businessId: b.id } });
      const ratings = await Rating.findAll({
        where: { businessId: b.id }
      });
      const overallExperience = calcPercent(
      ratings.reduce(
        (acc, rating) => Number(acc) + Number(rating.overallExperience),
        0
      ) / ratings.length || 0,
      5
    );
      return {
        ...b.toJSON(),
        initials: initials.substring(0, 2), // Limit to first 2 letters if needed
        surveys: surveys,
        visits: visits,
        overallExperience: overallExperience,
      };
    })
  );

  res.render("dashboard/businesses.html", {
    title: "InsightHub | Businesses",
    page: "Businesses",
    user: req.user,
    success: req.flash("success"),
    error: req.flash("error"),
    businesses: business,
  });
});
router.get("/profile", checkAuth, async function (req: Request, res: Response) {
    const businessCount = await Business.count({
    where: { ownerId: (req.user as User).id },
    });
    const surveysCount = await Rating.count({
        where: {
            businessId: {
                [Op.in]: (
                    await Business.findAll({
                        where: { ownerId: (req.user as User).id },
                        attributes: ["id"],
                    })
                ).map((b) => b.id),
            },
        }
    })
    const user = req.user as User; 
    const userDb = await User.findByPk(user.id)
    if (!userDb) {
        req.flash("error", "User not found");
        return res.redirect("/dash");
    }
    const gravatarHash = sha256(user.email)
    const gravatarUrl = `https://www.gravatar.com/avatar/${gravatarHash}`;
    res.render("dashboard/profile.html", {
        title: "InsightHub | Profile",
        page: "Profile",
        user: userDb,
        success: req.flash("success"),
        error: req.flash("error"),
        businessCount: businessCount,
        surveysCount: surveysCount,
        gravatarUrl: gravatarUrl,
        accountCreated: new Date(userDb.createdAt).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
        accountUpdated: new Date(userDb.updatedAt).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
    });
});
router.get(
  "/:businessId",
  checkAuth,
  async function (req: Request, res: Response) {
    const business = await Business.findByPk(req.params.businessId);
    if (!business) {
      res.render("message.html", {
        title: "InsightHub | Business Not Found",
        errormsg: "The business you are looking for does not exist.",
      });
      return;
    }
    const user = req.user as User;
    if (business.ownerId !== user.id) {
      res.render("message.html", {
        title: "InsightHub | Access Denied",
        errormsg: "You do not have permission to access this business.",
      });
      return;
    }

    const totalRatings = await Rating.count({
      where: { businessId: business.id },
    });
    const ratingsThisMonth = await Rating.count({
      where: {
        businessId: business.id,
        createdAt: {
          [Op.gte]: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),
        },
      },
    });
    const ratings = await Rating.findAll({
      where: { businessId: business.id },
    });
    const ratingsToday = await Rating.count({
      where: {
        businessId: business.id,
        createdAt: {
          [Op.gte]: new Date(new Date().setHours(0)),
        },
      },
    });
    const ratingsYesterday = await Rating.count({
      where: {
        businessId: business.id,
        createdAt: {
          [Op.gte]: new Date(new Date().setHours(0) - 24 * 60 * 60 * 1000),
          [Op.lt]: new Date(new Date().setHours(0)),
        },
      },
    });
    const averageSatisfaction = calcPercent(
      ratings.reduce(
        (acc, rating) => Number(acc) + Number(rating.satisfaction),
        0
      ) / ratings.length || 0,
      3
    );
    const averageStaff = Number(calcPercent(ratings.reduce((acc, rating) => Number(acc) + Number(rating.staff), 0) / ratings.length || 0, 4)) / 10 

    const surveyLink = `/survey/${business.id}`;
    const surveyText = `${process.env.DOMAIN}/survey/${business.id}`.substring(0, 20) + "...";
    ratings.map((rating) => {
        let date = new Date(rating.createdAt).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        rating.setDataValue("date", date);
    });

    ratings.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const visitsToday = await Visit.count({
        where: {
            businessId: business.id,
            createdAt: {
                [Op.gte]: new Date(new Date().setHours(0)),
            },
        },
    })

    const visitsYesterday = await Visit.count({
        where: {
            businessId: business.id,
            createdAt: {
                [Op.gte]: new Date(new Date().setHours(0) - 24 * 60 * 60 * 1000),
                [Op.lt]: new Date(new Date().setHours(0)),
            },
        },
    });

    const surveyYear = await Rating.count({
        where: {
            businessId: business.id,
            createdAt: {
                [Op.gte]: new Date(new Date().getFullYear(), 0, 1),
            },
        },
    })
    

    const qrCodeImage = await QRCode.toDataURL(`https://${process.env.DOMAIN}/survey/${business.id}`, {
        errorCorrectionLevel: 'H', width: 300})

    res.render("dashboard/dashboard.html", {
        title: `InsightHub | ${business.name}`,
        user: req.user,
        success: req.flash("success"),
        error: req.flash("error"),
        totalSurveys: totalRatings,
        surveysMonth: ratingsThisMonth,
        surveys: ratings,
        todaySurveys: ratingsToday,
        surveyDifference: ratingsToday - ratingsYesterday,
        page: business.name,
        averageSatisfaction: averageSatisfaction,
        averageStaff: averageStaff,
        surveyLink: surveyLink,
        surveyText: surveyText,
        visitsToday: visitsToday,
        visitsDifference: visitsToday - visitsYesterday,
        qrCodeImage: qrCodeImage,
        surveyYear: surveyYear,
        currentYear: new Date().getFullYear(),
    });
  }
);

export default router;
