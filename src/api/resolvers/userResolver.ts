import {GraphQLError} from 'graphql';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';
import {User, UserIdWithToken} from '../../interfaces/User';

const AUTH_URL = process.env.AUTH_URL;

export default {
  Query: {
    // Fetch the list of users from the authentication service.
    users: async () => {
      const res = await fetch(`${AUTH_URL}/users`);

      if (!res.ok) {
        throw new GraphQLError(res.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }

      return (await res.json()) as User;
    },

    // Fetch a single user from the authentication service.
    userById: async (_parent: unknown, args: {id: string}) => {
      const res = await fetch(`${AUTH_URL}/users/${args.id}`);

      if (!res.ok) {
        throw new GraphQLError(res.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }

      return (await res.json()) as User;
    },
  },

  Mutation: {
    // Register a new user with the authentication service.
    register: async (_parent: unknown, args: {user: User}) => {
      const res = await fetch(`${AUTH_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.user),
      });

      if (!res.ok) {
        throw new GraphQLError(res.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }

      return (await res.json()) as User;
    },

    // Login a user with the authentication service.
    login: async (
      _parent: unknown,
      args: {credentials: {username: string; password: string}}
    ) => {
      const res = await fetch(`${AUTH_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.credentials),
      });

      if (!res.ok) {
        throw new GraphQLError(res.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }

      return (await res.json()) as LoginMessageResponse;
    },

    // Logout a user with the authentication service.
    updateUser: async (
      _parent: unknown,
      args: {user: User},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Unauthorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const response = await fetch(`${AUTH_URL}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(args.user),
      });

      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      return (await response.json()) as LoginMessageResponse;
    },

    // Logout a user with the authentication service.
    deleteUser: async (
      _parent: unknown,
      _args: unknown,
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Unauthorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const response = await fetch(`${AUTH_URL}/users`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      const deleteUser = (await response.json()) as LoginMessageResponse;
      return deleteUser;
    },
  },
};
