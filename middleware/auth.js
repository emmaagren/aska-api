const jwt = require("jsonwebtoken");


// Middleware som kontrollerar användarens JWT-token
const authenticateToken = (req, res, next) => {

    // Hämta token från Authorization-headern
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Kontrollera om token saknas
    if (!token) {
        return res.status(401).json({
            error: "Åtkomst nekad. Ingen token skickades."
        });
    }

    // Verifiera token med vår hemliga nyckel
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({
                error: "Ogiltig eller utgången token."
            });
        }

        // Spara användarinformationen för nästa route
        req.user = user;

        // Fortsätt till nästa funktion
        next();
    });
};

module.exports = authenticateToken;