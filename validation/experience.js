const Validator = require('validator');
const isEmpty = require('./is-empty');


function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  // Check title
  if (Validator.isEmpty(data.title)) {
    errors.title = 'Job title field is required';
  }

  // Check company
  if (Validator.isEmpty(data.company)) {
    errors.company = 'Company field is required';
  }

  // Check from date
  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}


module.exports = validateExperienceInput;
