require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

// Skapa ett administratörskonto
async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;

        if (!username || !password || password.length < 12) {
            throw new Error("Ange ADMIN_USERNAME och ett lösenord på minst 12 tecken i .env.");
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            console.log("Administratörskontot finns redan.");
            return;
        }

        await User.create({ username, password });

        console.log("Administratörskontot har skapats!");
    } catch (error) {
        console.error("Fel:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();