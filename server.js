const { isValidCompany, isValidCandidate } = require("./server-validation.js");
const { Pool } = require("pg");
const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
// const { v4: uuidv4 } = require("uuid");

const DBSTRING =
  "postgres://hjtqvwqx:i-lgggJgY-howhBMFWrhsLpMOel53sxn@surus.db.elephantsql.com/hjtqvwqx";

const moreThanMetricsDB = new Pool({ connectionString: DBSTRING });
const PORT = 8080;
// const whitelist = ["http://localhost:3000"]
// const corsOptions = {
//   credentials: true, // This is important.
//   origin: (origin, callback) => {
//     if (whitelist.includes(origin)) return callback(null, true)

//     callback(new Error("Not allowed by CORS"))
//   },
// }

const app = express();
app.use(express.json());
// app.use(cors(corsOptions))
app.use(cors());

app.get("/number_of_employees", async (req, res) => {
  const client = await moreThanMetricsDB.connect();
  const getNOEsCategory = "SELECT * FROM number_of_employees";
  const queryResult = client.query(getNOEsCategory);
  res.status(200).send(queryResult.rows);
  client.release();
});

app.get("/years_in_industry", async (req, res) => {
  const client = await moreThanMetricsDB.connect();
  const getYIICategory = "SELECT * FROM years_in_industry";
  const queryResult = client.query(getYIICategory);
  res.status(200).send(queryResult.rows);
  client.release();
});

