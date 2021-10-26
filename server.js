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
  const getNOECategory = "SELECT * FROM number_of_employees";
  const queryResult = await client.query(getNOECategory);
  const NOECategories = queryResult.rows;
  if (NOECategories.length < 1) {
    res.status(500).send("No categories for number of employees!");
  } else {
    res.status(200).send(NOECategories);
  }
  client.release();
});

app.get("/years_in_industry", async (req, res) => {
  const client = await moreThanMetricsDB.connect();
  const getYIICategory = "SELECT * FROM years_in_industry";
  const queryResult = await client.query(getYIICategory);
  const YIICategories = queryResult.rows;
  if (YIICategories.length < 1) {
    res.status(500).send("No categories for years in industry!");
  } else {
    res.status(200).send(YIICategories);
  }
  client.release();
});

app.get("/jobs/:search", async (req, res) => {
  const client = await moreThanMetricsDB.connect();
  const search = req.params.search;
  const getJobs = "SELECT * FROM jobs WHERE job_title LIKE '%$1%'";
  const queryResult = await client.query(getJobs, [search]);
  const jobs = queryResult.rows;
  if (jobs.length < 1) {
    res.status(400).send("No results");
  } else {
    res.status(200).send(jobs);
  }
  client.release();
});

app.post("/candidate/register", async (req, res) => {
  const candidateDetails = req.body;
  const {
    candidateEmail,
    candidatePassword,
    candidateName,
    candidatePhoneNumber,
    yearsInIndustryID,
  } = candidateDetails;
  // Checks for duplicate email
  if (await isEmailTaken(candidateEmail)) {
    return res.status(400).send("Email address already taken!");
  }
  // Validating candidate details
  const validCandidateResponse = isValidCandidate(candidateDetails);
  if (validCandidateResponse !== true) {
    return res.status(400).send(validCandidateResponse);
  }
  // Creating new account for candidate
  const newAccountResponse = await insertNewAccount(
    candidateEmail,
    candidatePassword,
    1
  );
  if (newAccountResponse !== "Registered new account!") {
    return res.status(500).send(newAccountResponse);
  }
  // Inserting (additional) details for candidate
  const client = await moreThanMetricsDB.connect();
  const accountIDQuery = await client.query(
    "SELECT account_id FROM accounts WHERE account_email = $1",
    [candidateEmail]
  );
  const accountID = accountIDQuery.rows[0].account_id;
  const insertCandidateDetails =
    "INSERT INTO candidates (candidate_name, candidate_phone_number, candidate_years_in_industry_id, account_id) VALUES ($1, $2, $3, $4)";
  await client
    .query(insertCandidateDetails, [
      candidateName,
      candidatePhoneNumber,
      yearsInIndustryID,
      accountID,
    ])
    .then(() => {
      res.status(200).send("Added new candidate details!");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  client.release();
});

app.post("/company/register", async (req, res) => {
  const companyDetails = req.body;
  const {
    companyEmail,
    companyPassword,
    companyName,
    companyBio,
    numberOfEmployeesID,
    femalePercentage,
    retentionRate,
  } = companyDetails;
  // Checks for duplicate email
  if (await isEmailTaken(companyEmail)) {
    return res.status(400).send("Email address already taken!");
  }
  // Validating candidate details
  const validCompanyResponse = isValidCompany(companyDetails);
  if (validCompanyResponse !== true) {
    return res.status(400).send(validCompanyResponse);
  }
  // Creating new account for company
  const newAccountResponse = await insertNewAccount(
    companyEmail,
    companyPassword,
    2
  );
  if (newAccountResponse !== "Registered new account!") {
    return res.status(500).send(newAccountResponse);
  }
  // Inserting (additional) details for company
  const client = await moreThanMetricsDB.connect();
  const accountIDQuery = await client.query(
    "SELECT account_id FROM accounts WHERE account_email = $1",
    [companyEmail]
  );
  const accountID = accountIDQuery.rows[0].account_id;
  const insertCompanyDetails =
    "INSERT INTO companies (company_name, company_bio, company_number_of_employees_id, company_female_employee_percentage, company_retention_rate, account_id) VALUES ($1, $2, $3, $4, $5, $6);";
  await client
    .query(insertCompanyDetails, [
      companyName,
      companyBio,
      numberOfEmployeesID,
      femalePercentage,
      retentionRate,
      accountID,
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
  const client = await moreThanMetricsDB.connect();
  const getAccountLoginInfo =
    "SELECT account_email, account_hashed_password FROM accounts WHERE account_email = $1";
  client
    .query(getAccountLoginInfo, [email])
    .then(async (queryResult) => {
      const [accountInfo] = queryResult.rows;
      if (accountInfo.length === 0) {
        client.release();
        return res.status(400).send("Account does not exist!");
      }
      const hashedPassword = accountInfo.account_hashed_password;
      const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
      if (isPasswordCorrect) {
        res.status(200).send("Successfully logged in!");
      } else {
        res.status(400).send("Password is invalid!");
      }
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
  client.release();
});

app.listen(PORT, () => {
  console.log(`Server started!`);
});

async function isEmailTaken(email) {
  const client = await moreThanMetricsDB.connect();
  const emailQuery = await client.query(
    "SELECT account_email FROM accounts WHERE account_email = $1",
    [email]
  );
  client.release();
  if (emailQuery.rows.length >= 1) {
    return true;
  }
  return false;
}

async function insertNewAccount(email, password, accountType) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const client = await moreThanMetricsDB.connect();
  const insertAccount =
    "INSERT INTO accounts (account_email, account_hashed_password, account_type_id) VALUES ($1, $2, $3);";
  let returnMessage = "";
  await client
    .query(insertAccount, [email, hashedPassword, accountType])
    .then(() => {
      returnMessage = "Registered new account!";
    })
    .catch((error) => {
      returnMessage = error;
    });
  client.release();
  return returnMessage;
}
