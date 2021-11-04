/*

INSERT INTO jobs (job_title, job_description, location, salary, account_id) VALUES ('Coding Coach', 'Coach people coding', 'London', 'Competitive LOL', 17), ('CEO', 'Rich', 'London', '£££', 18), ('Software Designer', 'Design Software', 'Manchester', '£48000', 17), ('Janitor', 'Clean stuff', 'Chelsea', '£32000', 18), ('MEGALORD', 'Be Evil', 'Dublin', '12 Souls p/h', 19), ('Candy Man', 'Sell Candy', 'Oxford', '£28000', 19), ('Candy Boy', 'Buy Candy', 'Oxford', '-£1000', 19), ('Developer', 'develop things', 'London', '£30000', 20), ('Developer', 'develop things', 'London', '£30000', 20), ('Coding Coach', 'Coach coding', 'London', '£40000', 20), ('Machine', 'Learning', 'Office', '£2', 19), ('Flower', 'Grow', 'Garden', '10 drops of sunlight', 18);

INSERT INTO companies(company_name, company_bio, location, company_number_of_employees_id,company_female_employee_percentage, company_retention_rate, account_id) VALUES ('Bigma Labs', 'Sigma labs but bigger', 'Sillicon Valley', 4, 12,23,17), ('Ligma Sabs', 'What's Ligma?', 'Cherry Well', 5, 10, 27, 18), ('Heidi''s Hut', 'Push her off a cliff', 'Somewhere in the countryside', 7, 54,9,19), ('Happy Harvester', 'Ruining lives by the second', 'Texas', 2, 3,54,20)

*/

const { Pool } = require("pg")

const DBSTRING = "postgres://hjtqvwqx:i-lgggJgY-howhBMFWrhsLpMOel53sxn@surus.db.elephantsql.com/hjtqvwqx"

const moreThanMetricsDB = new Pool({ connectionString: DBSTRING })
let insertQuery

async function insertDummyData() {
    const client = await moreThanMetricsDB.connect()

    // Account Type Table
    insertQuery = "INSERT INTO account_type (account_type_category) VALUES ('candidate'), ('company');"
    client
        .query(insertQuery)
        .then(() => console.log("Inserted into account_type table successfully"))
        .catch((error) => console.log(error))

    // Years in Industry Table
    insertQuery = "INSERT INTO years_in_industry (category) VALUES ('<1'), ('1'), ('2'), ('3'), ('4'), ('5+');"
    client
        .query(insertQuery)
        .then(() => console.log("Inserted into years_in_industry table successfully"))
        .catch((error) => console.log(error))

    // Number of Employees Table
    insertQuery = "INSERT INTO number_of_employees (category) VALUES ('<20'), ('20-99'), ('100-299'), ('300-499'), ('500-999'), ('1000+');"
    client
        .query(insertQuery)
        .then(() => console.log("Inserted into number_of_employees table successfully"))
        .catch((error) => console.log(error))

    // Technologies Table
    insertQuery =
        "INSERT INTO technologies (technology_name) VALUES ('SQL'),('React'), ('NodeJS'), ('Deno'), ('Angular'),('Express'),('C++'),('C'),('C#'),('PHP'),('Github'),('Excel/Spreadsheets'),('Data Visualisation'),('Cloud Computing'),('MATLAB'),('Python'),('Java'),('R'),('CSS'),('HTML'),('Ladder'),('JavaScript'),('Servers'),('Network Security'),('Big Data'),('Algorithms'),('SPARK'),('SAS'),('Artificial Intelligence'),('Ruby');"
    client
        .query(insertQuery)
        .then(() => console.log("Inserted into technologies table successfully"))
        .catch((error) => console.log(error))

    // Prompts Table
    insertQuery =
        "INSERT INTO prompts (prompt) VALUES ('In 5 years time, I want to be...'),('The coolest side project I''ve built is...'),('The most impactful thing I''ve worked on is...'),('My favourite technology is... because...'),('I''m looking to change roles because...'),('The way I approach a problem is...'),('I''d be a great fit for this role because...'),('My biggest achievement is...'),('I want to work for a company that...'),('This opportunity excites me because...'),('In my next role, I''d like to...'),('My mantra is...'),('I get along best with people who...'),('What motivates me to come into work each day is...'),('Working with me looks like...'),('Beyond work, I''m really passionate about...'),('My best working patterns look like...'),('In order to produce my best work, I need...'),('I add value to teams by...'),('The stages of a project I work best at include...'),('The teams in which I thrive in are...'),('People often say I''m brilliant at...'),('In the last year, I''ve learnt...'),('The one thing you should know about me...'),('A life goal of mine is...'),('I want a job that...'),('If I was a superhero, my super power would be...'),('The animal I am most similar to is... because...'),('I am motivated by...'),('My greatest role model is...');"

    client
        .query(insertQuery)
        .then(() => console.log("Inserted into prompts table successfully"))
        .catch((error) => console.log(error))

    return

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
        "yearsInIndustryID":2,
        "technologies": [1,3,5,7,8]
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
        "yearsInIndustryID":4,
        "technologies": [1,3,5,7,8]
    }
  */

    // CandidatesTechnologies Table
    insertQuery =
        "INSERT INTO candidates_technologies (candidate_id, technology_id) VALUES (1, 10), (1, 4), (1, 6), (1, 3), (1, 7), (1, 1), (2, 4), (2, 6), (2, 11), (2, 1);"
    client
        .query(insertQuery)
        .then(() => console.log("Inserted into prompts table successfully"))
        .catch((error) => console.log(error))

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

    client.release()
}