app.post("/candidate/register", async (req, res) => {
  const {
    candidate_email,
    candidate_password,
    candidate_password_confirmation,
    candidate_name,
    candidate_phone,
    years_in_industry_id,
  } = req.body;
  const candidateDetails = [
    candidate_email,
    candidate_password,
    candidate_password_confirmation,
    candidate_name,
    candidate_phone,
    years_in_industry_id,
  ];
  if (await isEmailTaken(candidate_email)) {
    return res.status(400).send("Email address already taken");
  }
  //Validate the inputs
  //   if (!isValidEmail(candidate_email)) {
  //     return res.status(400).send("Email isn't a valid email");
  //   }
  //   if (candidate_password !== candidate_password_confirmation) {
  //     return res
  //       .status(400)
  //       .send("Confirmation password isn't the same as the password");
  //   }
  //   if (!isValidPassword(candidate_password)) {
  //     return res
  //       .status(400)
  //       .send("Password isn't valid, it doesn't contain the necessary values");
  //   }
  if (!isValidCandidate(candidateDetails, res)) {
    return res.status(400).send("Invalid input");
  }
  //Creating the base account details
  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(candidate_password, salt);
  //   const insertNewCandidate =
  //     "INSERT INTO accounts (email, password, account_type) VALUES ($1, $2,0);";
  //   client
  //     .query(insertNewCandidate, [candidate_email, hashedPassword])
  //     .then(() => {
  //       res.status(200).send("Registered new candidate");
  //     })
  //     .catch((error) => {
  //       res.status(500).send(error);
  //     });
  await insertNewAccount(candidate_email, candidate_password, 0, res);
  const client = await moreThanMetricsDB.connect();
  const accountId = client.query(
    "SELECT account_id FROM accounts WHERE email = $1",
    [candidate_email]
  );
  const insertCandidateDetails =
    "INSERT INTO candidates (account_id, name, phone_number, years_in_industry) VALUES ($1, $2, $3, $4)";
  client
    .query(insertCandidateDetails, [
      accountId,
      candidate_name,
      candidate_phone,
      years_in_industry_id,
    ])
    .then(() => {
      res.status(200).send("Added new candidate details");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  client.release();
});

app.post("/company/register", async (req, res) => {
  const {
    company_email,
    company_password,
    company_password_confirmation,
    company_name,
    company_bio,
    number_of_employees_id,
    female_percentage,
    retention_rate,
  } = req.body;
  const companyDetails = [
    company_email,
    company_password,
    company_password_confirmation,
    company_name,
    company_bio,
    number_of_employees_id,
    female_percentage,
    retention_rate,
  ];
  if (await isEmailTaken(company_email)) {
    return res.status(400).send("Email address already taken");
  }
  //Validation of the inputs
  //   if (!isValidEmail(company_email)) {
  //     return res.status(400).send("Email isn't a valid email");
  //   }
  //   if (company_password !== company_password_confirmation) {
  //     return res
  //       .status(400)
  //       .send("Confirmation password isn't the same as the password");
  //   }
  //   if (!isValidPassword(company_password)) {
  //     return res
  //       .status(400)
  //       .send("Password isn't valid, it doesn't contain the necessary values");
  //   }
  //   if (company_name.length < 1) {
  //     return res.status(400).send("No Company name inserted");
  //   }
  //   if (number_of_employees_id === undefined || number_of_employees_id === null) {
  //     return res.status(400).send("Number of employees not specified");
  //   }
  //   if (female_percentage === undefined || female_percentage === null) {
  //     return res.status(400).send("Female percentage not specified");
  //   }
  //   if (retention_rate === undefined || retention_rate === null) {
  //     return res.status(400).send("Retention rate not specified");
  //   }

  if (!isValidCompany(companyDetails, res)) {
    return res.status(400).send("Invalid input");
  }

  //Creating the base account details
  //   const salt = await bcrypt.genSalt();
  //   const hashedPassword = await bcrypt.hash(company_password, salt);
  //   const insertNewCompany =
  //     "INSERT INTO accounts (email, password, account_type) VALUES ($1, $2, 1);";
  //   client
  //     .query(insertNewCompany, [company_email, hashedPassword])
  //     .then(() => {
  //       res.status(200).send("Registered new company");
  //     })
  //     .catch((error) => {
  //       res.status(500).send(error);
  //     });
  //   client.release();
  await insertNewAccount(company_email, company_password, 1, res);
  const client = await moreThanMetricsDB.connect();
  const accountId = client.query(
    "SELECT account_id FROM accounts WHERE email = $1",
    [company_email]
  );
  const insertCompanyDetails =
    "INSERT INTO companies (account_id, name, bio, number_of_employees, female_percentage, retention_rate) VALUES ($1,$2,$3,$4,$5,$6);";
  client
    .query(insertCompanyDetails, [
      accountId,
      company_name,
      company_bio,
      number_of_employees_id,
      female_percentage,
      retention_rate,
    ])
    .then(() => {
      res.status(200).send("Added new company details");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  client.release();
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await logInToAccount(email, password, res);
});

// app.post("/company/login", async (req, res) => {
//   const { company_email, company_password } = req.body;
//     const client = await moreThanMetricsDB.connect();
//     const getCompanyLoginInfo =
//       "SELECT company_email, company_hashed_password FROM companies WHERE company_email = $1";
//     client
//       .query(getCompanyLoginInfo, [company_email])
//       .then(async (queryResult) => {
//         const [companyInfo] = queryResult.rows;
//         if (companyInfo.length === 0) {
//           client.release();
//           return res.status(400).send("Company does not exist");
//         }
//         const hashedPassword = companyInfo.company_hashed_password;
//         const isPasswordValid = await bcrypt.compare(
//           company_password,
//           hashedPassword
//         );
//         if (isPasswordValid) {
//           res.status(200).send("Successfully logged in");
//         } else {
//           res.status(400).send("Password is invalid");
//         }
//       })
//       .catch((error) => {
//         res.status(500).send({ error });
//       });
//     client.release();
// });
app.listen(PORT, () => {
  console.log(`Server started!`);
});

async function insertNewAccount(email, password, accountType, res) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const client = await moreThanMetricsDB.connect();
  const insertNewCompany =
    "INSERT INTO accounts (email, password, account_type) VALUES ($1, $2, $3);";
  client
    .query(insertNewCompany, [email, hashedPassword, accountType])
    .then(() => {
      res.status(200).send("Registered new account");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  client.release();
}

async function logInToAccount(email, password, res) {
  const client = await moreThanMetricsDB.connect();
  const getAccountLoginInfo =
    "SELECT email, password FROM accounts WHERE email = $1";
  client
    .query(getCandidateLoginInfo, [email])
    .then(async (queryResult) => {
      const [accountInfo] = queryResult.rows;
      if (accountInfo.length === 0) {
        client.release();
        return res.status(400).send("Account does not exist");
      }
      //Not sure fully what the second half of this line 100% does
      // const hashedPassword = candidateInfo.candidate_hashed_password;
      const hashedPassword = accountInfo.password;
      const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
      if (isPasswordCorrect) {
        res.status(200).send("Successfully logged in");
      } else {
        res.status(400).send("Password is invalid");
      }
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
  client.release();
}

async function isEmailTaken(email) {
  const client = await moreThanMetricsDB.connect();
  const getEmail = client.query("SELECT email FROM accounts WHERE email = $1", [
    email,
  ]);
  client.release();
  if (getEmail.length > 0) {
    return true;
  }
  return false;
}
