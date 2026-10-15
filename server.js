require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const WorkExperience = require("./models/WorkExperience");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware för JSON och anrop från andra domäner
app.use(express.json());
app.use(cors());

// Hämta alla arbetslivserfarenheter
app.get("/api/workexperience", async (req, res) => {
    try {
        const experiences = await WorkExperience.find()
            .sort({ startdate: -1 });

        res.status(200).json(experiences);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Kunde inte hämta arbetslivserfarenheter."
        });
    }
});

// Lägg till en ny arbetslivserfarenhet
app.post("/api/workexperience", async (req, res) => {
    const {
        companyname,
        jobtitle,
        location,
        startdate,
        enddate,
        description
    } = req.body || {};

    // Kontrollera att alla fält innehåller text
    const fields = {
        companyname,
        jobtitle,
        location,
        startdate,
        enddate,
        description
    };

    for (const [key, value] of Object.entries(fields)) {
        if (typeof value !== "string" || !value.trim()) {
            return res.status(400).json({
                error: `Fältet ${key} måste fyllas i.`
            });
        }
    }


    try {
        // Skapa ett nytt dokument i MongoDB
        const experience = await WorkExperience.create(
            Object.fromEntries(
                Object.entries(fields).map(([key, value]) => [
                    key,
                    value.trim()
                ])
            )
        );

        res.status(201).json({
            message: "Arbetslivserfarenheten har lagts till.",
            id: experience._id
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Kunde inte spara arbetsplatslivserfarenheten."
        });
    }
});

// Uppdatera en befintlig arbetslivserfarenhet
app.put("/api/workexperience/:id", async (req, res) => {
    const id = req.params.id;

    // Kontrollera att MongoDB-ID är giltigt
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            error: "Ogiltigt ID."
        });
    }

    const {
        companyname,
        jobtitle,
        location,
        startdate,
        enddate,
        description
    } = req.body || {};

    // Kontrollera att alla fält innehåller text
    const fields = {
        companyname,
        jobtitle,
        location,
        startdate,
        enddate,
        description
    };

    for (const [key, value] of Object.entries(fields)) {
        if (typeof value !== "string" || !value.trim()) {
            return res.status(400).json({
                error: `Fältet ${key} måste fyllas i.`
            });
        }
    }

    try {
        // Uppdatera dokumentet i MongoDB
        const experience = await WorkExperience.findByIdAndUpdate(
            id,
            Object.fromEntries(
                Object.entries(fields).map(([key, value]) => [
                    key,
                    value.trim()
                ])
            ),
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        // Kontrollera om dokumentet finns
        if (!experience) {
            return res.status(404).json({
                error: "Arbetslivserfarenheten hittades inte."
            });
        }

        res.status(200).json({
            message: "Arbetslivserfarenheten har uppdaterats."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Kunde inte uppdatera arbetslivserfarenheten."
        });
    }
});

// Radera en arbetslivserfarenhet
app.delete("/api/workexperience/:id", async (req, res) => {
    const id = req.params.id;

    // Kontrollera att MongoDB-ID är giltigt
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            error: "Ogiltigt ID."
        });
    }

    try {
        // Hitta och radera dokumentet i MongoDB
        const experience = await WorkExperience.findByIdAndDelete(id);

        // Kontrollera om dokumentet finns
        if (!experience) {
            return res.status(404).json({
                error: "Arbetslivserfarenheten hittades inte."
            });
        }

        res.status(200).json({
            message: "Arbetslivserfarenheten har raderats."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Kunde inte radera arbetslivserfarenheten."
        });
    }
});

// Starta servern och anslut till MongoDB
async function startServer() {
    try {

        console.log("Försöker ansluta till MongoDB...");

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("Ansluten till MongoDB!");

        app.listen(PORT, () => {
            console.log(`Servern körs på port ${PORT}`);
        });

    } catch (error) {
        console.error("Kunde inte ansluta till MongoDB.", error.message);
    }
}

startServer();