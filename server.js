const {
  isValidCompany,
  isValidCandidate,
  isValidJobDetails,
  isValidApplication,
} = require("./server-validation.js")
const { Pool } = require("pg")
const express = require("express")
const bcrypt = require("bcryptjs")
const cors = require("cors")
// const { v4: uuidv4 } = require("uuid");

const DBSTRING =
  "postgres://hjtqvwqx:i-lgggJgY-howhBMFWrhsLpMOel53sxn@surus.db.elephantsql.com/hjtqvwqx"

const moreThanMetricsDB = new Pool({ connectionString: DBSTRING })
const PORT = 8080
// const whitelist = ["http://localhost:3000"]
// const corsOptions = {
//   credentials: true, // This is important.
//   origin: (origin, callback) => {
//     if (whitelist.includes(origin)) return callback(null, true)

//     callback(new Error("Not allowed by CORS"))
//   },
// }

const app = express()
app.use(express.json())
// app.use(cors(corsOptions))
app.use(cors())

app.get("/number_of_employees", async (req, res) => {
  const client = await moreThanMetricsDB.connect()
  const getNOECategory = "SELECT * FROM number_of_employees"
  const queryResult = await client.query(getNOECategory)
  const NOECategories = queryResult.rows
  if (NOECategories.length < 1) {
    res.status(500).send("No categories for number of employees!")
  } else {
    res.status(200).send(NOECategories)
  }
  client.release()
})

app.get("/years_in_industry", async (req, res) => {
  const client = await moreThanMetricsDB.connect()
  const getYIICategory = "SELECT * FROM years_in_industry"
  const queryResult = await client.query(getYIICategory)
  const YIICategories = queryResult.rows
  if (YIICategories.length < 1) {
    res.status(500).send("No categories for years in industry!")
  } else {
    res.status(200).send(YIICategories)
  }
  client.release()
})

app.get("/technologies", async (req, res) => {
  const client = await moreThanMetricsDB.connect()
  const getTechnologyCategory = "Select * FROM technologies"
  const queryResult = await client.query(getTechnologyCategory)
  const technologyCategories = queryResult.rows
  if (technologyCategories.length < 1) {
    res.status(500).send("No categories for technologies!")
  } else {
    res.status(200).send(technologyCategories)
  }
  client.release()
})

app.get("/prompts", async (req, res) => {
  const client = await moreThanMetricsDB.connect()
  const getPromptCategory = "Select * FROM prompts"
  const queryResult = await client.query(getPromptCategory)
  const promptsCategories = queryResult.rows
  if (promptsCategories.length < 1) {
    res.status(500).send("No categories for prompts!")
  } else {
    res.status(200).send(promptsCategories)
  }
  client.release()
})

app.get("/company/:companyName", async (req, res) => {
  const client = await moreThanMetricsDB.connect()
  const companyName = req.params.companyName
  const getCompanyDetails =
    "SELECT * FROM companies JOIN number_of_employees ON number_of_employees.number_of_employees_id = companies.number_of_employees_id WHERE company_name = $1"
  const queryResult = client.query(getCompanyDetails, [companyName])
  const companyDetails = (await queryResult).rows
  if (companyDetails.length < 1) {
    res.status(500).send("No company!")
  } else {
    res.status(200).send(companyDetails)
  }
  client.release()
})

app.get("/jobs/company/:companyName", async (req, res) => {
  const client = await moreThanMetricsDB.connect()
  const companyName = req.params.companyName.replaceAll("%20", "")
  const getCompanyJobs =
    "SELECT * FROM jobs JOIN companies ON companies.company_id = jobs.company_id WHERE company_name = $1"
  const queryResult = client.query(getCompanyJobs, [companyName])
  const companyJobs = (await queryResult).rows
  if (companyJobs.length < 1) {
    res.status(500).send("No company jobs!")
  } else {
    res.status(200).send(companyJobs)
  }
  client.release()
})

app.get("/jobs/:search?", async (req, res) => {
  const client = await moreThanMetricsDB.connect()
  let search = req.params.search
  if (search === undefined) {
    search = ""
    const getAllJobs =
      "SELECT job_id, job_title, company_name FROM jobs JOIN companies ON companies.company_id = jobs.company_id ORDER BY job_id"
    const queryResult = await client.query(getAllJobs)
    const jobs = queryResult.rows
    if (jobs.length < 1) {
      res.status(400).send("No results")
    } else {
      res.status(200).send(jobs)
    }
    client.release()
  } else {
    const getJobs =
      "SELECT job_id, job_title, company_name FROM jobs JOIN companies ON companies.company_id = jobs.company_id WHERE LOWER(job_title) LIKE $1 OR LOWER(company_name) LIKE $1 ORDER BY job_id"
    const queryResult = await client.query(getJobs, ["%" + search.toLowerCase() + "%"])
    const jobs = queryResult.rows
    if (jobs.length < 1) {
      res.status(400).send("No results")
    } else {
      res.status(200).send(jobs)
    }
    client.release()
  }
})

