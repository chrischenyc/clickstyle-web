import validator from 'validator';

export const validateUserLogin = (email, password) => {
  const errors = {};

  if (validator.isEmpty(email)) {
    errors.email = 'email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'invalid email';
  } else if (validator.isEmpty(password)) {
    errors.password = 'password is required';
  } else if (password.length < 6) {
    errors.password = 'password needs to have at least 6 characters';
  }

  return errors;
};

export const validateUserSignUp = (email, password, confirm) => {
  const errors = {};

  if (validator.isEmpty(email)) {
    errors.email = 'email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'invalid email';
  } else if (validator.isEmpty(password)) {
    errors.password = 'password is required';
  } else if (password.length < 6) {
    errors.password = 'password needs to have at least 6 characters';
  } else if (password !== confirm) {
    errors.confirm = 'password does not match the confirm password';
  }

  return errors;
};
