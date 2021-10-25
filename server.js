const { Pool } = require("pg")
const express = require("express")
const bcrypt = require("bcryptjs")
const cors = require("cors")
const { v4: uuidv4 } = require("uuid")

const PORT = 8080
const whitelist = ["http://localhost:3000"]
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) return callback(null, true)

    callback(new Error("Not allowed by CORS"))
  },
}

const app = express()
app.use(express.json())
app.use(cors(corsOptions))

app.post("/company/login", async (req, res) => {
  const { company_email, company_password } = req.body

  const client = await moreThanMetricsDB.connect()
  const getCompanyLoginInfo =
    "SELECT company_email, company_hashed_password FROM companies WHERE company_email = $1"
  client
    .query(getCompanyLoginInfo, [company_email])
    .then(async queryResult => {
      const [companyInfo] = queryResult.rows
      if (companyInfo.length === 0) {
        client.release()
        return res.status(400).send("Company does not exist")
      }
      const hashedPassword = companyInfo.company_hashed_password
      const isPasswordValid = await bcrypt.compare(company_password, hashedPassword)
      if (isPasswordValid) {
        res.status(200).send("Successfully logged in")
      } else {
        res.status(400).send("Password is invalid")
      }
    })
    .catch(error => {
      res.status(500).send({ error })
    })
  client.release()
})

app.post("/candidate/login", async (req, res) => {
  const { candidate_email, candidate_password } = req.body

  const client = await moreThanMetricsDB.connect()
  const getCandidateLoginInfo =
    "SELECT candidate_email, candidate_hashed_password FROM candidates WHERE candidate_email = $1"
  client
    .query(getCandidateLoginInfo, [candidate_email])
    .then(async queryResult => {
      const [candidateInfo] = queryResult.rows
      if (candidateInfo.length === 0) {
        client.release()
        return res.status(400).send("Candidate does not exist")
      }
      const hashedPassword = candidateInfo.candidate_hashed_password
      const isPasswordValid = await bcrypt.compare(candidate_password, hashedPassword)
      if (isPasswordValid) {
        res.status(200).send("Successfully logged in")
      } else {
        res.status(400).send("Password is invalid")
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
