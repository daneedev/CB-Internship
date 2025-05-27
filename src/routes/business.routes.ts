import express, { Request, Response } from "express";
import Business from "../models/Business";
import User from "../models/User";

const router = express.Router();

router.post("/create", async function (req: Request, res: Response) {
  const { name, description } = req.body;
  const user = req.user as User;
  Business.create({
    name: name,
    ownerId: user.id,
    description: description,
  });
  req.flash("success", "Business created successfully");
  res.redirect("/dash");
});

router.post("/delete", function (req: Request, res: Response) {
  const { id } = req.body;
  const user = req.user as User;
  Business.destroy({
    where: {
      id: id,
      ownerId: user.id,
    },
  })
    .then(() => {
      req.flash("success", "Business deleted successfully");
      res.redirect("/dash");
    })
    .catch((err) => {
      req.flash("error", "Error deleting business");
      res.redirect("/dash");
    });
});

export default router;
