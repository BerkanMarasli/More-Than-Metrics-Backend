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

function isValidAccountDetails(email, password, confirmation, res) {
  if (!isValidEmail(email)) {
    res.status(400).send("Email isn't a valid email");
    return false;
  }
  if (password !== confirmation) {
    res
      .status(400)
      .send("Confirmation password isn't the same as the password");
    return false;
  }
  if (!isValidPassword(password)) {
    res
      .status(400)
      .send("Password isn't valid, it doesn't contain the necessary values");
    return false;
  }
  return true;
}

exports.isValidCompany = function isValidCompany(companyDetails, res) {
  const [
    company_email,
    company_password,
    company_password_confirmation,
    company_name,
    company_bio,
    number_of_employees_id,
    female_percentage,
    retention_rate,
  ] = companyDetails;
  // if (!isValidEmail(company_email)) {
  //   res.status(400).send("Email isn't a valid email");
  //   return false;
  // }
  // if (company_password !== company_password_confirmation) {
  //   res
  //     .status(400)
  //     .send("Confirmation password isn't the same as the password");
  //   return false;
  // }
  // if (!isValidPassword(company_password)) {
  //   res
  //     .status(400)
  //     .send("Password isn't valid, it doesn't contain the necessary values");
  //   return false;
  // }
  if (
    !isValidAccountDetails(
      company_email,
      company_password,
      company_password_confirmation,
      res
    )
  ) {
    res.status(400).send("Bad account details");
  }
  if (company_name.length < 1) {
    res.status(400).send("No Company name inserted");
    return false;
  }
  if (company_bio.length < 1) {
    res.status(400).send("No Company bio inserted");
    return false;
  }
  if (number_of_employees_id === undefined || number_of_employees_id === null) {
    res.status(400).send("Number of employees not specified");
    return false;
  }
  if (female_percentage === undefined || female_percentage === null) {
    res.status(400).send("Female percentage not specified");
    return false;
  }
  if (retention_rate === undefined || retention_rate === null) {
    res.status(400).send("Retention rate not specified");
    return false;
  }
  return true;
};

exports.isValidCandidate = function isValidCandidate(candidateDetails, res) {
  const [
    candidate_email,
    candidate_password,
    candidate_password_confirmation,
    candidate_name,
    candidate_phone,
    years_in_industry_id,
  ] = candidateDetails;
  // if (!isValidEmail(candidate_email)) {
  //   res.status(400).send("Email isn't a valid email");
  //   return false;
  // }
  // if (candidate_password !== candidate_password_confirmation) {
  //   res
  //     .status(400)
  //     .send("Confirmation password isn't the same as the password");
  //   return false;
  // }
  // if (!isValidPassword(candidate_password)) {
  //   res
  //     .status(400)
  //     .send("Password isn't valid, it doesn't contain the necessary values");
  //   return false;
  // }
  if (
    !isValidAccountDetails(
      candidate_email,
      candidate_password,
      candidate_password_confirmation,
      res
    )
  ) {
    res.status(400).send("Bad account details");
  }
  if (candidate_name.length < 1) {
    res.status(400).send("Candidate name not specified");
    return false;
  }
  if (candidate_phone.length !== 12 || typeof candidate_phone !== "number") {
    res.status(400).send("Candidate phone number not valid");
    return false;
  }
  if (years_in_industry_id === undefined || years_in_industry_id === null) {
    res.status(400).send("Years in industry not specified");
    return false;
  }
  return true;
};
