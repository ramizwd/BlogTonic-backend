/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import expect from 'expect';
import {UserTest} from '../src/interfaces/User';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';

/* test for graphql query
mutation Register($user: UserInput!) {
  register(user: $user) {
    user {
      id
      email
      username
    }
  }
}
 */
const createUser = (
  url: string | Function,
  user: UserTest
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `mutation Register($user: UserInput!) {
                    register(user: $user) {
                        message
                        user {
                            id
                            email
                            username
                        }
                    }
                }`,
        variables: {
          user: {
            username: user.username,
            email: user.email,
            password: user.password,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.register;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.username).toBe(user.username);
          expect(userData.user.email).toBe(user.email);
          resolve(response.body.data.register);
        }
      });
  });
};

/* test for graphql query
mutation Login($credentials: Credentials!) {
  login(credentials: $credentials) {
    message
    user {
      id
      email
      username
    }
    token
  }
}
*/
const login = (
  url: string | Function,
  user: UserTest
): Promise<LoginMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `mutation Login($credentials: Credentials!) {
                    login(credentials: $credentials) {
                        message
                        user {
                            id
                            email
                            username
                        }
                        token
                    }
                }`,
        variables: {
          credentials: {
            username: user.email,
            password: user.password,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.login;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.username).toBe(user.username);
          expect(userData.user.email).toBe(user.email);
          expect(userData).toHaveProperty('token');
          resolve(response.body.data.login);
        }
      });
  });
};

const getUsers = (url: string | Function): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: '{users{id username email}}',
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.users;
          expect(userData).toBeInstanceOf(Array);
          expect(userData[0]).toHaveProperty('id');
          expect(userData[0]).toHaveProperty('username');
          expect(userData[0]).toHaveProperty('email');
          resolve(response.body.data.users);
          resolve(response.body);
        }
      });
  });
};

/* test for graphql query
query UsersById($userByIdId: ID!) {
  userById(id: $userByIdId) {
    email
    id
    username
  }
}
*/
const getUserById = (url: string | Function, id: string): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `query UsersById($userByIdId: ID!) {
                    userById(id: $userByIdId) {
                        email
                        id
                        username
                    }
                }`,
        variables: {
          userByIdId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.userById;
          expect(userData).toHaveProperty('id');
          expect(userData).toHaveProperty('username');
          expect(userData).toHaveProperty('email');
          resolve(response.body.data.userById);
          resolve(response.body);
        }
      });
  });
};

export {createUser, login, getUsers, getUserById};
