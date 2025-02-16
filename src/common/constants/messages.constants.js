
export const generateMessage = (entity) => ({
  AlreadyExists: `${entity} already exists!`,
  NotFound: `${entity} not found!`,
  FailedToCreate: `Failed to create ${entity}!`,
  FailedToUpdate: `Failed to update ${entity}!`,
  FailedToDelete: `Failed to delete ${entity}!`,
});

export const message = {
  user: {
    ...generateMessage('User'),
    CreatedSuccess: 'User created successfully!',
    Confirmed: 'User already confirmed!',
    InvalidOTP: 'Invalid OTP!',
    ConfirmedSuccess: 'User confirmed successfully!',
    Verify: 'Please verify your email!',
    Invalid_Credentials: 'Invalid credentials!',
    Unauthorize: 'Unauthorized!',
    OTP_Sent: 'OTP sent successfully!',
    OTP_Verified: 'OTP verified successfully!',
    Password_Updated: 'Password updated successfully!',
    Forbidden: 'Forbidden!',
    Banned: 'User is banned!',
  },
  INVALID_OBJECT_ID: 'Invalid object id!',
  OTP:{
    ...generateMessage('OTP'),
    OTP_Expired: 'OTP expired!',
  }
};