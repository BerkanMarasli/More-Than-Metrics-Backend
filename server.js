const {
    isValidCompany,
    isValidCandidate,
    isValidJobDetails,
    isValidCandidateUpdate,
    isValidCompanyUpdate,
} = require("./server-logic/server-validation.js")
const {
    isEmailTaken,
    isUpdatedEmailTaken,
    updateAccount,
    insertNewAccount,
    getNumberOfEmployees,
    getYearsInIndustry,
    getAllTechnologies,
    getPrompts,
} = require("./server-logic/server-logic.js")
const { Pool } = require("pg")
const express = require("express")
const bcrypt = require("bcryptjs")
const cors = require("cors")
const {
    getCompanyForCandidate,
    getCompanyJobsForCandidate,
    searchAllJobs,
    getJobForCandidate,
    getCandidatesApplications,
    postNewApplication,
    getCandidateProfile,
} = require("./server-logic/candidate-logic.js")
// const { v4: uuidv4 } = require("uuid");

const DBSTRING = "postgres://hjtqvwqx:i-lgggJgY-howhBMFWrhsLpMOel53sxn@surus.db.elephantsql.com/hjtqvwqx"

const moreThanMetricsDB = new Pool({ connectionString: DBSTRING })
exports.moreThanMetricsDB = moreThanMetricsDB
const PORT = 8080
// const whitelist = ["http://localhost:3000", "http://localhost:8080"]
// const corsOptions = {
//     credentials: true, // This is important.
//     origin: (origin, callback) => {
//         if (whitelist.includes(origin)) return callback(null, true)

//         callback(new Error("Not allowed by CORS"))
//     },
//     // methods: ["GET", "PUT", "POST"],
// }

const app = express()
app.use(express.json())
// app.use(cors(corsOptions))
app.use(cors())
// app.options("*", cors())

app.get("/number_of_employees", async (req, res) => getNumberOfEmployees(res, moreThanMetricsDB))
app.get("/years_in_industry", async (req, res) => getYearsInIndustry(res, moreThanMetricsDB))
app.get("/technologies", async (req, res) => getAllTechnologies(res, moreThanMetricsDB))
app.get("/prompts", async (req, res) => getPrompts(res, moreThanMetricsDB))

//for candidate
app.get("/company/:companyName", async (req, res) => getCompanyForCandidate(req, res, moreThanMetricsDB))

//for candidate
app.get("/jobs/company/:companyName", async (req, res) => getCompanyJobsForCandidate(req, res, moreThanMetricsDB))

//for candidate
app.get("/jobs/:search?", async (req, res) => searchAllJobs(req, res, moreThanMetricsDB))

//for candidate
app.get("/job/:jobID", async (req, res) => getJobForCandidate(req, res, moreThanMetricsDB))

//for Company
app.post("/jobs", async (req, res) => postNewJob(req, res, moreThanMetricsDB))

async function postNewJob(req, res, moreThanMetricsDB) {
    const jobDetails = req.body
    const { jobTitle, jobDesc, location, salary, keyResponsibilities, keyTechnologies, companyID } = jobDetails
    const validJobDetails = isValidJobDetails(jobDetails)
    if (validJobDetails !== true) {
        return res.status(400).send(validJobDetails)
    }
    const client = await moreThanMetricsDB.connect()
    const insertNewJob = "INSERT INTO jobs(job_title, job_description, location, salary, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING job_id"
    const queryResult = await client.query(insertNewJob, [jobTitle, jobDesc, location, salary, companyID]).catch((error) => {
        client.release()
        return res.status(500).send(error)
    })

    let jobID = queryResult.rows[0].job_id
    keyResponsibilities.forEach((responsibility) => {
        client.query("INSERT INTO job_responsibilities(job_id, responsibility) VALUES ($1, $2)", [jobID, responsibility]).catch((error) => {
            client.release()
            return res.status(500).send(error)
        })
    })

    keyTechnologies.forEach((technologyID) => {
        client.query("INSERT INTO job_technologies(job_id, technology_id) VALUES ($1, $2)", [jobID, technologyID]).catch((error) => {
            client.release()
            return res.status(500).send(error)
        })
    })
    res.status(200).send("Added all job details")
    client.release()
}

//for candidate
app.get("/applications/candidate/:candidateID", async (req, res) => getCandidatesApplications(req, res, moreThanMetricsDB))

//for Company
app.get("/company/stats/:companyID", async (req, res) => getCompanyStats(req, res, moreThanMetricsDB))

