export const successResponse = ({ res, status = 200, data = {}, message = "success" } = {}) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}