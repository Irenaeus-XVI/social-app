import Joi from "joi";

export const updateEmail = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['com', 'net'] } }).trim().required(),
}).required();

export const resetEmail = Joi.object().keys({
  oldCode: Joi.string().min(4).max(4).required(),
  newCode: Joi.string().min(4).max(4).required(),
}).required();