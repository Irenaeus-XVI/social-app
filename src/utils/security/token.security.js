import jwt from 'jsonwebtoken';
export const generateToken = ({ payload = {}, signature = process.env.USER_ACCESS_TOKEN, expiresIn = process.env.EXPIRE_IN }) => {
  return jwt.sign(payload, signature, { expiresIn: parseInt(expiresIn) });
}

export const verifyToken = ({ token = "", signature = process.env.JWT_SECRET }) => {
  return jwt.verify(token, signature);
}