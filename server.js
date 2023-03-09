const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const database = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "smart-brain",
  },
});
const signin = require("./controllers/signin");
const register = require("./controllers/register");
const image = require("./controllers/image");

const app = express();
const port = 3000;
const saltRounds = 10; // For hashing

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- Knexjs connectivity ---
console.log(
  `--- Checking if knex is connecting to database ---`,
  database.client.config
);

// --- Accessing base URL ---
app.get("/", (req, res) => {
  database
    .select("*")
    .from("users")
    .then((data) => res.send(data));
});

// --- User sign-in ---
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, database, bcrypt);
});

// --- New user registeration ---
app.post("/register", (req, res) => {
  register.handleRegister(req, res, database, bcrypt, saltRounds);
});

// --- Get user profile details ---
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  database("users")
    .where({ id: id })
    .then((data) => {
      if (data[0].id === Number(id)) {
        return res.json({
          ...data[0],
          message: "Profile loaded successfully.",
        });
      }
    })
    .catch((err) =>
      res.status(404).json({ status: "User not found.", message: err })
    );
});

// --- Identify image on submission ---
app.post("/identify-image", (req, res) => {
  image.handleImageIdentification(req, res);
});

// --- Updating entries when image is submitted for recognition ---
app.put("/image", (req, res) => {
  const { id } = req.body;

  database("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("*")
    .then((data) => {
      if (data.length != 0) {
        res.status(201).json({ message: "User entry updated.", ...data[0] });
      } else {
        throw new Error("Entry not updated.");
      }
    })
    .catch((err) =>
      res.json({
        status: "Incorrect parameters.",
        message: "Please provide correct input.",
      })
    );
});

// --- App is listening to port here ---
app.listen(port, () => {
  console.log(`--- CORS-enabled web server listening on port ${port} ---`);
  console.log(process.env.PORT);
});
