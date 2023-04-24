declare global {
  import {Types} from 'mongoose';
  namespace Express {
    interface User {
      email: string;
      password: string;
      role: boolean;
      username: string;
      _id: Types.ObjectId;
    }
  }
}
