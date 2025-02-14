export const successResponse = ({ res, status = 200, data = {}, message = "success" } = {}) => {
  console.log(`data`, data);
  
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}