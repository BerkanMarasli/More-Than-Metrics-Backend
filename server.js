const { Pool } = require("pg");
const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

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


app.post("/login", async (req, res) => {
  const { email, password } = req.body

  const client = await usersPool.connect()
  const getAllData = "SELECT user_id, hashed_password FROM users WHERE email = $1"
  client
    .query(getAllData, [email])
    .then(async queryResult => {
      const [userInfo] = queryResult.rows
      if (userInfo.length === 0) {
        return res.status(400).send("Email is invalid")
      }
      const hashedPass = userInfo.hashed_password
      const userID = userInfo.user_id
      const passwordsAreEqual = await bcrypt.compare(password, hashedPass)
      if (passwordsAreEqual) {
        const newSessionID = uuidv4()
        client.query("INSERT INTO sessions (uuid, user_id) VALUES ($1, $2)", [newSessionID, userID])
        res
          .cookie("worldBankAppSessionID", newSessionID, {
            maxAge: 120000,
          })
          .status(200)
          .send("success")
      } else {
        res.status(400).send("Password is invalid")
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).send({ error })
    })
  client.release()
})