async function getCompanyStats(req, res, moreThanMetricsDB) {
    const companyID = req.params.companyID
    const getNoOfApplications =
        "SELECT COUNT(application_id) FROM application_status JOIN jobs ON application_status.job_id = jobs.job_id JOIN companies ON jobs.company_id = companies.company_id WHERE jobs.company_id = $1"
    const client = await moreThanMetricsDB.connect()
    const queryResult = await client.query(getNoOfApplications, [companyID])
    const noOfApplications = queryResult.rows[0].count
    client.release()
    res.status(200).send(noOfApplications)
    return noOfApplications
}

//for Company
app.get("/job/stats/:jobID", async (req, res) => getJobStats(req, res, moreThanMetricsDB))

async function getJobStats(req, res, moreThanMetricsDB) {
    const jobID = req.params.jobID
    const getNoOfApplications = "SELECT COUNT(application_id) FROM application_status WHERE job_id = $1"
    const client = await moreThanMetricsDB.connect()
    const queryResult = await client.query(getNoOfApplications, [jobID])
    const noOfApplications = queryResult.rows[0].count
    client.release()
    res.status(200).send(noOfApplications)
    return noOfApplications
}

//for Company
app.get("/applications/review/:jobID", async (req, res) => reviewApplication(req, res, moreThanMetricsDB))

async function reviewApplication(req, res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const jobID = req.params.jobID
    const getApplications =
        "SELECT application_id, application_status.candidate_id, headline, years_in_industry.category FROM application_status JOIN candidates ON candidates.candidate_id = application_status.candidate_id JOIN years_in_industry ON candidates.candidate_years_in_industry_id = years_in_industry_id WHERE job_id = $1 AND reviewed = false"
    const queryResult = await client.query(getApplications, [jobID])
    const applicants = queryResult.rows
    if (applicants.length < 1) {
        res.status(400).send("No applicants")
    } else {
        for (let i = 0; i < applicants.length; i++) {
            console.log(applicants[i])
            const getResponses =
                "SELECT prompt, answer FROM application_responses JOIN prompts ON prompts.prompt_id = application_responses.prompt_id WHERE application_id = $1"
            const responsesQuery = await client.query(getResponses, [applicants[i].application_id])
            const responses = responsesQuery.rows
            for (let j = 0; j < responses.length; j++) {
                const promptKey = "prompt" + (j + 1)
                const answerKey = "answer" + (j + 1)
                applicants[i] = {
                    ...applicants[i],
                    [promptKey]: responses[j].prompt,
                    [answerKey]: responses[j].answer,
                }
            }
            console.log("applicant " + applicants[i].candidate_id)
            const getTechnologies =
                "SELECT * FROM candidates_technologies JOIN technologies ON technologies.technology_id = candidates_technologies.technology_id WHERE candidate_id = $1"
            const techArray = []
            const techQuery = await client.query(getTechnologies, [applicants[i].candidate_id])
            techQuery.rows.forEach((technology) => {
                techArray.push(technology.technology_name)
            })
            console.log(techArray)
            applicants[i]["technologies"] = techArray
        }
        res.status(200).send(applicants)
    }
    client.release()
}

//for Company
app.patch("/applications/assess", async (req, res) => acceptApplication(req, res, moreThanMetricsDB))

async function acceptApplication(req, res, moreThanMetricsDB) {
    const { accepted, applicationID } = req.body
    if (typeof accepted !== "boolean") {
        return res.status(400).send("Passing wrong type of value")
    }
    const client = await moreThanMetricsDB.connect()
    const updateApplication = "UPDATE application_status SET reviewed = true, accepted = $1 WHERE application_id = $2"
    client
        .query(updateApplication, [accepted, applicationID])
        .then(() => {
            res.status(200).send("Application updated")
        })
        .catch((error) => {
            res.status(500).send(error)
        })
    client.release()
}

//for Company
app.get("/applications/accepted/:jobID", async (req, res) => getAcceptedApplications(req, res, moreThanMetricsDB))

async function getAcceptedApplications(req, res, moreThanMetricsDB) {
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
}

//for candidate
app.post("/application", async (req, res) => postNewApplication(req, res, moreThanMetricsDB))

//for candidate
app.get("/candidate/information/:candidateID", async (req, res) => getCandidateProfile(req, res, moreThanMetricsDB))

//for candidate
app.post("/candidate/register", async (req, res) => registerNewCandidate(req, res, moreThanMetricsDB))

