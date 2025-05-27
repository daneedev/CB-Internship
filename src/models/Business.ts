import { db } from "../handlers/db";
import { DataTypes, Model } from "sequelize";

class Business extends Model {
    public id!: number;
    public name!: string;
    public ownerId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Business.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        tableName: "businesses",
    }
);

Business.sync()


export default Business;