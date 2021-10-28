/*

INSERT INTO jobs (job_title, job_description, location, salary, account_id) VALUES ('Coding Coach', 'Coach people coding', 'London', 'Competitive LOL', 17), ('CEO', 'Rich', 'London', '£££', 18), ('Software Designer', 'Design Software', 'Manchester', '£48000', 17), ('Janitor', 'Clean stuff', 'Chelsea', '£32000', 18), ('MEGALORD', 'Be Evil', 'Dublin', '12 Souls p/h', 19), ('Candy Man', 'Sell Candy', 'Oxford', '£28000', 19), ('Candy Boy', 'Buy Candy', 'Oxford', '-£1000', 19), ('Developer', 'develop things', 'London', '£30000', 20), ('Developer', 'develop things', 'London', '£30000', 20), ('Coding Coach', 'Coach coding', 'London', '£40000', 20), ('Machine', 'Learning', 'Office', '£2', 19), ('Flower', 'Grow', 'Garden', '10 drops of sunlight', 18);

INSERT INTO companies(company_name, company_bio, location, company_number_of_employees_id,company_female_employee_percentage, company_retention_rate, account_id) VALUES ('Bigma Labs', 'Sigma labs but bigger', 'Sillicon Valley', 4, 12,23,17), ('Ligma Sabs', 'What's Ligma?', 'Cherry Well', 5, 10, 27, 18), ('Heidi''s Hut', 'Push her off a cliff', 'Somewhere in the countryside', 7, 54,9,19), ('Happy Harvester', 'Ruining lives by the second', 'Texas', 2, 3,54,20)

*/

const { Pool } = require("pg");

const DBSTRING =
  "postgres://hjtqvwqx:i-lgggJgY-howhBMFWrhsLpMOel53sxn@surus.db.elephantsql.com/hjtqvwqx";

const moreThanMetricsDB = new Pool({ connectionString: DBSTRING });
let insertQuery;

