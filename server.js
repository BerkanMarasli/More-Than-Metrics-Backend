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
