import validator from 'validator';

export const validateUserSignUp = (email, firstName, lastName, password) => {
  const errors = {};

  if (validator.isEmpty(email)) {
    errors.email = 'email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'invalid email';
  } else if (validator.isEmpty(firstName)) {
    errors.firstName = 'first name is required';
  } else if (validator.isEmpty(lastName)) {
    errors.lastName = 'last name is required';
  } else if (validator.isEmpty(password)) {
    errors.password = 'password is required';
  } else if (password.length < 6) {
    errors.password = 'password needs to have at least 6 characters';
  }

  return errors;
};

export const validateEmail = (email) => {
  const errors = {};

  if (validator.isEmpty(email)) {
    errors.email = 'email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'invalid email';
  }

  return errors;
};

export const validateResetPassword = (password, confirm) => {
  const errors = {};

  if (validator.isEmpty(password)) {
    errors.password = 'password is required';
  } else if (password.length < 6) {
    errors.password = 'password needs to have at least 6 characters';
  } else if (password !== confirm) {
    errors.confirm = 'New passwords did not match. Please try again.';
  }

  return errors;
};

export const validateChangePassword = (oldPassword, password, confirm) => {
  const errors = {};

  if (validator.isEmpty(oldPassword)) {
    errors.oldPassword = 'old password is required';
  } else if (oldPassword.length < 6) {
    errors.oldPassword = 'old password needs to have at least 6 characters';
  } else if (validator.isEmpty(password)) {
    errors.password = 'new password is required';
  } else if (password.length < 6) {
    errors.password = 'new password needs to have at least 6 characters';
  } else if (password === oldPassword) {
    errors.password = 'new password cannot be same as old password';
  } else if (password !== confirm) {
    errors.confirm = 'New passwords did not match. Please try again.';
  }

  return errors;
};

export const validateEditProfile = (profile) => {
  const errors = {};

  if (validator.isEmpty(profile.name.first)) {
    errors['name.first'] = 'first name is required';
  }

  if (validator.isEmpty(profile.name.last)) {
    errors['name.last'] = 'last name is required';
  }

  if (
    profile.mobile &&
    !validator.isEmpty(profile.mobile) &&
    !validator.isMobilePhone(profile.mobile, 'en-AU')
  ) {
    errors.mobile = 'invalid mobile phone number';
  }

  return errors;
};