async function insertDummyData() {
  const client = await moreThanMetricsDB.connect();

  // Account Type Table
  insertQuery =
    "INSERT INTO account_type (account_type_category) VALUES ('Candidate'), ('Company');";
  client
    .query(insertQuery)
    .then(() => console.log("Inserted into account_type table successfully"))
    .catch((error) => console.log(error));

  // Years in Industry Table
  insertQuery =
    "INSERT INTO years_in_industry (category) VALUES ('0'), ('1-2'), ('3-4'), ('5+');";
  client
    .query(insertQuery)
    .then(() =>
      console.log("Inserted into years_in_industry table successfully")
    )
    .catch((error) => console.log(error));

  // Number of Employees Table
  insertQuery =
    "INSERT INTO number_of_employees (category) VALUES ('0-9'), ('10-25'), ('26-50'), ('51-99'), ('100-199'), ('200+');";
  client
    .query(insertQuery)
    .then(() =>
      console.log("Inserted into number_of_employees table successfully")
    )
    .catch((error) => console.log(error));

  // Technologies Table
  insertQuery =
    "INSERT INTO technologies (technology_name) VALUES ('Javascript'), ('Python'), ('React'), ('SQL'), ('NodeJS'), ('Deno'), ('Angular'), ('Java'), ('HTML5'), ('CSS3'), ('Express');";
  client
    .query(insertQuery)
    .then(() => console.log("Inserted into technologies table successfully"))
    .catch((error) => console.log(error));

  // Prompts Table
  insertQuery =
    "INSERT INTO prompts (prompt) VALUES ('What is your fav colour?'), ('How happy are you?'), ('What is the meaning of life?'), ('How happy are you currently?'), ('Tell me about something no-one else knows'), ('How many dogs, cats and pigs do you own?');";
  client
    .query(insertQuery)
    .then(() => console.log("Inserted into prompts table successfully"))
    .catch((error) => console.log(error));

  return;

  // use REST Client
  /*
    POST http://localhost:8080/company/register
    content-type: application/json

    {
        "companyEmail":"test1@test.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"Instagram",
        "companyBio":"Instagram is an American photo and video sharing social networking service founded by Kevin Systrom and Mike Krieger. In April 2012, Facebook acquired the service for approximately US$1 billion in cash and stock. The app allows users to upload media that can be edited with filters and organized by hashtags and geographical tagging. Posts can be shared publicly or with pre-approved followers. Users can browse other users' content by tags and locations and view trending content. Users can like photos and follow other users to add their content to a personal feed.",
        "companyLocation":"United States",
        "numberOfEmployeesID":6,
        "femalePercentage": 55,
        "retentionRate": 67,
        "imageURL": "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Instagram_colored_svg_1-512.png"
    }

    POST http://localhost:8080/company/register
    content-type: application/json

    {
        "companyEmail":"test2@test.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"Google",
        "companyBio":"Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware. It is considered one of the Big Five companies in the American information technology industry, along with Amazon, Facebook, Apple, and Microsoft.",
        "companyLocation":"United States",
        "numberOfEmployeesID":6,
        "femalePercentage": 58,
        "retentionRate": 90,
        "imageURL": "https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-logos-vector-eps-cdr-svg-download-10.png"
    }

    POST http://localhost:8080/candidate/register
    content-type: application/json

    {
        "candidateEmail":"test3@test.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Sang ta",
        "headline":"Exotic",
        "candidatePhoneNumber":447812389483,
        "yearsInIndustryID":2
    }

    POST http://localhost:8080/candidate/register
    content-type: application/json

    {
        "candidateEmail":"test4@test.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Berkan Marasli",
        "headline":"They call me Mr. Amazon",
        "candidatePhoneNumber":447817389483,
        "yearsInIndustryID":4
    }
  */

  // CandidatesTechnologies Table
  insertQuery =
    "INSERT INTO candidates_technologies (candidate_id, technology_id) VALUES (1, 10), (1, 4), (1, 6), (1, 3), (1, 7), (1, 1), (2, 4), (2, 6), (2, 11), (2, 1);";
  client
    .query(insertQuery)
    .then(() => console.log("Inserted into prompts table successfully"))
    .catch((error) => console.log(error));

  // use REST Client
  /*
    POST http://localhost:8080/jobs
    content-type: application/json

    {
        "jobTitle":"Junior Front-End Developer",
        "jobDesc":"Basically doing a lot of CSS. Ensure you enjoy CSS. Only recruiting individuals who love CSS.",
        "location":"London",
        "salary":"40000-55000",
        "keyResponsibilities":["Do CSS", "Do more CSS", "Finally do even more CSS"],
        "keyTechnologies":[1, 2, 3, 4],
        "companyID":1
    }

    POST http://localhost:8080/jobs
    content-type: application/json

    {
        "jobTitle":"Senior Back-End Engineer",
        "jobDesc":"Involves a lot of databases. Deleting and recreating.",
        "location":"Manchester",
        "salary":"65000-80000",
        "keyResponsibilities":["Databases", "REST APIs", "Caching"],
        "keyTechnologies":[1, 2, 6, 10, 8, 5],
        "companyID":2
    }

    POST http://localhost:8080/jobs
    content-type: application/json

    {
        "jobTitle":"CTO",
        "jobDesc":"Involves talking to people.",
        "location":"Remote",
        "salary":"150000-180000",
        "keyResponsibilities":["Managing", "Knowledge", "Interest for technology"],
        "keyTechnologies":[1, 3, 2, 6, 10, 8, 5, 7, 11],
        "companyID":2
    }

    POST http://localhost:8080/jobs
    content-type: application/json

    {
        "jobTitle":"Consultant",
        "jobDesc":"Do the work fast. Not clean.",
        "location":"London",
        "salary":"Competitive",
        "keyResponsibilities":["Dealing with clients", "Expert opinion", "Just be proactive"],
        "keyTechnologies":[1, 6, 10, 7],
        "companyID":1
    }

    POST http://localhost:8080/jobs
    content-type: application/json

    {
        "jobTitle":"Junior 1",
        "jobDesc":"Handy person to have on the job. Please do put the effort in every day. You will have a dedicated career path.",
        "location":"EMEA",
        "salary":"30000",
        "keyResponsibilities":["Learning", "Contributing", "HeyHo"],
        "keyTechnologies":[1, 2, 3, 5, 8, 11],
        "companyID":1
    }

    POST http://localhost:8080/jobs
    content-type: application/json

    {
        "jobTitle":"Mid-level Developer 2",
        "jobDesc":"Handy person to have on the job. Please do put the effort in every day. You will have a dedicated career path.",
        "location":"EMEA",
        "salary":"40000",
        "keyResponsibilities":["Learning", "Contributing", "HeyHo"],
        "keyTechnologies":[1, 2, 3, 5, 8, 11],
        "companyID":1
    }

    POST http://localhost:8080/jobs
    content-type: application/json

    {
        "jobTitle":"10X Developer",
        "jobDesc":"Handy person to have on the job. Please do put the effort in every day. You will have a dedicated career path.",
        "location":"Texas",
        "salary":"500000",
        "keyResponsibilities":["Be a bad ass", "Learn to share the money", "Write code"],
        "keyTechnologies":[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        "companyID":1
    }

    POST http://localhost:8080/jobs
    content-type: application/json

    {
        "jobTitle":"Janitor",
        "jobDesc":"Clean up the Crim- *ahem* I mean clean up the dirt and dust that is detrimental to the company",
        "location":"Las Vegas",
        "salary":"1400000",
        "keyResponsibilities":["Get to the scene as fast as possible", "Be able to quickly and efficiently clean out stains", "Be able to clean up and leave no traces of biological data"],
        "keyTechnologies":[7, 8, 9, 10, 11],
        "companyID":2
    }

    POST http://localhost:8080/application
    content-type: application/json

    {
        "candidateID":1,
        "jobID":4,
        "prompt1":2,
        "answer1":"Pick me!",
        "prompt2":5,
        "answer2":"Feel me!",
        "prompt3":6,
        "answer3":"Hold me!"
    }

    POST http://localhost:8080/application
    content-type: application/json

    {
        "candidateID":2,
        "jobID":4,
        "prompt1":2,
        "answer1":"Darkness is in my veins",
        "prompt2":4,
        "answer2":"I live in the shadows",
        "prompt3":5,
        "answer3":"I am the night"
    }

    POST http://localhost:8080/application
    content-type: application/json

    {
        "candidateID":1,
        "jobID":1,
        "prompt1":1,
        "answer1":"This role brings out the colour in my eyes",
        "prompt2":2,
        "answer2":"My ability is far beyond anyone in this company, you would be grateful that I even allow you in my presence",
        "prompt3":3,
        "answer3":"I treat all humans with respect, too bad all I see around here are pigs grovelling in the mud"
    }

  */

  client.release();
}

insertDummyData();