app.get("/job/:jobID", async (req, res) => {
  const client = await moreThanMetricsDB.connect()
  let jobID = req.params.jobID
  const getJobDetails =
    "SELECT * , jobs.location FROM jobs JOIN companies ON companies.company_id = jobs.company_id WHERE jobs.job_id = $1"
  const queryResult = await client.query(getJobDetails, [jobID])
  const jobDetails = queryResult.rows
  if (jobDetails.length < 1) {
    res.status(400).send("no such job")
  } else {
    const getResponsibilities = "SELECT responsibility FROM job_responsibilities WHERE job_id = $1"
    const queryResp = await client.query(getResponsibilities, [jobID])
    const respArray = []
    queryResp.rows.forEach(input => {
      respArray.push(input.responsibility)
    })
    jobDetails[0]["responsibilities"] = respArray
    const getTechnologies =
      "SELECT technology_name FROM job_technologies JOIN technologies ON technologies.technology_id = job_technologies.technology_id WHERE job_id = $1"
    const queryTech = await client.query(getTechnologies, [jobID])
    techArray = []
    queryTech.rows.forEach(input => {
      techArray.push(input.technology_name)
    })
    jobDetails[0]["technologies"] = techArray
    res.status(200).send(jobDetails)
  }
  client.release()
})

app.post("/jobs", async (req, res) => {
  const jobDetails = req.body
  const { jobTitle, jobDesc, location, salary, keyResponsibilities, keyTechnologies, companyID } =
    jobDetails
  const validJobDetails = isValidJobDetails(jobDetails)
  if (validJobDetails !== true) {
    return res.status(400).send(validJobDetails)
  }
  const client = await moreThanMetricsDB.connect()
  const insertNewJob =
    "INSERT INTO jobs(job_title, job_description, location, salary, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING job_id"
  const queryResult = await client
    .query(insertNewJob, [jobTitle, jobDesc, location, salary, companyID])
    .catch(error => {
      client.release()
      return res.status(500).send(error)
    })

  let jobID = queryResult.rows[0].job_id
  keyResponsibilities.forEach(responsibility => {
    client
      .query("INSERT INTO job_responsibilities(job_id, responsibility) VALUES ($1, $2)", [
        jobID,
        responsibility,
      ])
      .catch(error => {
        client.release()
        return res.status(500).send(error)
      })
  })

  keyTechnologies.forEach(technologyID => {
    client
      .query("INSERT INTO job_technologies(job_id, technology_id) VALUES ($1, $2)", [
        jobID,
        technologyID,
      ])
      .catch(error => {
        client.release()
        return res.status(500).send(error)
      })
  })
  res.status(200).send("Added all job details")
  client.release()
})

app.get("/applications/review/:jobID", async (req, res) => {
  const client = await moreThanMetricsDB.connect()
  const jobID = req.params.jobID
  const getApplications =
    "SELECT application_status.application_id, prompt, answer FROM application_status JOIN application_responses ON application_responses.application_id = application_status.application_id JOIN prompts ON prompts.prompt_id = application_responses.prompt_id WHERE job_id = $1 AND reviewed = false"
  const queryResult = await client.query(getApplications, [jobID])
  const applicants = queryResult.rows
  if (applicants.length < 1) {
    res.status(400).send("No applicants")
  } else {
    res.status(200).send(applicants)
  }
  client.release()
})

app.get("/applications/accepted/:jobID", async (req, res) => {
  const client = await moreThanMetricsDB.connect()
  const jobID = req.params.jobID
  const getSuccessfulApplicants =
    "SELECT application_id, candidate_name, candidate_phone_number FROM application_status JOIN candidates ON candidates.candidate_id = application_status.candidate_id WHERE job_id = $1 AND reviewed = true AND accepted = true"
  const queryResult = await client.query(getSuccessfulApplicants, [jobID])
  const successfulApplicants = queryResult.rows
  if (successfulApplicants.length < 1) {
    res.status(400).send("No successful applicants")
  } else {
    res.status(200).send(successfulApplicants)
  }
  client.release()
})

app.post("/application", async (req, res) => {
  const applicationDetails = req.body
  const { candidateID, jobID, prompt1, answer1, prompt2, answer2, prompt3, answer3 } =
    applicationDetails
  const validApplicationResponse = isValidApplication(applicationDetails)
  if (validApplicationResponse !== true) {
    return res.status(400).send(validApplicationResponse)
  }
  const client = await moreThanMetricsDB.connect()
  const insertNewApplication =
    "INSERT INTO application_status(reviewed, accepted, candidate_id, job_id) VALUES (false, false, $1, $2) RETURNING application_id"
  const queryResult = await client
    .query(insertNewApplication, [candidateID, jobID])
    .catch(error => {
      client.release()
      return res.status(500).send(error)
    })
  let applicationID = queryResult.rows[0].application_id
  const insertApplicationResponses =
    "INSERT INTO application_responses(application_id, prompt_id, answer) VALUES ($1, $2, $3), ($1, $4 ,$5), ($1, $6, $7)"
  client
    .query(insertApplicationResponses, [
      applicationID,
      prompt1,
      answer1,
      prompt2,
      answer2,
      prompt3,
      answer3,
    ])
    .then(() => {
      res.status(200).send("Added application details!")
    })
    .catch(error => {
      res.status(500).send(error)
    })
  client.release()
})

