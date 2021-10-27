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
    candidatePhoneNumber,
    yearsInIndustryID,
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

exports.isInputEmpty = function isInputEmpty(input) {
  if (input.length < 1) {
    return true;
  }
  return false;
};
