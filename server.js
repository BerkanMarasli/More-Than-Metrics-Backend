const { getNumberOfEmployees, getYearsInIndustry, getAllTechnologies, getPrompts } = require("./server-logic/server-logic.js")
const {
    getCompanyForCandidate,
    getCompanyJobsForCandidate,
    searchAllJobs,
    getJobForCandidate,
    getCandidatesApplications,
    postNewApplication,
    getCandidateProfile,
} = require("./server-logic/candidate-logic.js")
const {
    postNewJob,
    getCompanyStats,
    getJobStats,
    reviewApplication,
    acceptApplication,
    getAcceptedApplications,
    getCompanyProfile,
    getCompanyJobs,
} = require("./server-logic/company-logic.js")
const {
    registerNewCandidate,
    updateCandidateDetails,
    registerNewCompany,
    loginUser,
    updateCompanyDetails,
    logoutUser,
} = require("./server-logic/account-logic.js")
const { Pool } = require("pg")
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
// const { v4: uuidv4 } = require("uuid");

const DBSTRING = "postgres://hjtqvwqx:i-lgggJgY-howhBMFWrhsLpMOel53sxn@surus.db.elephantsql.com/hjtqvwqx"

const moreThanMetricsDB = new Pool({ connectionString: DBSTRING })

const PORT = 8080
// const whitelist = ["http://localhost:3000", "http://localhost:8080", "localhost:3000", "localhost:8080"]
// const corsOptions = {
//     credentials: true, // This is important.
//     origin: (origin, callback) => {
//         if (whitelist.includes(origin)) return callback(null, true)

//         callback(new Error("Not allowed by CORS"))
//     },
//     optionsSuccessStatus: 200,
// }

const app = express()
app.use(express.json())
// app.use(cors(corsOptions))
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
// app.use(cors())
app.use(cookieParser())

//Database endpoints
app.get("/number_of_employees", async (req, res) => getNumberOfEmployees(res, moreThanMetricsDB))
app.get("/years_in_industry", async (req, res) => getYearsInIndustry(res, moreThanMetricsDB))
app.get("/technologies", async (req, res) => getAllTechnologies(res, moreThanMetricsDB))
app.get("/prompts", async (req, res) => getPrompts(res, moreThanMetricsDB))

//Candidate endpoints
app.get("/company/:companyName", async (req, res) => getCompanyForCandidate(req, res, moreThanMetricsDB))
app.get("/jobs/company/:companyName", async (req, res) => getCompanyJobsForCandidate(req, res, moreThanMetricsDB))
app.get("/jobs/:search?", async (req, res) => searchAllJobs(req, res, moreThanMetricsDB))
app.get("/job/:jobID", async (req, res) => getJobForCandidate(req, res, moreThanMetricsDB))
app.get("/applications/candidate/:candidateID", async (req, res) => getCandidatesApplications(req, res, moreThanMetricsDB))
app.post("/application", async (req, res) => postNewApplication(req, res, moreThanMetricsDB))
app.get("/candidate/information/:candidateID", async (req, res) => getCandidateProfile(req, res, moreThanMetricsDB))

//Company endpoints
app.post("/jobs", async (req, res) => postNewJob(req, res, moreThanMetricsDB))
app.get("/company/stats/:companyID", async (req, res) => getCompanyStats(req, res, moreThanMetricsDB))
app.get("/company/jobs/:companyID", async (req, res) => getCompanyJobs(req, res, moreThanMetricsDB))
app.get("/job/stats/:jobID", async (req, res) => getJobStats(req, res, moreThanMetricsDB))
app.get("/applications/review/:jobID", async (req, res) => reviewApplication(req, res, moreThanMetricsDB))
app.patch("/applications/assess", async (req, res) => acceptApplication(req, res, moreThanMetricsDB))
app.get("/applications/accepted/:jobID", async (req, res) => getAcceptedApplications(req, res, moreThanMetricsDB))
app.get("/company/information/:companyID", async (req, res) => getCompanyProfile(req, res, moreThanMetricsDB))

//Account endpoints
app.post("/candidate/register", async (req, res) => registerNewCandidate(req, res, moreThanMetricsDB))
app.put("/candidate/update", async (req, res) => updateCandidateDetails(req, res, moreThanMetricsDB))
app.post("/company/register", async (req, res) => registerNewCompany(req, res, moreThanMetricsDB))
app.put("/company/update", async (req, res) => updateCompanyDetails(req, res, moreThanMetricsDB))
app.post("/login", async (req, res) => loginUser(req, res, moreThanMetricsDB))
app.post("/logout", async (req, res) => logoutUser(res))

app.listen(PORT, () => {
    console.log(`Server started!`)
})
