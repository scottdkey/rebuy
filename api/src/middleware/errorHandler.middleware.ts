import { ErrorRequestHandler } from "express"


// this is the top level error handler, it must be used after all the routers are added, ensuring that everything is caught, parsed, and logged
// in production a request handler should also exist, this was not done for this exercise
export const ErrorHandler: ErrorRequestHandler = (err, _, res, __) => {
  const errStatus = err.status || err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';
  const error = {
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  }
  console.error('error handler', error);

  res.status(errStatus).send(error)
}