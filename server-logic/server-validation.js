function isValidEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isValidPassword(password) {
  const digitRegex = /\d/;
  const lowerCaseRegex = /[a-z]/;
  const upperCaseRegex = /[A-Z]/;
  const symbolRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return (
    password.length >= 8 &&
    digitRegex.test(password) &&
    lowerCaseRegex.test(password) &&
    upperCaseRegex.test(password) &&
    symbolRegex.test(password)
  );
}

exports.isValidJobDetails = function isValidJobDetails(jobDetails) {
  const {
    jobTitle,
    jobDesc,
    location,
    salary,
    keyResponsibilities,
    keyTechnologies,
  } = jobDetails;
  if (jobTitle.length < 1) {
    return "No job title inserted";
  }
  if (jobDesc.length < 1) {
    return "No job description inserted";
  }
  if (location.length < 1) {
    return "No location inserted";
  }
  if (salary.length < 1) {
    return "No salary inserted";
  }
  if (keyResponsibilities.length < 1) {
    return "No key responsibilities inserted";
  }
  if (keyTechnologies.length < 1) {
    return "No key technologies inserted";
  }
  return true;
};

exports.isValidCandidate = function isValidCandidate(candidateDetails) {
  const {
    candidateEmail,
    candidatePassword,
    candidatePasswordConfirmation,
    candidateName,
    headline,
    candidatePhoneNumber,
    yearsInIndustryID,
    technologies,
  } = candidateDetails;

  const validAccountResponse = isValidAccountDetails(
    candidateEmail,
    candidatePassword,
    candidatePasswordConfirmation
  );

  if (validAccountResponse !== true) {
    return validAccountResponse;
  }
  if (candidateName.length < 1) {
    return "Candidate name not specified!";
  }
  if (headline.length < 1) {
    return "Headline not specified!";
  }
  if (
    candidatePhoneNumber.toString().length !== 12 ||
    typeof candidatePhoneNumber !== "number"
  ) {
    return "Candidate phone number not valid!";
  }
  if (yearsInIndustryID === undefined || yearsInIndustryID === null) {
    return "Years in industry not specified!";
  }
  if (yearsInIndustryID > 5 || yearsInIndustryID < 1) {
    return "Years in industry is out of range!";
  }
  if (technologies.length < 1) {
    return "No technologies selected";
  }
  return true;
};

exports.isValidCompany = function isValidCompany(companyDetails) {
  const {
    companyEmail,
    companyPassword,
    companyPasswordConfirmation,
    companyName,
    companyBio,
    numberOfEmployeesID,
    femalePercentage,
    retentionRate,
    imageURL,
  } = companyDetails;

  const validCompanyResponse = isValidAccountDetails(
    companyEmail,
    companyPassword,
    companyPasswordConfirmation
  );

  if (validCompanyResponse !== true) {
    return validCompanyResponse;
  }
  if (companyName.length < 1) {
    return "No Company name inserted";
  }
  if (companyBio.length < 1) {
    return "No Company bio inserted";
  }
  if (numberOfEmployeesID === undefined || numberOfEmployeesID === null) {
    return "Number of employees not specified";
  }
  if (femalePercentage === undefined || femalePercentage === null) {
    return "Female percentage not specified";
  }
  if (retentionRate === undefined || retentionRate === null) {
    return "Retention rate not specified";
  }
  if (imageURL.length < 1) {
    return "Image URL not specified";
  }
  return true;
};

exports.isValidApplication = function isValidApplication(applicationDetails) {
  const {
    candidateID,
    jobID,
    prompt1,
    answer1,
    prompt2,
    answer2,
    prompt3,
    answer3,
  } = applicationDetails;
  if (candidateID === undefined || candidateID === null) {
    return "Candidate account not specified";
  }
  if (jobID === undefined || jobID === null) {
    return "Job applying for not specified";
  }
  if (prompt1 === undefined || prompt1 === null) {
    return "First prompt not given";
  }
  if (prompt2 === undefined || prompt2 === null) {
    return "Second prompt not given";
  }
  if (prompt3 === undefined || prompt3 === null) {
    return "Third prompt not given";
  }
  if (answer1.length < 1) {
    return "No answer for question 1";
  }
  if (answer2.length < 1) {
    return "No answer for question 2";
  }
  if (answer3.length < 1) {
    return "No answer for question 3";
  }
  return true;
};

exports.isValidCandidateUpdate = function isValidCandidateUpdate(
  updatedDetails
) {
  const {
    candidateEmail,
    candidatePassword,
    candidatePasswordConfirmation,
    candidateName,
    headline,
    candidatePhoneNumber,
    yearsInIndustryID,
  } = updatedDetails;
  if (candidatePassword.length > 1 || candidatePasswordConfirmation > 1) {
    const validUpdateResponse = isValidAccountDetails(
      candidateEmail,
      candidatePassword,
      candidatePasswordConfirmation
    );
    if (validUpdateResponse !== true) {
      return validUpdateResponse;
    }
  } else {
    if (!isValidEmail(candidateEmail)) {
      return "Email isn't a valid email!";
    }
  }
  if (candidateName.length < 1) {
    return "Candidate name not specified!";
  }
  if (headline.length < 1) {
    return "Headline not specified!";
  }
  if (
    candidatePhoneNumber.toString().length !== 12 ||
    typeof candidatePhoneNumber !== "number"
  ) {
    return "Candidate phone number not valid!";
  }
  if (yearsInIndustryID === undefined || yearsInIndustryID === null) {
    return "Years in industry not specified!";
  }
  if (yearsInIndustryID > 5 || yearsInIndustryID < 1) {
    return "Years in industry is out of range!";
  }
  return true;
};

exports.isValidCompanyUpdate = function isValidCompanyUpdate(updatedDetails) {
  const {
    companyEmail,
    companyPassword,
    companyPasswordConfirmation,
    companyName,
    companyBio,
    numberOfEmployeesID,
    femalePercentage,
    retentionRate,
    imageURL,
  } = updatedDetails;

  if (companyPassword.length > 1 || companyPasswordConfirmation > 1) {
    const validUpdateResponse = isValidAccountDetails(
      companyEmail,
      companyPassword,
      companyPasswordConfirmation
    );
    if (validUpdateResponse !== true) {
      return validUpdateResponse;
    }
  } else {
    if (!isValidEmail(companyEmail)) {
      return "Email isn't a valid email!";
    }
  }
  if (companyName.length < 1) {
    return "No Company name inserted";
  }
  if (companyBio.length < 1) {
    return "No Company bio inserted";
  }
  if (numberOfEmployeesID === undefined || numberOfEmployeesID === null) {
    return "Number of employees not specified";
  }
  if (femalePercentage === undefined || femalePercentage === null) {
    return "Female percentage not specified";
  }
  if (retentionRate === undefined || retentionRate === null) {
    return "Retention rate not specified";
  }
  if (imageURL.length < 1) {
    return "Image URL not specified";
  }
  return true;
};

function isValidAccountDetails(email, password, confirmation) {
  if (!isValidEmail(email)) {
    return "Email isn't a valid email!";
  }
  if (password !== confirmation) {
    return "Confirmation password isn't the same as the password!";
  }
  if (!isValidPassword(password)) {
    return "Password isn't valid, it doesn't contain the necessary values!";
  }
  return true;
}
