import {NextFunction, Request, Response} from 'express';
import CustomError from '../classes/CustomError';
import {HTTP_STATUS_CODES} from '../utils/constants';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET not defined');
}

// Middleware to authenticate a user.
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new CustomError(
        'Authentication failed',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);

    if (!decodedToken) {
      throw new CustomError(
        'Authentication failed',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    next();
  } catch (error) {
    next(
      new CustomError('Authentication failed', HTTP_STATUS_CODES.UNAUTHORIZED)
    );
  }
};