async function registerNewCandidate(req, res, moreThanMetricsDB) {
    const candidateDetails = req.body
    const { candidateEmail, candidatePassword, candidateName, headline, candidatePhoneNumber, yearsInIndustryID, technologies } = candidateDetails
    // Checks for duplicate email
    if (await isEmailTaken(candidateEmail, moreThanMetricsDB)) {
        return res.status(400).send("Email address already taken!")
    }
    // Validating candidate details
    const validCandidateResponse = isValidCandidate(candidateDetails)
    if (validCandidateResponse !== true) {
        return res.status(400).send(validCandidateResponse)
    }
    // Creating new account for candidate
    const newAccountResponse = await insertNewAccount(candidateEmail, candidatePassword, 1, moreThanMetricsDB)
    if (newAccountResponse !== "Registered new account!") {
        return res.status(500).send(newAccountResponse)
    }
    // Inserting (additional) details for candidate
    const client = await moreThanMetricsDB.connect()
    const accountIDQuery = await client.query("SELECT account_id FROM accounts WHERE account_email = $1", [candidateEmail])
    const accountID = accountIDQuery.rows[0].account_id
    const insertCandidateDetails =
        "INSERT INTO candidates (candidate_name, headline, candidate_phone_number, candidate_years_in_industry_id, account_id) VALUES ($1, $2, $3, $4, $5) RETURNING candidate_id"
    const queryResult = await client
        .query(insertCandidateDetails, [candidateName, headline, candidatePhoneNumber, yearsInIndustryID, accountID])
        .catch((error) => {
            client.release()
            return res.status(500).send(error)
        })
    const candidateID = queryResult.rows[0].candidate_id
    console.log(candidateID)
    console.log(technologies)
    for (let technology of technologies) {
        client
            .query("INSERT INTO candidates_technologies(candidate_id, technology_id) VALUES ($1, $2);", [candidateID, technology])
            .catch((error) => {
                client.release()
                return res.status(500).send(error)
            })
    }
    res.status(200).send("Added candidate details")
    client.release()
}

//for candidate
app.put("/candidate/update", async (req, res) => updateCandidateDetails(req, res, moreThanMetricsDB))

async function updateCandidateDetails(req, res, moreThanMetricsDB) {
    const updatedDetails = req.body
    const { accountID, candidateEmail, candidatePassword, candidateName, headline, candidatePhoneNumber, yearsInIndustryID } = updatedDetails
    // Checks for duplicate email
    if (await isUpdatedEmailTaken(candidateEmail, accountID, moreThanMetricsDB)) {
        return res.status(400).send("Email address already taken!")
    }
    // Validating candidate details
    const validUpdateResponse = isValidCandidateUpdate(updatedDetails)
    if (validUpdateResponse !== true) {
        return res.status(400).send(validUpdateResponse)
    }
    // Updating account for candidate
    const updateResponse = await updateAccount(accountID, candidateEmail, candidatePassword, moreThanMetricsDB)
    if (updateResponse !== true) {
        return res.status(500).send(updateResponse)
    }
    // Updating (additional) details for candidate
    const client = await moreThanMetricsDB.connect()
    const updateCandidateDetails =
        "UPDATE candidates SET candidate_name = $1, headline = $2, candidate_phone_number = $3, candidate_years_in_industry_id = $4 WHERE account_id = $5"
    client
        .query(updateCandidateDetails, [candidateName, headline, candidatePhoneNumber, yearsInIndustryID, accountID])
        .then(() => {
            res.status(200).send("Updated candidate details!")
        })
        .catch((error) => {
            res.status(500).send(error)
        })
    client.release()
}

// for Company
app.get("/company/information/:companyID", async (req, res) => getCompanyProfile(req, res, moreThanMetricsDB))

async function getCompanyProfile(req, res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const companyID = req.params.companyID
    const getCompanyInfo =
        "SELECT company_name, company_bio, location, number_of_employees.category, company_female_employee_percentage, company_retention_rate, image_url, account_email FROM companies JOIN accounts ON accounts.account_id = companies.account_id JOIN number_of_employees ON number_of_employees.number_of_employees_id = companies.company_number_of_employees_id WHERE company_id = $1"
    const queryResult = await client.query(getCompanyInfo, [companyID])
    const companyInfo = queryResult.rows
    if (companyInfo.length < 1) {
        client.release()
        return res.status(500).send("No company found")
    }
    res.status(200).send(companyInfo)
    client.release()
}

//for Company
app.post("/company/register", async (req, res) => registerNewCompany(req, res, moreThanMetricsDB))

