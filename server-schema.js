const { Pool } = require("pg");

const DBSTRING =
  "postgres://hjtqvwqx:i-lgggJgY-howhBMFWrhsLpMOel53sxn@surus.db.elephantsql.com/hjtqvwqx";

const moreThanMetricsDB = new Pool({ connectionString: DBSTRING });

async function createTables() {
  const client = await moreThanMetricsDB.connect();

  // Delete All Tables
  const deleteAllTables =
    "DROP TABLE account_type CASCADE; DROP TABLE years_in_industry CASCADE; DROP TABLE number_of_employees CASCADE; DROP TABLE technologies CASCADE; DROP TABLE prompts CASCADE; DROP TABLE accounts CASCADE; DROP TABLE candidates CASCADE; DROP TABLE companies CASCADE; DROP TABLE candidates_technologies CASCADE; DROP TABLE jobs CASCADE; DROP TABLE job_responsibilities CASCADE; DROP TABLE job_technologies CASCADE; DROP TABLE application_status CASCADE; DROP TABLE application_responses CASCADE;";
  client
    .query(deleteAllTables)
    .then(() => console.log("Deleted all tables successfully"))
    .catch((error) => console.log(error));

  // Account Type Table
  const createAccountTypeTable =
    "CREATE TABLE account_type (account_type_id SERIAL PRIMARY KEY, account_type_category TEXT NOT NULL);";
  client
    .query(createAccountTypeTable)
    .then(() => console.log("Created account_type table successfully"))
    .catch((error) => console.log(error));

  // Years In Industry Table
  const createYearsInIndustryTable =
    "CREATE TABLE years_in_industry (years_in_industry_id SERIAL PRIMARY KEY, category TEXT NOT NULL);";
  client
    .query(createYearsInIndustryTable)
    .then(() => console.log("Created years_in_industry table successfully"))
    .catch((error) => console.log(error));

  // Number Of Employees Table
  const createNumberOfEmployeesTable =
    "CREATE TABLE number_of_employees (number_of_employees_id SERIAL PRIMARY KEY, category TEXT NOT NULL);";
  client
    .query(createNumberOfEmployeesTable)
    .then(() => console.log("Created number_of_employees table successfully"))
    .catch((error) => console.log(error));

  // Technologies Table
  const createTechnologiesTable =
    "CREATE TABLE technologies (technology_id SERIAL PRIMARY KEY, technology_name TEXT NOT NULL);";
  client
    .query(createTechnologiesTable)
    .then(() => console.log("Created technologies table successfully"))
    .catch((error) => console.log(error));

  // Prompts Table
  const createPromptTable =
    "CREATE TABLE prompts (prompt_id SERIAL PRIMARY KEY, prompt TEXT NOT NULL);";
  client
    .query(createPromptTable)
    .then(() => console.log("Created prompt table successfully"))
    .catch((error) => console.log(error));

  // Accounts Table
  const createAccountsTable =
    "CREATE TABLE accounts (account_id SERIAL PRIMARY KEY, account_email TEXT NOT NULL, account_hashed_password TEXT NOT NULL, account_type_id INTEGER NOT NULL, FOREIGN KEY (account_type_id) REFERENCES account_type(account_type_id));";
  client
    .query(createAccountsTable)
    .then(() => console.log("Created accounts table successfully"))
    .catch((error) => console.log(error));

  // Candidates Table
  const createCandidatesTable =
    "CREATE TABLE candidates (candidate_id SERIAL PRIMARY KEY, candidate_name TEXT NOT NULL, candidate_phone_number BIGINT NOT NULL, candidate_years_in_industry_id INTEGER NOT NULL, account_id INTEGER NOT NULL, FOREIGN KEY (candidate_years_in_industry_id) REFERENCES years_in_industry(years_in_industry_id), FOREIGN KEY (account_id) REFERENCES accounts(account_id));";
  client
    .query(createCandidatesTable)
    .then(() => console.log("Created candidates table successfully"))
    .catch((error) => console.log(error));

  // Companies Table
  const createCompaniesTable =
    "CREATE TABLE companies (company_id SERIAL PRIMARY KEY, company_name TEXT NOT NULL, company_bio TEXT NOT NULL, location TEXT NOT NULL, company_number_of_employees_id INTEGER NOT NULL, company_female_employee_percentage INTEGER NOT NULL, company_retention_rate INTEGER NOT NULL, image_url TEXT NOT NULL, account_id INTEGER NOT NULL, FOREIGN KEY (company_number_of_employees_id) REFERENCES number_of_employees(number_of_employees_id), FOREIGN KEY (account_id) REFERENCES accounts(account_id));";
  client
    .query(createCompaniesTable)
    .then(() => console.log("Created companies table successfully"))
    .catch((error) => console.log(error));

  // CandidatesTechnologies Table
  const createCandidatesTechnologiesTable =
    "CREATE TABLE candidates_technologies (account_id INTEGER NOT NULL, technology_id INTEGER NOT NULL, FOREIGN KEY (account_id) REFERENCES accounts(account_id), FOREIGN KEY (technology_id) REFERENCES technologies(technology_id));";
  client
    .query(createCandidatesTechnologiesTable)
    .then(() =>
      console.log("Created candidates_technologies table successfully")
    )
    .catch((error) => console.log(error));

  // Jobs Table
  const createJobsTable =
    "CREATE TABLE jobs (job_id SERIAL PRIMARY KEY, job_title TEXT NOT NULL, job_description TEXT NOT NULL, location TEXT NOT NULL, salary TEXT NOT NULL, account_id INTEGER NOT NULL, FOREIGN KEY (account_id) REFERENCES accounts(account_id));";
  client
    .query(createJobsTable)
    .then(() => console.log("Created jobs table successfully"))
    .catch((error) => console.log(error));

  //JobResponsibilities table
  const createJobsResponsibilitiesTable =
    "CREATE TABLE job_responsibilities (job_id INTEGER NOT NULL, responsibility TEXT NOT NULL, FOREIGN KEY (job_id) REFERENCES jobs(job_id))";
  client
    .query(createJobsResponsibilitiesTable)
    .then(() => console.log("Created jobs responsibilities table successfully"))
    .catch((error) => console.log(error));

  //JobTechnologies table
  const createJobsTechnologiesTable =
    "CREATE TABLE job_technologies (job_id INTEGER NOT NULL, technology_id INTEGER NOT NULL, FOREIGN KEY (job_id) REFERENCES jobs(job_id), FOREIGN KEY (technology_id) REFERENCES technologies(technology_id))";
  client
    .query(createJobsTechnologiesTable)
    .then(() => console.log("Created jobs technologies table successfully"))
    .catch((error) => console.log(error));

  // ApplicationStatus Table
  const createApplicationStatusTable =
    "CREATE TABLE application_status (application_id SERIAL PRIMARY KEY, reviewed BOOL NOT NULL, accepted BOOL NOT NULL, account_id INTEGER NOT NULL, job_id INTEGER NOT NULL, FOREIGN KEY (account_id) REFERENCES accounts(account_id), FOREIGN KEY (job_id) REFERENCES jobs(job_id));";
  client
    .query(createApplicationStatusTable)
    .then(() => console.log("Created application_status table successfully"))
    .catch((error) => console.log(error));

  // ApplicationResponses Table
  const createApplicationResponsesTable =
    "CREATE TABLE application_responses (application_id INTEGER NOT NULL, prompt_id INTEGER NOT NULL, answer TEXT NOT NULL, FOREIGN KEY (application_id) REFERENCES application_status(application_id), FOREIGN KEY (prompt_id) REFERENCES prompts(prompt_id));";
  client
    .query(createApplicationResponsesTable)
    .then(() => console.log("Created application_status table successfully"))
    .catch((error) => console.log(error));

  client.release();
}

createTables();
