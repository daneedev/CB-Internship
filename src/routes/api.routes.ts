import express, { Request, Response } from 'express';
import Business from '../models/Business';
import Rating from '../models/Rating';
import { checkAuth } from '../handlers/checkAuth';
import User from '../models/User';
import Visit from '../models/Visit';

const router = express.Router();

router.get("/getBusinessData/:id", checkAuth, async function (req: Request, res: Response) {
    const businessId = req.params.id;
    const business = await Business.findByPk(businessId);
    if (!business) {
        res.status(404).json({ error: "Business not found" });
        return;
    }
    const user = req.user as User;
    if (business.ownerId !== user.id) {
        res.status(403).json({ error: "You do not have permission to view this business" });
        return;
    }
    const ratings = await Rating.findAll({
        where: { businessId: business.id }
    });

    const visits = await Visit.findAll({
        where: { businessId: business.id }
    });

    res.json({
        business: {
            id: business.id,
            name: business.name,
            ownerId: business.ownerId,
            createdAt: business.createdAt,
            updatedAt: business.updatedAt
        },
        ratings: ratings.map(rating => ({
            id: rating.id,
            usage: rating.usage,
            satisfaction: Number(rating.satisfaction),
            staff: Number(rating.staff),
            futureFeatures: rating.futureFeatures,
            overallExperience: rating.overallExperience,
            createdAt: rating.createdAt,
            updatedAt: rating.updatedAt,
            month: rating.createdAt.getMonth(),
        })),
        visits: visits.map(visit => ({
            id: visit.id,
            businessId: visit.businessId,
            createdAt: visit.createdAt,
            updatedAt: visit.updatedAt,
            month: visit.createdAt.getMonth(),
        }))
    });
})

router.get("/countVisit/:id", async function (req: Request, res: Response) {
    const businessId = req.params.id;
    const business = await Business.findByPk(businessId);
    if (!business) {
        res.status(404).json({ error: "Business not found" });
        return;
    }

    Visit.create({
        businessId: business.id
    })

    res.status(200).json({ message: "Visit counted successfully"});
})

export default router;