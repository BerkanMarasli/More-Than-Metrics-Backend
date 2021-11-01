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
    const emailQuery = await client.query("SELECT account_email FROM accounts WHERE account_email = $1 AND account_email != $2", [email, accountID])
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
