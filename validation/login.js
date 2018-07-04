const Validator = require('validator');
const isEmpty = require('./is-empty');


function validateRegisterInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  // Check email
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email format is invalid';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  // Check password
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}


module.exports = validateRegisterInput;
