const { insertNewAccount, isEmailTaken, isUpdatedEmailTaken, updateAccount, getAllTechnologies } = require("./server-logic")
const { isValidCandidate, isValidCandidateUpdate, isValidCompany, isValidCompanyUpdate } = require("./server-validation")
const bcrypt = require("bcryptjs")

exports.registerNewCandidate = async function registerNewCandidate(req, res, moreThanMetricsDB) {
    const candidateDetails = req.body
    const { candidateEmail, candidatePassword, candidateName, headline, candidatePhoneNumber, yearsInIndustryID, technologies } = candidateDetails
    // Checks for duplicate email
    if (await isEmailTaken(candidateEmail, moreThanMetricsDB)) {
        return res.status(400).send({ message: "Email address already taken!" })
    }
    // Validating candidate details
    const validCandidateResponse = isValidCandidate(candidateDetails)
    if (validCandidateResponse !== true) {
        return res.status(400).send({ message: validCandidateResponse })
    }
    // Creating new account for candidate
    const newAccountResponse = await insertNewAccount(candidateEmail, candidatePassword, 1, moreThanMetricsDB)
    if (newAccountResponse !== "Registered new account!") {
        return res.status(500).send({ message: newAccountResponse })
    }
    // Inserting (additional) details for candidate
    const client = await moreThanMetricsDB.connect()
    const accountIDQuery = await client.query("SELECT account_id FROM accounts WHERE account_email = $1", [candidateEmail])
    const accountID = accountIDQuery.rows[0].account_id
    const insertCandidateDetails =
        "INSERT INTO candidates (candidate_name, headline, candidate_phone_number, candidate_years_in_industry_id, account_id) VALUES ($1, $2, $3, $4, $5) RETURNING candidate_id"
    let errorFlag = false
    const queryResult = await client
        .query(insertCandidateDetails, [candidateName, headline, candidatePhoneNumber, yearsInIndustryID, accountID])
        .catch((error) => {
            errorFlag = true
            return res.status(500).send({ message: error })
        })
    if (errorFlag) {
        client.release()
        return
    }
    const candidateID = queryResult.rows[0].candidate_id
    for (let technology of technologies) {
        client
            .query("INSERT INTO candidates_technologies(candidate_id, technology_id) VALUES ($1, $2);", [candidateID, technology])
            .catch((error) => {
                errorFlag = true
                return res.status(500).send({ message: error })
            })
    }
    client.release()
    if (!errorFlag) {
        return res.status(200).send({ message: "Added candidate details" })
    }
}

exports.updateCandidateDetails = async function updateCandidateDetails(req, res, moreThanMetricsDB) {
    const updatedDetails = req.body
    const { candidateID, candidateEmail, candidatePassword, candidateName, headline, candidatePhoneNumber, yearsInIndustryID, technologies } =
        updatedDetails
    const getAccountID = "SELECT account_id FROM candidates WHERE candidate_id = $1"
    const client = await moreThanMetricsDB.connect()
    const idResult = await client.query(getAccountID, [candidateID]).catch((error) => {
        client.release()
        return res.status(500).send({ message: error })
    })

    const accountID = idResult.rows[0].account_id
    // Checks for duplicate email
    if (await isUpdatedEmailTaken(accountID, candidateEmail, moreThanMetricsDB)) {
        return res.status(400).send({ message: "Email address already taken!" })
    }
    // Validating candidate details
    const validUpdateResponse = isValidCandidateUpdate(updatedDetails)
    if (validUpdateResponse !== true) {
        return res.status(400).send({ message: validUpdateResponse })
    }
    // Updating account for candidate
    const updateResponse = await updateAccount(accountID, candidateEmail, candidatePassword, moreThanMetricsDB)
    if (updateResponse !== true) {
        return res.status(500).send({ message: updateResponse })
    }
    // Updating (additional) details for candidate
    const updateCandidateDetails =
        "UPDATE candidates SET candidate_name = $1, headline = $2, candidate_phone_number = $3, candidate_years_in_industry_id = $4 WHERE account_id = $5"
    client.query(updateCandidateDetails, [candidateName, headline, candidatePhoneNumber, yearsInIndustryID, accountID]).catch((error) => {
        res.status(500).send({ message: error })
    })
    const deleteTechnologies = "DELETE FROM candidates_technologies WHERE candidate_id = $1"
    client.query(deleteTechnologies, [candidateID])
    for (let technology of technologies) {
        client
            .query("INSERT INTO candidates_technologies(candidate_id, technology_id) VALUES ($1, $2);", [candidateID, technology])
            .catch((error) => {
                client.release()
                return res.status(500).send({ message: error })
            })
    }
    res.status(200).send({ message: "Updated candidate details!" })
    client.release()
}

