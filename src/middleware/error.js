import winston from 'winston';

export const handleError = (err, req, res) => {
  winston.error(err.message, err);
  res.status(500).send(err.message);
};
