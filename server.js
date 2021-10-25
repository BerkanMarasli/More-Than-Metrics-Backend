const { Pool } = require("pg");
const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const DBSTRING =
  "postgres://hjtqvwqx:i-lgggJgY-howhBMFWrhsLpMOel53sxn@surus.db.elephantsql.com/hjtqvwqx";

const moreThanMetricsDB = new Pool({ connectionString: DBSTRING });

const whitelist = ["http://localhost:3000"];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) return callback(null, true);

    callback(new Error("Not allowed by CORS"));
  },
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.post("/candidate/register", async (req, res) => {
  const { email, password, confirmation } = req.body;
  if (!isValidEmail(email)) {
    return res.status(400).send("Email isn't a valid email");
  }
  if (password !== confirmation) {
    return res
      .status(400)
      .send("Confirmation password isn't the same as the password");
  }
  if (isValidPassword(password)) {
    return res
      .status(400)
      .send("Password isn't valid, it doesn't contain the necessary values");
  }
  const salt = await bcrypt.genSalt();
  const hashedPw = await bcrypt.hash(password, salt);
  const client = await moreThanMetricsDB.connect();
  const registerUserQuery =
    "INSERT INTO candidates (candidate_email, candidate_hashed_password) VALUES ('$1', '$2');";
  client
    .query(registerUserQuery, [email, hashedPw])
    .then(() => {
      res.status(200).send("Registered new candidate");
    })
    .catch((error) => {
      res.status(500).send(error);
    })
    .release();
});

function isValidEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isValidPassword(password) {
  const digitRegex = /\d/;
  const lowerCaseRegex = /[a-z]/;
  const upperCaseRegex = /[A-Z]/;
  const symbolRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return (
    password.length >= 8 &&
    digitRegex.test(password) &&
    lowerCaseRegex.test(password) &&
    upperCaseRegex.test(password) &&
    symbolRegex.test(password)
  );
}
