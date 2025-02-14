import Joi from "joi";

export const signup = Joi.object().keys({
  userName: Joi.string().min(3).max(50).trim().required(),
  email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net'] } }).trim().required(),
  password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])/)).min(6).max(50).required(),
  confirmationPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Confirmation password must match the original password.',
    }),

}).required();  