const { insertNewAccount, isEmailTaken, isUpdatedEmailTaken, updateAccount } = require("./server-logic")
const { isValidCandidate, isValidCandidateUpdate, isValidCompany, isValidCompanyUpdate } = require("./server-validation")

exports.registerNewCandidate = async function registerNewCandidate(req, res, moreThanMetricsDB) {
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

exports.updateCandidateDetails = async function updateCandidateDetails(req, res, moreThanMetricsDB) {
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

exports.updateCompanyDetails = async function updateCompanyDetails(req, res, moreThanMetricsDB) {
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

exports.loginUser = async function loginUser(req, res, moreThanMetricsDB) {
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
                let userID
                let url
                if (accountInfo.account_type_category === "company") {
                    const getTypeID = await client.query("SELECT company_id FROM companies WHERE account_id = $1", [accountInfo.account_id])
                    userID = getTypeID.rows[0].company_id
                    url = "http://localhost:3000/dashboard"
                } else {
                    const getTypeID = await client.query("SELECT candidate_id FROM candidates WHERE account_id = $1", [accountInfo.account_id])
                    userID = getTypeID.rows[0].candidate_id
                    url = "http://localhost:3000/jobs"
                }
                res.status(200)
                    .cookie("moreThanMetricsAT", accountInfo.account_type_category, {
                        maxAge: 86000000,
                    })
                    .cookie("moreThanMetricsID", userID, {
                        maxAge: 86000000,
                    })
                    .send({ message: "Successfully logged in!", type: accountInfo.account_type_category, userID: userID, url: url })
            } else {
                res.status(400).send({ message: "Password is invalid!" })
            }
        })
        .catch((error) => {
            res.status(500).send({ message: error })
        })
    client.release()
}

exports.logoutUser = async function logoutUser(res) {
    const url = "http://localhost:3000"
    res.status(200).clearCookie("moreThanMetricsAT").clearCookie("moreThanMetricsID").send({ message: "Successfully logged out!", url: url })
}
