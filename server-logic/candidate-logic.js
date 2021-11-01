const { isValidApplication } = require("./server-validation")

exports.getCompanyForCandidate = async function getCompanyForCandidate(req, res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const companyName = req.params.companyName
    const getCompanyDetails =
        "SELECT * FROM companies JOIN number_of_employees ON number_of_employees.number_of_employees_id = companies.company_number_of_employees_id WHERE company_name = $1"
    const queryResult = client.query(getCompanyDetails, [companyName])
    const companyDetails = (await queryResult).rows
    if (companyDetails.length < 1) {
        res.status(500).send("No company!")
    } else {
        res.status(200).send(companyDetails)
    }
    client.release()
}

exports.getCompanyJobsForCandidate = async function getCompanyJobsForCandidate(req, res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const companyName = req.params.companyName.replaceAll("%20", "")
    const getCompanyJobs = "SELECT * FROM jobs JOIN companies ON companies.company_id = jobs.company_id WHERE company_name = $1"
    const queryResult = client.query(getCompanyJobs, [companyName])
    const companyJobs = (await queryResult).rows
    if (companyJobs.length < 1) {
        res.status(500).send("No company jobs!")
    } else {
        res.status(200).send(companyJobs)
    }
    client.release()
}

exports.searchAllJobs = async function searchAllJobs(req, res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    let search = req.params.search
    if (search === undefined) {
        search = ""
        const getAllJobs = "SELECT job_id, job_title, company_name FROM jobs JOIN companies ON companies.company_id = jobs.company_id ORDER BY job_id"
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
}

exports.getJobForCandidate = async function getJobForCandidate(req, res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    let jobID = req.params.jobID
    const getJobDetails = "SELECT * , jobs.location FROM jobs JOIN companies ON companies.company_id = jobs.company_id WHERE jobs.job_id = $1"
    const queryResult = await client.query(getJobDetails, [jobID])
    const jobDetails = queryResult.rows
    if (jobDetails.length < 1) {
        res.status(400).send("no such job")
    } else {
        const getResponsibilities = "SELECT responsibility FROM job_responsibilities WHERE job_id = $1"
        const queryResp = await client.query(getResponsibilities, [jobID])
        const respArray = []
        queryResp.rows.forEach((input) => {
            respArray.push(input.responsibility)
        })
        jobDetails[0]["responsibilities"] = respArray
        const getTechnologies =
            "SELECT technology_name FROM job_technologies JOIN technologies ON technologies.technology_id = job_technologies.technology_id WHERE job_id = $1"
        const queryTech = await client.query(getTechnologies, [jobID])
        techArray = []
        queryTech.rows.forEach((input) => {
            techArray.push(input.technology_name)
        })
        jobDetails[0]["technologies"] = techArray
        res.status(200).send(jobDetails)
    }
    client.release()
}

exports.getCandidatesApplications = async function getCandidatesApplications(req, res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const candidateID = req.params.candidateID
    const getCandidateApplications =
        "SELECT application_id, jobs.job_id, job_title, company_name, reviewed, accepted FROM application_status JOIN jobs ON jobs.job_id = application_status.job_id JOIN companies ON companies.company_id = jobs.company_id WHERE candidate_id = $1"
    const queryResult = await client.query(getCandidateApplications, [candidateID])
    const candidateApplications = queryResult.rows
    if (candidateApplications.length < 1) {
        res.status(200).send("No applications made")
    } else {
        res.status(200).send(candidateApplications)
    }
    client.release()
}

exports.postNewApplication = async function postNewApplication(req, res, moreThanMetricsDB) {
    const applicationDetails = req.body
    const { candidateID, jobID, prompt1, answer1, prompt2, answer2, prompt3, answer3 } = applicationDetails
    const validApplicationResponse = isValidApplication(applicationDetails)
    if (validApplicationResponse !== true) {
        return res.status(400).send(validApplicationResponse)
    }
    const client = await moreThanMetricsDB.connect()
    const insertNewApplication =
        "INSERT INTO application_status(reviewed, accepted, candidate_id, job_id) VALUES (false, false, $1, $2) RETURNING application_id"
    const queryResult = await client.query(insertNewApplication, [candidateID, jobID]).catch((error) => {
        client.release()
        return res.status(500).send(error)
    })
    console.log(queryResult.rows)
    let applicationID = queryResult.rows[0].application_id
    const insertApplicationResponses =
        "INSERT INTO application_responses(application_id, prompt_id, answer) VALUES ($1, $2, $3), ($1, $4 ,$5), ($1, $6, $7)"
    client
        .query(insertApplicationResponses, [applicationID, prompt1, answer1, prompt2, answer2, prompt3, answer3])
        .then(() => {
            res.status(200).send("Added application details!")
        })
        .catch((error) => {
            res.status(500).send(error)
        })
    client.release()
}

exports.getCandidateProfile = async function getCandidateProfile(req, res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const candidateID = req.params.candidateID
    const getCandidateInfo =
        "SELECT candidate_name, headline, candidate_phone_number, candidate_years_in_industry_id, account_email FROM candidates JOIN accounts ON accounts.account_id = candidates.account_id WHERE candidate_id = $1"
    const queryResult = await client.query(getCandidateInfo, [candidateID])
    const candidateInfo = queryResult.rows
    if (candidateInfo.length < 1) {
        client.release()
        return res.status(500).send("No candidate found")
    }
    const getCandidateTechnologies =
        "SELECT * FROM candidates_technologies JOIN technologies ON technologies.technology_id = candidates_technologies.technology_id WHERE candidate_id = $1"
    const techArray = []
    const techQuery = await client.query(getCandidateTechnologies, [candidateID])
    techQuery.rows.forEach((technology) => {
        techArray.push(technology.technology_name)
    })
    candidateInfo[0]["technologies"] = techArray
    res.status(200).send(candidateInfo)
    client.release()
}
