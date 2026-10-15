require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware för JSON och anrop från andra domäner
app.use(express.json());
app.use(cors());

// Hämta alla maträtter från restaurangens meny
app.get("/api/menu", async (req, res) => {
    try {
        const menuItems = await MenuItem.find()
            .sort({ category: 1, name: 1 });

        res.status(200).json(menuItems);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Kunde inte hämta restaurangens meny."
        });
    }
});

// Lägg till en ny maträtt
app.post("/api/menu", async (req, res) => {
    const {
        name,
        description,
        price,
        category
    } = req.body || {};

    // Kontrollera endast textfälten
    const fields = {
        name,
        description,
        category
    };

    for (const [key, value] of Object.entries(fields)) {
        if (typeof value !== "string" || !value.trim()) {
            return res.status(400).json({
                error: `Fältet ${key} måste fyllas i.`
            });
        }
    }

    // Kontrollera att priset är ett giltigt tal
    if (typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 0) {
        return res.status(400).json({
            error: "Priset måste vara ett giltigt tal som inte är negativt."
        });
    }


    try {
        const menuItem = await MenuItem.create({
            name: name.trim(),
            description: description.trim(),
            price,
            category: category.trim()
        });

        res.status(201).json({
            message: "Maträtten har lagts till.",
            id: menuItem._id
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Kunde inte lägga till maträtten."
        });
    }
});

// Uppdatera en befintlig maträtt
app.put("/api/menu/:id", async (req, res) => {
    const id = req.params.id;

    // Kontrollera att ID är giltigt
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            error: "Ogiltigt ID."
        });
    }

    const {
        name,
        description,
        price,
        category
    } = req.body || {};

    // Kontrollera textfälten
    const fields = {
       name,
       description,
       category
    };

    for (const [key, value] of Object.entries(fields)) {
        if (typeof value !== "string" || !value.trim()) {
            return res.status(400).json({
                error: `Fältet ${key} måste fyllas i.`
            });
        }
    }

    // Kontrollera priset
    if (typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 0) {
            return res.status(400).json({
                error: "Priset måste vara ett giltigt tal som inte är negativt."
            });
        }

    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                description: description.trim(),
                price,
                category: category.trim()
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!menuItem) {
            return res.status(404).json({
                error: "Maträtten hittades inte."
            });
        }

        res.status(200).json({
            message: "Maträtten har uppdaterats."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Kunde inte uppdatera maträtten."
        });
    }
});

// Radera en maträtt
app.delete("/api/menu/:id", async (req, res) => {
    const id = req.params.id;

    // Kontrollera att ID är giltigt
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            error: "Ogiltigt ID."
        });
    }

    try {
        // Hitta och radera maträtten i MongoDB
        const menuItem = await MenuItem.findByIdAndDelete(id);

        if (!menuItem) {
            return res.status(404).json({
                error: "Maträtten hittades inte."
            });
        }

        res.status(200).json({
            message: "Maträtten har raderats."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Kunde inte radera maträtten."
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