import {Document} from 'mongoose';

interface User extends Document {
  username: string;
  email: string;
  password: string;
}

interface UserIdWithToken {
  id: string;
  token: string;
  isAdmin: boolean;
}

export {User, UserIdWithToken};