insertDummyData()

/*

POST http://localhost:8080/company/register
    content-type: application/json

    {
        "companyEmail":"company@demo.com",
        "companyPassword":"Password123!",
        "companyPasswordConfirmation":"Password123!",
        "companyName":"Technology 4 us",
        "companyBio":"Technology 4 us (Ltd) is a leading provider of managed IT , Microsoft business solutions and consultancy for organisations across the United Kingdom. We pride ourselves on our ability to enable customer success through our exceptional people and powerful technologies. We seek to develop strong relationships that centre on helping you build a successful future for your organisation through the innovative use of technology. Unlike traditional IT service providers, we work as an extension of your team with a proactive approach to managing and developing your technology environment.",
        "companyLocation":"Manchester, UK",
        "numberOfEmployeesID":4,
        "femalePercentage": 55,
        "retentionRate": 85,
        "imageURL": "https://static.thenounproject.com/png/1384848-200.png"
    }

    {
        "companyEmail":"outstagram@email.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"Outstagram",
        "companyBio":"Outstagram is a Canadian photo and video sharing social networking service founded by Robin Sparkles and Maple Ross. The app allows users to upload media that can be edited with filters and organized by hashtags and geographical tagging which other users can browse by. Posts can be shared publicly or with pre-approved followers. We put people first, and value craft and simplicity in our work. Our teams inspire creativity around the world, helping people create and share.",
        "companyLocation":"Calgary, Canada",
        "numberOfEmployeesID":6,
        "femalePercentage": 34,
        "retentionRate": 75,
        "imageURL": "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-camera-512.png"
    }

{
        "companyEmail":"boogle@gmail.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"Boogle",
        "companyBio":"Boogle is a wealthfare company situated in Dallas aiming to help the people. We strive to provide Booglers and their loved ones with a world-class experience, focused on supporting their physical, financial, and emotional wellbeing. They’re thoughtfully designed to enhance your health and wellbeing, and generous enough to make it easy for you to take good care of yourself (now, and in the future). So we can build for everyone, together.",
        "companyLocation":"Dallas, USA",
        "numberOfEmployeesID":5,
        "femalePercentage":23,
        "retentionRate": 68,
        "imageURL": "https://icons.veryicon.com/png/o/business/circular-multi-color-function-icon/health-health.png"
    }

{
        "companyEmail":"britishfairways@flight.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"British Fairways",
        "companyBio":"British Fairways is a global airline, bringing people, places and diverse cultures closer together for more than 100 years. Serving our community is at the heart of everything we do, and we look strive to make everyone’s flight as fair as possible, no matter if you are first class, or eco-economy, we want to make sure everyone's experience is equal with our standards .We recognise that it has an environmental cost, which is why we’re taking action to tackle the effects it has on our planet.",
        "companyLocation":"London, UK",
        "numberOfEmployeesID":6,
        "femalePercentage":72,
        "retentionRate": 64,
        "imageURL": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Plane_icon.svg/1200px-Plane_icon.svg.png"
    }

{
        "companyEmail":"raccoon@conn.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"Racconconn",
        "companyBio":"Racconconn is one of the leading technological solution provider and it continuously leverages its expertise in software and hardware to integrate its unique manufacturing systems with emerging technologies. By capitalizing on its expertise in Cloud Computing, Mobile Devices, IoT, Big Data, AI, Smart Networks, and Robotics / Automation, the Group has expanded its capabilities which are key to driving its long-term growth strategy.",
        "companyLocation":"Busan, Republic of Korea",
        "numberOfEmployeesID":5,
        "femalePercentage":12,
        "retentionRate": 56,
        "imageURL": "https://static.thenounproject.com/png/2505432-200.png"
    }

{
        "companyEmail":"micro@hard.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"Microhard Corp.",
        "companyBio":"Our mission is to empower every person and every organisation on the planet to achieve more. Get the latest stories, resources and updates. We've helped people and organisations use technology to transform how they work, live and play. We have a generational opportunity to come together to build a better future marked by sustainable economic growth and opportunity for all.",
        "companyLocation":"Leicester, UK",
        "numberOfEmployeesID":2,
        "femalePercentage":54,
        "retentionRate": 86,
        "imageURL": "https://static.thenounproject.com/png/2405461-200.png"
    }

{
        "companyEmail":"doctor@bepper.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"Dr. Bepper",
        "companyBio":"Dr. Bepper, an online prescription app was officially launched in 2010 as a diagnosis/appointments app, but people wanted to have access to their medications at the same time as being diagnosed. Dandy, Matt, and a small team decided to make it a core feature that is available online so more people could experience the benefits of medication anytime, anywhere. Now the team has grown and the app has become more accessible to people outside of the UK",
        "companyLocation":"Luton, UK",
        "numberOfEmployeesID":3,
        "femalePercentage":78,
        "retentionRate": 89,
        "imageURL": "https://static.thenounproject.com/png/112279-200.png"
    }

{
        "companyEmail":"Akobi@flash.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"Akobi",
        "companyBio":"Creativity is in our DNA. Our game-changing innovations are redefining the possibilities of digital experiences. We connect content and data and introduce new technologies that democratise creativity, shape the next generation of storytelling and inspire entirely new categories of business. Great experiences have the power to inspire, transform and move the world forward. And every great experience starts with creativity.",
        "companyLocation":"Lugano, Italy",
        "numberOfEmployeesID":4,
        "femalePercentage":54,
        "retentionRate": 94,
        "imageURL": "https://static.thenounproject.com/png/84895-200.png"
    }


{
        "companyEmail":"sangsung@electronics.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"Sangsung Electronics",
        "companyBio":"Sangsung follows a simple business philosophy: to devote its talent and technology to creating superior products and services that contribute to a better global society. To achieve this, Sangsung sets a high value on its people and technologies. Sangsung believes that living by strong values is the key to good business. That’s why these core values, along with a rigorous code of conduct, are at the heart of every decision the company makes.",
        "companyLocation":"Akihabara, Japan",
        "numberOfEmployeesID":6,
        "femalePercentage":46,
        "retentionRate": 98,
        "imageURL": "https://static.thenounproject.com/png/1180247-200.png"
    }

{
        "companyEmail":"sangsung@electronics.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"Sangsung Electronics",
        "companyBio":"Sangsung follows a simple business philosophy: to devote its talent and technology to creating superior products and services that contribute to a better global society. To achieve this, Sangsung sets a high value on its people and technologies. Sangsung believes that living by strong values is the key to good business. That’s why these core values, along with a rigorous code of conduct, are at the heart of every decision the company makes.",
        "companyLocation":"Akihabara, Japan",
        "numberOfEmployeesID":6,
        "femalePercentage":46,
        "retentionRate": 98,
        "imageURL": "https://static.thenounproject.com/png/1180247-200.png"
    }

{
        "companyEmail":"kashco@wholesale.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"Kashco Wholesale",
        "companyBio":"Kashco Wholesale is a multi-billion dollar global retailer with warehouse club operations in eight countries. We are the recognized leader in our field, dedicated to quality in every area of our business and respected for our outstanding business ethics. Despite our large size and explosive international expansion, we continue to provide a family atmosphere in which our employees thrive and succeed.",
        "companyLocation":"Washington DC, USA",
        "numberOfEmployeesID":6,
        "femalePercentage":78,
        "retentionRate": 98,
        "imageURL": "https://static.thenounproject.com/png/249141-200.png"
    }


{
        "companyEmail":"jpberkan@email.com",
        "companyPassword":"Testing123!",
        "companyPasswordConfirmation":"Testing123!",
        "companyName":"J.P. Berkan",
        "companyBio":"J.P. Berkan is a global leader in financial services, offering solutions to the world's most important corporations, governments and institutions in more than 100 countries. As announced in early 2018, We will deploy $1.75 billion in philanthropic capital around the world by 2023. We also lead volunteer service activities for employees in local communities by utilizing our many resources, including those that stem from access to capital, economies of scale, global reach and expertise.",
        "companyLocation":"New York, USA",
        "numberOfEmployeesID":6,
        "femalePercentage":46,
        "retentionRate": 98,
        "imageURL": "https://icons-for-free.com/iconfiles/png/512/money+icon-1320184267002448371.png"
    }


POST http://localhost:8080/candidate/register
    content-type: application/json

    {
        "candidateEmail":"candidate@demo.com",
        "candidatePassword":"Password123!",
        "candidatePasswordConfirmation":"Password123!",
        "candidateName":"Lewis Rich",
        "headline":"Coder during day, Thinker during night",
        "candidatePhoneNumber":448470274837,
        "yearsInIndustryID":6,
        "technologies": [1,3,5,7,8,10,12,15,18,20]
    }

    {
        "candidateEmail":"james@spark.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"James Spark",
        "headline":"When the going gets tough, you get tougher. When the going get rough, you get rougher",
        "candidatePhoneNumber":449283710612,
        "yearsInIndustryID":2,
        "technologies": [2,4,8,9,12,15,20]
    }

    {
        "candidateEmail":"hayley@gunn.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Hayley Gunn",
        "headline":"Hard worker in the office, and someone you can rely on",
        "candidatePhoneNumber":449382220192,
        "yearsInIndustryID":4,
        "technologies": [1,2,4,8,9,11,14,19,21]
    }

    {
        "candidateEmail":"stacey@harbert.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Stacey Harbert",
        "headline":"I am Stacey Harbert, this name carries years of expertise and passion",
        "candidatePhoneNumber":444238971290,
        "yearsInIndustryID":3,
        "technologies": [2,12,14,18,19]
    }

    {
        "candidateEmail":"maria@wang.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Maria Wang",
        "headline":"Anything but common, I will show you that the only thing common with me is my name!",
        "candidatePhoneNumber":443578942430,
        "yearsInIndustryID":5,
        "technologies": [1,3,6,9,13,16,18]
    }

    {
        "candidateEmail":"mohammed@smith.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Mohammed Smith",
        "headline":"I have a high chance to have something in common with you, I guarantee it!",
        "candidatePhoneNumber":449346842347,
        "yearsInIndustryID":2,
        "technologies": [1,7,9,16,19]
    }

    {
        "candidateEmail":"ali@manser.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Ali Manser",
        "headline":"Coding is in my veins, technology is in my blood, I breathe languages, I am a 10 x developer",
        "candidatePhoneNumber":440789124024,
        "yearsInIndustryID":1,
        "technologies": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
    }

    {
        "candidateEmail":"charlie_lynx@manser.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Charlie Lynx",
        "headline":"The world is my oyster. So sit back and relax, cause’ I’m gonna shine",
        "candidatePhoneNumber":440239570789,
        "yearsInIndustryID":2,
        "technologies": [1,3,5,7,13,15,17]
    }

    {
        "candidateEmail":"nushi_miyamoto@hotmail.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Nushi Miyamoto",
        "headline":"There’s nothing outside of yourself that can ever enable you to get better, everything is within.",
        "candidatePhoneNumber":443807925238,
        "yearsInIndustryID":5,
        "technologies": [2,4,6,10,12,14,16,18]
    }

    {
        "candidateEmail":"lynn_you@hotmail.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Lynn You",
        "headline":"Technology is the spearhead to the future, and I want to be part of it",
        "candidatePhoneNumber":441140498132,
        "yearsInIndustryID":3,
        "technologies": [1,2,3,5,6,7,9,13,14,15]
    }

    {
        "candidateEmail":"brian_martin@hotmail.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Brian Martin",
        "headline":"Coding and Jazz, perfect in every way",
        "candidatePhoneNumber":444567475656,
        "yearsInIndustryID":2,
        "technologies": [1,3,7,9,12,15,18]
    }

    {
        "candidateEmail":"luke_cox@hotmail.com",
        "candidatePassword":"Testing123!",
        "candidatePasswordConfirmation":"Testing123!",
        "candidateName":"Luke Cox",
        "headline":"’D’yah like Jazz?’ - this is my feeling to code",
        "candidatePhoneNumber":440864213557,
        "yearsInIndustryID":3,
        "technologies": [1,3,7,8,9,13,16,17,18]
    }

*/
