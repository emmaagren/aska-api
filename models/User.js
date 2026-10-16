const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Skapa schema för användarkonton
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    account_created: {
        type: Date,
        default: Date.now
    }
});

// Hasha lösenordet innan det sparas i databasen
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10); 
});

// Registrera en ny användare
userSchema.statics.register = async function (username, password) {
    try {
        const user = new this ({ username, password });
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

// Skapa och exportera användarmodellen
module.exports = mongoose.model("User", userSchema);