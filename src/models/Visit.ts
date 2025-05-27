import { db } from "../handlers/db";
import { DataTypes, Model } from "sequelize";

class Rating extends Model {
    public id!: number;
    public businessId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Rating.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        businessId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        tableName: "visits",
    }
);


export default Rating;