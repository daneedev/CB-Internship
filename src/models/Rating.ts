import { db } from "../handlers/db";
import { DataTypes, Model } from "sequelize";

class Rating extends Model {
    public id!: number;
    public businessId!: string;
    public usage!: string;
    public satisfaction!: number;
    public staff!: number;
    public futureFeatures!: string;
    public overallExperience!: number;
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
        usage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        satisfaction: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        staff: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        futureFeatures: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        overallExperience: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        businessId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        tableName: "ratings",
    }
);


export default Rating;