const mongoose = require("mongoose");

// Schema för arbetslivserfarenheter
const workExperienceSchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true,
        trim: true
    },
    jobtitle: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    startdate: {
        type: String,
        required: true,
        trim: true
    },
    enddate: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
});

// Skapa och exportera modellen
module.exports = mongoose.model("WorkExperience", workExperienceSchema);