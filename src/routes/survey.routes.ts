import express, { Request, Response } from 'express';
import Rating from '../models/Rating';
import Business from '../models/Business';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limit survey
const surveyLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: "Too many surveys submitted from this IP, please try again later.",
    handler: (req: Request, res: Response) => {
        res.status(429).render("message.html", {
            title: "Too Many Requests",
            errormsg: "You have exceeded the number of surveys allowed. Please try again later."
        });
    }
});

router.get("/:businessId", async (req: Request, res: Response) => {
    const businessId = req.params.businessId;
    const business = await Business.findByPk(businessId);
    if (!business) {
        res.render("message.html", {
            title: "Business Not Found",
            errormsg: "The business you are looking for does not exist."
        });
        return;
    }
    
    res.render("survey.html", {
        title: `Survey for ${business.name}`,
        businessId: business.id,
        company: business.name,
        success: req.flash("success"),
        error: req.flash("error"),
    });  
})

router.post("/submit", surveyLimiter, function (req: Request, res: Response) {
    const { 
        businessId, 
        usage_frequency, 
        satisfaction, 
        staff_rating, 
        future_features, 
        overall_rating
    } = req.body;


    Rating.create({
        usage: usage_frequency,
        satisfaction: satisfaction,
        staff: staff_rating,
        futureFeatures: future_features,
        overallExperience: overall_rating,
        businessId: businessId
    })
    .then(() => {
        res.render("message.html", {
            title: "Survey Submitted",
            successmsg: "Survey submitted successfully"
        });
    })
})


export default router;