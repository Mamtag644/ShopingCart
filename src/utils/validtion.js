
//<---------------------------Validations : String----------------------------->//
const isValidString = function (value) {
    if (typeof value === undefined || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false  
    return true
}

//<---------------------------Validations : Mobile Number----------------------------->//
const isValidMobileNo=function(mobile){
  const regexMob=/[6-9]{1}[0-9]{9}/
  return regexMob.test(mobile)
}

//<---------------------------Validations : Email----------------------------->//
const isValidEmail=function(email){
  const regexEmail=/[a-zA-Z_1-90]{3,}@[A-za-z]{3,}[.]{1}[a-zA-Z]{2,}/
  return regexEmail.test(email)
}

//<---------------------------Validations : Password----------------------------->//
const isValidPassword = function (password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/
  return passwordRegex.test(password);
}

const isValidpincode = function (pincode) {
  const reg = /^[0-9]{6}$/;
  return reg.test(String(pincode));
};

const isValidDate = function(date){
  let regexDate = /^^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
  return regexDate.test(date)
}

const isValidBody = (data)=> {
  return Object.keys(data).length > 0;
}


module.exports = { isValidString , isValidMobileNo , isValidEmail , isValidPassword , isValidpincode , isValidDate ,isValidBody}