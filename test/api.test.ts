import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../src/app';
import {getNotFound} from './testFunctions';
import randomstring from 'randomstring';
import {UserTest} from '../src/interfaces/User';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  login,
  loginBrute,
  updateUser,
} from './userFunctions';

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

  // make sure token has role (so that we can test if user is admin or not)
  it('token should have role', async () => {
    const dataFromToken = jwt.verify(
      userData.token!,
      process.env.JWT_SECRET as string
    );
    expect(dataFromToken).toHaveProperty('isAdmin');
  });

  // test update user
  it('should update user', async () => {
    await updateUser(app, userData.token!);
  });

  // test delete user based on token
  it('should delete current user', async () => {
    await deleteUser(app, userData.token!);
  });

  //   test brute force protection
  //   test('Brute force attack simulation', async () => {
  //     const maxAttempts = 20;
  //     const mockUser: UserTest = {
  //       username: 'TestUser' + randomstring.generate(7),
  //       email: randomstring.generate(9).toLowerCase() + '@user.com',
  //       password: 'wrongpassword123!',
  //     };

  //     try {
  //       for (let i = 0; i < maxAttempts; i++) {
  //         const result = await loginBrute(app, mockUser);
  //         if (result) throw new Error('Brute force attack unsuccessful');
  //       }

  //       throw new Error('Brute force attack succeeded');
  //     } catch (error) {
  //       console.log(error);
  //       expect((error as Error).message).toBe('Brute force attack unsuccessful');
  //     }
  //   }, 15000);
});
