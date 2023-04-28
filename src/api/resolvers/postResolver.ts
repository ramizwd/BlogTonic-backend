import {GraphQLError} from 'graphql';
import postModel from '../models/postModel';
import {Post} from '../../interfaces/Post';
import {User, UserIdWithToken} from '../../interfaces/User';

export default {
  Query: {
    // Fetch the list from graphql.
    posts: async () => {
      return await postModel.find();
    },

    // Fetch a single post from graphql.
    postById: async (_parent: unknown, args: Post) => {
      return await postModel.findById(args.id);
    },

    // Fetch a single post from graphql.
    postsByAuthorId: async (_parent: unknown, args: {authorId: string}) => {
      return await postModel.find({author: args.authorId});
    },
  },

  Mutation: {
    // Create a new post with graphql.
    createPost: async (
      _parent: unknown,
      args: Post,
      {id, token}: UserIdWithToken
    ) => {
      if (!token) {
        throw new GraphQLError('You are not authorized to publish a blog', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const author = id as unknown as User;
      const newPost = new postModel({...args, author});
      return await newPost.save();
    },
  },
};
