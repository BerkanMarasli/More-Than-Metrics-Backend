exports.isValidEmail = function isValidEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

exports.isValidPassword = function isValidPassword(password) {
  const digitRegex = /\d/
  const lowerCaseRegex = /[a-z]/
  const upperCaseRegex = /[A-Z]/
  const symbolRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
  return (
    password.length >= 8 &&
    digitRegex.test(password) &&
    lowerCaseRegex.test(password) &&
    upperCaseRegex.test(password) &&
    symbolRegex.test(password)
  )
}
