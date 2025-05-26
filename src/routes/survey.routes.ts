import express, { Request, Response } from 'express';
import Rating from '../models/Rating';
import Business from '../models/Business';

const router = express.Router();

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

router.post("/submit", function (req: Request, res: Response) {
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