async function registerNewCompany(req, res, moreThanMetricsDB) {
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
    if (await isEmailTaken(companyEmail, moreThanMetricsDB)) {
        return res.status(400).send("Email address already taken!")
    }
    // Validating candidate details
    const validCompanyResponse = isValidCompany(companyDetails)
    if (validCompanyResponse !== true) {
        return res.status(400).send(validCompanyResponse)
    }
    // Creating new account for company
    const newAccountResponse = await insertNewAccount(companyEmail, companyPassword, 2, moreThanMetricsDB)
    if (newAccountResponse !== "Registered new account!") {
        return res.status(500).send(newAccountResponse)
    }
    // Inserting (additional) details for company
    const client = await moreThanMetricsDB.connect()
    const accountIDQuery = await client.query("SELECT account_id FROM accounts WHERE account_email = $1", [companyEmail])
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
        .catch((error) => {
            res.status(500).send(error)
        })
    client.release()
}

//for Company
app.put("/company/update", async (req, res) => updateCompanyDetails(req, res, moreThanMetricsDB))

async function updateCompanyDetails(req, res, moreThanMetricsDB) {
    const updatedDetails = req.body
    const {
        accountID,
        companyEmail,
        companyPassword,
        companyName,
        companyBio,
        companyLocation,
        numberOfEmployeesID,
        femalePercentage,
        retentionRate,
        imageURL,
    } = updatedDetails
    // Checks for duplicate email
    if (await isUpdatedEmailTaken(companyEmail, accountID, moreThanMetricsDB)) {
        return res.status(400).send("Email address already taken!")
    }
    // Validating company details
    const validUpdateResponse = isValidCompanyUpdate(updatedDetails)
    if (validUpdateResponse !== true) {
        return res.status(400).send(validUpdateResponse)
    }
    // Updating account for company
    const updateResponse = await updateAccount(accountID, companyEmail, companyPassword, moreThanMetricsDB)
    if (updateResponse !== true) {
        return res.status(500).send(updateResponse)
    }
    // Updating (additional) details for company
    const client = await moreThanMetricsDB.connect()
    const updateCandidateDetails =
        "UPDATE companies SET company_name = $1, company_bio = $2, location = $3, company_number_of_employees_id = $4, company_female_employee_percentage = $5, company_retention_rate = $6 , image_url = $7 WHERE account_id = $8;"
    client
        .query(updateCandidateDetails, [
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
            res.status(200).send("Updated company details!")
        })
        .catch((error) => {
            res.status(500).send(error)
        })
    client.release()
}

//for Both
app.post("/login", async (req, res) => loginUser(req, res, moreThanMetricsDB))

async function loginUser(req, res, moreThanMetricsDB) {
    const { email, password } = req.body
    const client = await moreThanMetricsDB.connect()
    const getAccountLoginInfo =
        "SELECT account_id, account_email, account_hashed_password, account_type_category FROM accounts JOIN account_type ON accounts.account_type_id = account_type.account_type_id WHERE account_email = $1"
    client
        .query(getAccountLoginInfo, [email])
        .then(async (queryResult) => {
            const [accountInfo] = queryResult.rows
            if (!queryResult.rowCount && !(await isEmailTaken(email, moreThanMetricsDB))) {
                client.release()
                return res.status(400).send({ message: "Account does not exist!" })
            }
            const hashedPassword = accountInfo.account_hashed_password
            const isPasswordCorrect = await bcrypt.compare(password, hashedPassword)
            if (isPasswordCorrect) {
                let typeID
                let url
                if (accountInfo.account_type_category === "company") {
                    const getTypeID = await client.query("SELECT company_id FROM companies WHERE account_id = $1", [accountInfo.account_id])
                    typeID = getTypeID.rows[0].company_id
                    url = "http://localhost:3000/dashboard"
                } else {
                    const getTypeID = await client.query("SELECT candidate_id FROM candidates WHERE account_id = $1", [accountInfo.account_id])
                    typeID = getTypeID.rows[0].candidate_id
                    url = "http://localhost:3000/jobs"
                }
                res.status(200).send({ message: "Successfully logged in!", type: accountInfo.account_type_category, typeID: typeID, url: url })
            } else {
                res.status(400).send({ message: "Password is invalid!" })
            }
        })
        .catch((error) => {
            res.status(500).send({ message: error })
        })
    client.release()
}

app.listen(PORT, () => {
    console.log(`Server started!`)
})
