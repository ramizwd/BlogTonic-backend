/* eslint-disable node/no-unpublished-import */
import request from 'supertest';
import expect from 'expect';
import {UserTest} from '../src/interfaces/User';
import LoginMessageResponse from '../src/interfaces/LoginMessageResponse';
import randomstring from 'randomstring';
import ErrorResponse from '../src/interfaces/ErrorResponse';

// TODO: Wrong user delete user

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
          expect(userData.user.email).toBe(user.email);
          expect(userData).toHaveProperty('token');
          resolve(response.body.data.login);
        }
      });
  });
};

const loginBrute = (
  url: string | Function,
  user: UserTest
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
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
          if (
            response.body.errors?.[0]?.message ===
            'You have been blocked from logging in'
          ) {
            console.log('brute force blocked', response.body.errors[0].message);
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
  });
};

/* test for graphql query
query Users {
  users {
    email
    id
    username
  }
}
*/
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

/* test for graphql query
mutation UpdateUser($user: UserModify!) {
  updateUser(user: $user) {
    message
    user {
      email
      id
      username
    }
  }
}
*/
const updateUser = (url: string | Function, token: string) => {
  return new Promise((resolve, reject) => {
    const newUser = 'newUser' + randomstring.generate(5);
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation UpdateUser($user: UserModify!) {
                    updateUser(user: $user) {
                        message
                        user {
                            email
                            id
                            username
                        }
                    }
                }`,
        variables: {
          user: {
            username: newUser,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.updateUser;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.username).toBe(newUser);
          resolve(response.body.data.updateUser);
        }
      });
  });
};

/* test for graphql query
mutation DeleteUser {
  deleteUser {
    message
    user {
      email
      id
      username
    }
  }
}
*/
const deleteUser = (
  url: string | Function,
  token: string
): Promise<ErrorResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteUser {
                    deleteUser {
                        message
                        user {
                            email
                            id
                            username
                        }
                    }
                }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.deleteUser;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          resolve(response.body.data.deleteUser);
        }
      });
  });
};

/* test for graphql query
mutation DeleteUserAsAdmin($deleteUserAsAdminId: ID!) {
  deleteUserAsAdmin(id: $deleteUserAsAdminId) {
    user {
      id
    }
  }
}
*/
const deleteUserAsAdmin = (
  url: string | Function,
  id: string,
  token: string
): Promise<ErrorResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteUserAsAdmin($deleteUserAsAdminId: ID!) {
            deleteUserAsAdmin(id: $deleteUserAsAdminId) {
              user {
                id
              }
            }
          }`,
        variables: {
          deleteUserAsAdminId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.deleteUserAsAdmin;
          expect(userData.user.id).toBe(id);
          resolve(response.body.data.deleteUser);
        }
      });
  });
};

/* test for graphql query
mutation UpdateUserAsAdmin($updateUserAsAdminId: ID!, $user: UserModify!) {
  updateUserAsAdmin(id: $updateUserAsAdminId, user: $user) {
    user {
      id
      email
      username
    }
    message
  }
}
*/
const updateUserAsAdmin = (
  url: string | Function,
  id: string,
  token: string
): Promise<ErrorResponse> => {
  return new Promise((resolve, reject) => {
    const newUser = 'newUser' + randomstring.generate(5);
    request(url)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation UpdateUserAsAdmin($updateUserAsAdminId: ID!, $user: UserModify!) {
                    updateUserAsAdmin(id: $updateUserAsAdminId, user: $user) {
                        user {
                            id
                            email
                            username
                        }
                        message
                    }
                }`,
        variables: {
          updateUserAsAdminId: id,
          user: {
            username: newUser,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.updateUserAsAdmin;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user).toHaveProperty('username');
          expect(userData.user).toHaveProperty('email');
          resolve(response.body.data.updateUserAsAdmin);
        }
      });
  });
};

export {
  createUser,
  login,
  loginBrute,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserAsAdmin,
  deleteUserAsAdmin,
};
