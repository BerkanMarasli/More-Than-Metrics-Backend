const bcrypt = require("bcryptjs")

exports.isEmailTaken = async function isEmailTaken(email, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const emailQuery = await client.query("SELECT account_email FROM accounts WHERE account_email = $1", [email])
    client.release()
    if (emailQuery.rows.length >= 1) {
        return true
    }
    return false
}

exports.isUpdatedEmailTaken = async function isUpdatedEmailTaken(accountID, email, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const emailQuery = await client.query("SELECT * FROM accounts WHERE account_email = $1 AND account_id != $2", [email, accountID])
    client.release()
    if (emailQuery.rows.length >= 1) {
        return true
    }
    return false
}

exports.updateAccount = async function updateAccount(accountID, email, password, moreThanMetricsDB) {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const client = await moreThanMetricsDB.connect()
    const updateQuery = "UPDATE accounts SET account_email = $1, account_hashed_password = $2 WHERE account_id = $3"
    await client.query(updateQuery, [email, hashedPassword, accountID]).catch((error) => {
        client.release()
        return error
    })
    client.release()
    return true
}

exports.insertNewAccount = async function insertNewAccount(email, password, accountType, moreThanMetricsDB) {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const client = await moreThanMetricsDB.connect()
    const insertAccount = "INSERT INTO accounts (account_email, account_hashed_password, account_type_id) VALUES ($1, $2, $3);"
    let returnMessage = ""
    await client
        .query(insertAccount, [email, hashedPassword, accountType])
        .then(() => {
            returnMessage = "Registered new account!"
        })
        .catch((error) => {
            returnMessage = error
        })
    client.release()
    return returnMessage
}

exports.getNumberOfEmployees = async function getNumberOfEmployees(res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const getNOECategory = "SELECT * FROM number_of_employees"
    const queryResult = await client.query(getNOECategory)
    const NOECategories = queryResult.rows
    if (NOECategories.length < 1) {
        res.status(500).send({ message: "No categories for number of employees!" })
    } else {
        res.status(200).send(NOECategories)
    }
    client.release()
}

exports.getYearsInIndustry = async function getYearsInIndustry(res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const getYIICategory = "SELECT * FROM years_in_industry"
    const queryResult = await client.query(getYIICategory)
    const YIICategories = queryResult.rows
    if (YIICategories.length < 1) {
        res.status(500).send({ message: "No categories for years in industry!" })
    } else {
        res.status(200).send(YIICategories)
    }
    client.release()
}

exports.getAllTechnologies = async function getAllTechnologies(res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const getTechnologyCategory = "Select * FROM technologies"
    const queryResult = await client.query(getTechnologyCategory)
    const technologyCategories = queryResult.rows
    if (technologyCategories.length < 1) {
        res.status(500).send({ message: "No categories for technologies!" })
    } else {
        res.status(200).send(technologyCategories)
    }
    client.release()
}

exports.getPrompts = async function getPrompts(res, moreThanMetricsDB) {
    const client = await moreThanMetricsDB.connect()
    const getPromptCategory = "Select * FROM prompts"
    const queryResult = await client.query(getPromptCategory)
    const promptsCategories = queryResult.rows
    if (promptsCategories.length < 1) {
        res.status(500).send({ message: "No categories for prompts!" })
    } else {
        res.status(200).send(promptsCategories)
    }
    client.release()
}
