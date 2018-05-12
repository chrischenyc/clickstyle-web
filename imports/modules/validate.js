import validator from 'validator';
import _ from 'lodash';

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

export const validateStylistJoin = (mobile, address, services, referenceUrl) => {
  const errors = {};

  if (validator.isEmpty(mobile)) {
    errors.mobile = 'Mobile number is required';
  } else if (!validator.isMobilePhone(mobile, 'en-AU')) {
    errors.mobile = 'Invalid mobile number';
  } else if (validator.isEmpty(address)) {
    errors.address = 'Address is required';
  } else if (services.length === 0) {
    errors.services = 'Please pick at least one service you can offer';
  } else if (referenceUrl && referenceUrl.length >= 0 && !validator.isURL(referenceUrl)) {
    errors.referenceUrl = 'Reference link is invalid';
  }

  return errors;
};

/*
Sample return
{
  serviceId: {
    basePrice: "Please assign an amount",
    addonId: {
      name: "Please input add-on name",
      price: "Please assign an amount"
    }
  }
}
*/
export const validateStylistServices = (services) => {
  const errors = {};

  services.forEach((service) => {
    if (!service.basePrice || parseInt(service.basePrice) <= 0) {
      _.set(errors, `${service._id}.basePrice`, 'Please assign an amount');
    }

    if (!service.baseDuration || parseInt(service.baseDuration) <= 0) {
      _.set(errors, `${service._id}.baseDuration`, 'Please assign a duration');
    }

    if (service.addons) {
      service.addons.forEach((addon) => {
        if (validator.isEmpty(addon.name)) {
          _.set(errors, `${service._id}.${addon._id}.name`, 'Please input add-on name');
        }

        if (!addon.price || parseInt(addon.price) <= 0) {
          _.set(errors, `${service._id}.${addon._id}.price`, 'Please assign an amount');
        }

        if (!addon.duration || parseInt(addon.duration) <= 0) {
          _.set(errors, `${service._id}.${addon._id}.duration`, 'Please assign a duration');
        }
      });
    }
  });

  return errors;
};

export const validateStylistOpenHours = (openHours) => {
  const errors = {};

  openHours.forEach((openHour) => {
    const openAtHour = parseInt(openHour.openAt.split(':')[0]);
    const openAtMinute = parseInt(openHour.openAt.split(':')[1]);
    const closeAtHour = parseInt(openHour.closeAt.split(':')[0]);
    const closeAtMinute = parseInt(openHour.closeAt.split(':')[1]);

    if (
      openHour.open &&
      (openAtHour > closeAtHour || (openAtHour === closeAtHour && openAtMinute >= closeAtMinute))
    ) {
      _.set(errors, `${openHour.day}`, "'Available from' must be earlier than 'Available to'");
    }
  });

  return errors;
};

export const validateBooking = (cart) => {
  const {
    email,
    firstName,
    lastName,
    mobile,
    address,
    date,
    time,
    creditCardNameOnCard,
    useSavedCard,
  } = cart;

  const errors = {};

  if (validator.isEmpty(firstName)) {
    errors.firstName = 'first name is required';
  } else if (validator.isEmpty(lastName)) {
    errors.lastName = 'last name is required';
  } else if (validator.isEmpty(email)) {
    errors.email = 'email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'invalid email';
  } else if (validator.isEmpty(mobile)) {
    errors.mobile = 'Mobile number is required';
  } else if (!validator.isMobilePhone(mobile, 'en-AU')) {
    errors.mobile = 'Invalid mobile number';
  } else if (validator.isEmpty(address)) {
    errors.address = 'Address is required';
  } else if (!useSavedCard && validator.isEmpty(creditCardNameOnCard)) {
    errors.creditCardNameOnCard = 'Name on Card is required';
  } else if (validator.isEmpty(date)) {
    errors.creditCardNameOnCard = 'Booking date is required';
  } else if (validator.isEmpty(time)) {
    errors.creditCardNameOnCard = 'Booking time is required';
  }

  return errors;
};

export const validateContactForm = (name, email, phone, subject, message) => {
  const errors = {};

  if (validator.isEmpty(email)) {
    errors.email = 'email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'invalid email';
  } else if (validator.isEmpty(message)) {
    errors.message = 'please fill in the message';
  }

  return errors;
};
