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

interface UserTest {
  id?: string;
  username?: string;
  userName?: string;
  email?: string;
  password?: string;
  token?: string;
}

export {User, UserIdWithToken, UserTest};
