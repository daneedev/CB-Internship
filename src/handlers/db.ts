import { Sequelize } from "sequelize";

const db = new Sequelize({
    dialect: "sqlite",
    storage: "./db.sqlite",
    logging: false
});

async function connect() {
    try {
        await db.authenticate();
        console.log("Connection to the database has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

db.sync()

export {db, connect};