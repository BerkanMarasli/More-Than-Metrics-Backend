const { isValidJobDetails } = require("./server-validation")

exports.postNewJob = async function postNewJob(req, res, moreThanMetricsDB) {
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

exports.getCompanyStats = async function getCompanyStats(req, res, moreThanMetricsDB) {
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

exports.getJobStats = async function getJobStats(req, res, moreThanMetricsDB) {
    const jobID = req.params.jobID
    const getNoOfApplications = "SELECT COUNT(application_id) FROM application_status WHERE job_id = $1"
    const client = await moreThanMetricsDB.connect()
    const queryResult = await client.query(getNoOfApplications, [jobID])
    const noOfApplications = queryResult.rows[0].count
    client.release()
    res.status(200).send(noOfApplications)
    return noOfApplications
}

exports.reviewApplication = async function reviewApplication(req, res, moreThanMetricsDB) {
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

exports.acceptApplication = async function acceptApplication(req, res, moreThanMetricsDB) {
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

exports.getAcceptedApplications = async function getAcceptedApplications(req, res, moreThanMetricsDB) {
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

exports.getCompanyProfile = async function getCompanyProfile(req, res, moreThanMetricsDB) {
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
