import mongoose from 'mongoose';
import app from '../src/app';
import {getNotFound} from './testFunctions';
import randomstring from 'randomstring';
import {UserTest} from '../src/interfaces/User';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import {createUser, getUserById, getUsers, login} from './userFunctions';

const DATABASE_URL = process.env.DATABASE_URL as string;

describe('GraphQL API tests', () => {
  beforeAll(async () => {
    await mongoose.connect(DATABASE_URL);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it('should respond with not found message', async () => {
    await getNotFound(app);
  });

  let userData: LoginMessageResponse;
  let userData2: LoginMessageResponse;

  const testUser: UserTest = {
    username: 'TestUser' + randomstring.generate(7),
    email: randomstring.generate(9).toLowerCase() + '@user.com',
    password: 'testpassword1234!',
  };

  const testUser2: UserTest = {
    username: 'TestUser' + randomstring.generate(7),
    email: randomstring.generate(9).toLowerCase() + '@user.com',
    password: 'testpassword1234!',
  };

  // create first user
  it('should create a new user', async () => {
    await createUser(app, testUser);
  });

  // create second user to try to modify someone else's blog and userdata
  it('should create second user', async () => {
    await createUser(app, testUser2);
  });

  // test login
  it('should login user', async () => {
    userData = await login(app, testUser);
  });

  // test login with second user
  it('should login second user', async () => {
    userData2 = await login(app, testUser2);
  });

  // test get all users
  it('should return an array of users', async () => {
    await getUsers(app);
  });

  // test get single user
  it('should return single user', async () => {
    await getUserById(app, userData.user.id!);
  });
});
