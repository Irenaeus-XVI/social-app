export const globalErrorHandling = (err, req, res, next) => {
  process.env.MOD == 'DEV' ?
    res.status(err.statusCode || 500).json({ err: err.message, stack: err.stack })
    : res.status(err.statusCode || 500).json({ success: false, err: err.message, status: err.statusCode , stack: err.stack });
};