exports.registerNewCompany = async function registerNewCompany(req, res, moreThanMetricsDB) {
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
        return res.status(400).send({ message: "Email address already taken!" })
    }
    // Validating candidate details
    const validCompanyResponse = isValidCompany(companyDetails)
    if (validCompanyResponse !== true) {
        return res.status(400).send({ message: validCompanyResponse })
    }
    // Creating new account for company
    const newAccountResponse = await insertNewAccount(companyEmail, companyPassword, 2, moreThanMetricsDB)
    if (newAccountResponse !== "Registered new account!") {
        return res.status(500).send({ message: newAccountResponse })
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
            res.status(200).send({ message: "Added new company details" })
        })
        .catch((error) => {
            res.status(500).send({ message: error })
        })
    client.release()
}

exports.updateCompanyDetails = async function updateCompanyDetails(req, res, moreThanMetricsDB) {
    const updatedDetails = req.body
    const {
        companyID,
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

    const getAccountID = "SELECT account_id FROM companies WHERE company_id = $1"
    const client = await moreThanMetricsDB.connect()
    const idResult = await client.query(getAccountID, [companyID]).catch((error) => {
        client.release()
        return res.status(500).send({ message: error })
    })
    const accountID = idResult.rows[0].account_id
    // Checks for duplicate email
    if (await isUpdatedEmailTaken(accountID, companyEmail, moreThanMetricsDB)) {
        return res.status(400).send({ message: "Email address already taken!" })
    }
    // Validating company details
    const validUpdateResponse = isValidCompanyUpdate(updatedDetails)
    if (validUpdateResponse !== true) {
        return res.status(400).send({ message: validUpdateResponse })
    }
    // Updating account for company
    const updateResponse = await updateAccount(accountID, companyEmail, companyPassword, moreThanMetricsDB)
    if (updateResponse !== true) {
        return res.status(500).send({ message: updateResponse })
    }
    // Updating (additional) details for company
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
            res.status(200).send({ message: "Updated company details!" })
        })
        .catch((error) => {
            res.status(500).send({ message: error })
        })
    client.release()
}

exports.loginUser = async function loginUser(req, res, moreThanMetricsDB) {
    const { email, password } = req.body
    const client = await moreThanMetricsDB.connect()
    const getAccountLoginInfo =
        "SELECT account_id, account_email, account_hashed_password, account_type_category FROM accounts JOIN account_type ON accounts.account_type_id = account_type.account_type_id WHERE account_email = $1"
    const queryResult = await client.query(getAccountLoginInfo, [email]).catch((error) => {
        return res.status(500).send({ message: error })
    })
    const [accountInfo] = queryResult.rows
    if (!queryResult.rowCount && !(await isEmailTaken(email, moreThanMetricsDB))) {
        client.release()
        return res.status(400).send({ message: "Account does not exist!" })
    }
    const hashedPassword = accountInfo.account_hashed_password
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword)
    if (isPasswordCorrect) {
        let userID
        let url
        if (accountInfo.account_type_category === "company") {
            const getTypeID = await client.query("SELECT company_id FROM companies WHERE account_id = $1", [accountInfo.account_id])
            userID = getTypeID.rows[0].company_id
            url = "https://morethanmetrics.netlify.app/dashboard"
        } else {
            const getTypeID = await client.query("SELECT candidate_id FROM candidates WHERE account_id = $1", [accountInfo.account_id])
            userID = getTypeID.rows[0].candidate_id
            url = "https://morethanmetrics.netlify.app/jobs"
        }
        res.status(200).send({
            message: "Successfully logged in!",
            type: accountInfo.account_type_category,
            userID: userID,
            url: url,
            cookieOneToSet: `moreThanMetricsAT=${accountInfo.account_type_category};max-age=86400;SameSite=None;Secure`,
            cookieTwoToSet: `moreThanMetricsID=${userID};max-age=86400;SameSite=None;Secure`,
        })
    } else {
        res.status(400).send({ message: "Password is invalid!" })
    }
    client.release()
}

exports.logoutUser = async function logoutUser(res) {
    const url = "https://morethanmetrics.netlify.app"
    res.status(200).send({ message: "Successfully logged out!", url: url })
}
