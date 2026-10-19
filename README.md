# Restaurang ASKA – Backend

Backend-API utvecklat med Node.js, Express och MongoDB Atlas som en del av projektuppgiften i kursen Backend-baserad webbutveckling vid Mittuniversitetet.

## Beskrivning

API:et fungerar som backend till den fiktiva restaurangwebbplatsen Restaurang ASKA.

Det hanterar restaurangens meny och gör det möjligt att hämta, lägga till, redigera och radera maträtter.

Menyn är tillgänglig för alla besökare, medan ändringar kräver att en administratör loggar in. Autentisering sker med JSON Web Token (JWT).

Administratörens lösenord lagras hashat med bcrypt i databasen.

## Tekniker

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- bcrypt
- JSON Web Token (JWT)
- dotenv
- CORS

## Installation

1. Klona projektet från GitHub.
2. Installera beroenden:

   `npm install`

3. Skapa en `.env`-fil i projektets rotmapp med följande miljövariabler:

   ```env
   MONGODB_URI=din_mongodb_anslutningsstrang
   JWT_SECRET=din_hemliga_nyckel
   PORT=3000
   ```

4. Starta servern:

   `npm start`

Backend-API:et körs då lokalt på `http://localhost:3000`, förutsatt att port 3000 används.

## API-endpoints

### Hämta menyn

**GET `/api/menu`**

Hämtar restaurangens maträtter från databasen.

Endpointen är publik och kräver ingen inloggning.

### Logga in som administratör

**POST `/api/auth/login`**

Kontrollerar administratörens inloggningsuppgifter och returnerar en JWT-token vid lyckad inloggning.

Exempel på JSON-data:

```json
{
  "username": "admin",
  "password": "ditt_losenord"
}
```

JWT-token används för att komma åt skyddade endpoints.

### Lägg till maträtt

**POST `/api/menu`**

Skapar en ny maträtt i databasen.

Kräver JWT-token i HTTP-headern:

`Authorization: Bearer DIN_TOKEN`

### Redigera maträtt

**PUT `/api/menu/:id`**

Uppdaterar en befintlig maträtt med angivet ID.

Kräver JWT-token i HTTP-headern.

### Radera maträtt

**DELETE `/api/menu/:id`**

Raderar en maträtt med angivet ID.

Kräver JWT-token i HTTP-headern.

## Säkerhet

- Administratörens lösenord lagras hashat med bcrypt.
- JWT används för autentisering.
- Middleware verifierar JWT innan skyddade endpoints kan användas.
- Besökare kan läsa menyn utan inloggning.
- Endast autentiserade administratörer kan lägga till, redigera och radera maträtter.
- Hemliga miljövariabler lagras i `.env`, som inte ska publiceras på GitHub.

## Statuskoder

| Statuskod | Betydelse |
|---|---|
| 200 | Begäran lyckades |
| 201 | Resurs skapades |
| 400 | Ogiltiga inmatningsuppgifter |
| 401 | Inloggning misslyckades eller autentisering saknas |
| 403 | Åtkomst nekad |
| 404 | Resursen hittades inte |
| 500 | Serverfel |

## Testning

API:et har testats lokalt tillsammans med frontend.

Anslutningen till MongoDB Atlas, hämtning av menyn, administratörsinloggning och hantering av maträtter har kontrollerats.

## Publicering

Backend-API:et publiceras separat från frontend.

Länken till det publicerade API:et läggs till när publiceringen är klar.

## Kurs

Backend-baserad webbutveckling – Projektuppgift.

## Skapad av

Emma Ågren, student vid Mittuniversitetet.