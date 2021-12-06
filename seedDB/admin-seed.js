const User = require("../models/user");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
connectDB();

async function seedDB() {
    async function seedAdmin(email, password, username) {
        try {
            const newUser = await new User({
                email: email,
                username: username
            });
            // newUser.email = email;
            newUser.password = newUser.hashPassword(password);
            // newUser.username = username;
            await newUser.save();
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async function closeDB() {
        console.log("CLOSING CONNECTION");
        await mongoose.disconnect();
    }

    await seedAdmin("admin@example.com", "Admin@123", "admin");

    await closeDB();
}

seedDB();
