import {Request} from 'express';
import jwt from 'jsonwebtoken';
import {UserIdWithToken} from '../interfaces/User';

// Validates a token from authorization header and returns a corresponding user object with empty values
// if the token is missing/invalid.
export default async (req: Request) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return {
      id: '',
      token: '',
      isAdmin: false,
    };
  }

  const token = bearer.split(' ')[1];

  if (!token) {
    return {
      id: '',
      token: '',
      isAdmin: false,
    };
  }

  const loggedInUser = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as UserIdWithToken;

  if (!loggedInUser) {
    return {
      id: '',
      token: '',
      isAdmin: false,
    };
  }

  loggedInUser.token = token;

  return loggedInUser;
};