app.post("/candidate/register", async (req, res) => {
  const candidateDetails = req.body
  const {
    candidateEmail,
    candidatePassword,
    candidateName,
    candidatePhoneNumber,
    yearsInIndustryID,
  } = candidateDetails
  // Checks for duplicate email
  if (await isEmailTaken(candidateEmail)) {
    return res.status(400).send("Email address already taken!")
  }
  // Validating candidate details
  const validCandidateResponse = isValidCandidate(candidateDetails)
  if (validCandidateResponse !== true) {
    return res.status(400).send(validCandidateResponse)
  }
  // Creating new account for candidate
  const newAccountResponse = await insertNewAccount(candidateEmail, candidatePassword, 1)
  if (newAccountResponse !== "Registered new account!") {
    return res.status(500).send(newAccountResponse)
  }
  // Inserting (additional) details for candidate
  const client = await moreThanMetricsDB.connect()
  const accountIDQuery = await client.query(
    "SELECT account_id FROM accounts WHERE account_email = $1",
    [candidateEmail]
  )
  const accountID = accountIDQuery.rows[0].account_id
  const insertCandidateDetails =
    "INSERT INTO candidates (candidate_name, candidate_phone_number, candidate_years_in_industry_id, account_id) VALUES ($1, $2, $3, $4)"
  await client
    .query(insertCandidateDetails, [
      candidateName,
      candidatePhoneNumber,
      yearsInIndustryID,
      accountID,
    ])
    .then(() => {
      res.status(200).send("Added new candidate details!")
    })
    .catch(error => {
      res.status(500).send(error)
    })
  client.release()
})

app.post("/company/register", async (req, res) => {
  const companyDetails = req.body
  const {
    companyEmail,
    companyPassword,
    companyName,
    companyBio,
    companyLocation,
    numberOfEmployeesID,
    femalePercentage,
    retentionRate,
    imageURL,
  } = companyDetails
  // Checks for duplicate email
  if (await isEmailTaken(companyEmail)) {
    return res.status(400).send("Email address already taken!")
  }
  // Validating candidate details
  const validCompanyResponse = isValidCompany(companyDetails)
  if (validCompanyResponse !== true) {
    return res.status(400).send(validCompanyResponse)
  }
  // Creating new account for company
  const newAccountResponse = await insertNewAccount(companyEmail, companyPassword, 2)
  if (newAccountResponse !== "Registered new account!") {
    return res.status(500).send(newAccountResponse)
  }
  // Inserting (additional) details for company
  const client = await moreThanMetricsDB.connect()
  const accountIDQuery = await client.query(
    "SELECT account_id FROM accounts WHERE account_email = $1",
    [companyEmail]
  )
  const accountID = accountIDQuery.rows[0].account_id
  const insertCompanyDetails =
    "INSERT INTO companies (company_name, company_bio, location, company_number_of_employees_id, company_female_employee_percentage, company_retention_rate, image_url, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);"
  await client
    .query(insertCompanyDetails, [
      companyName,
      companyBio,
      companyLocation,
      numberOfEmployeesID,
      femalePercentage,
      retentionRate,
      imageURL,
      accountID,
    ])
    .then(() => {
      res.status(200).send("Added new company details")
    })
    .catch(error => {
      res.status(500).send(error)
    })
  client.release()
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  const client = await moreThanMetricsDB.connect()
  const getAccountLoginInfo =
    "SELECT account_email, account_hashed_password FROM accounts WHERE account_email = $1"
  client
    .query(getAccountLoginInfo, [email])
    .then(async queryResult => {
      const [accountInfo] = queryResult.rows
      if (accountInfo.length === 0) {
        client.release()
        return res.status(400).send("Account does not exist!")
      }
      const hashedPassword = accountInfo.account_hashed_password
      const isPasswordCorrect = await bcrypt.compare(password, hashedPassword)
      if (isPasswordCorrect) {
        res.status(200).send("Successfully logged in!")
      } else {
        res.status(400).send("Password is invalid!")
      }
    })
    .catch(error => {
      res.status(500).send({ error })
    })
  client.release()
})

app.listen(PORT, () => {
  console.log(`Server started!`)
})

async function isEmailTaken(email) {
  const client = await moreThanMetricsDB.connect()
  const emailQuery = await client.query(
    "SELECT account_email FROM accounts WHERE account_email = $1",
    [email]
  )
  client.release()
  if (emailQuery.rows.length >= 1) {
    return true
  }
  return false
}

async function insertNewAccount(email, password, accountType) {
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)
  const client = await moreThanMetricsDB.connect()
  const insertAccount =
    "INSERT INTO accounts (account_email, account_hashed_password, account_type_id) VALUES ($1, $2, $3);"
  let returnMessage = ""
  await client
    .query(insertAccount, [email, hashedPassword, accountType])
    .then(() => {
      returnMessage = "Registered new account!"
    })
    .catch(error => {
      returnMessage = error
    })
  client.release()
  return returnMessage
}
