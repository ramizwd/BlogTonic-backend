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

    // Update a post with graphql.
    updatePost: async (
      _parent: unknown,
      {updatePost}: {updatePost: Post},
      {id, token}: UserIdWithToken
    ) => {
      if (!token) {
        throw new GraphQLError('You are not authorized to update a blog', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const author = id as unknown as User;

      const post = await postModel.findById(updatePost.id);

      if (!post) {
        throw new GraphQLError('Post not found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }

      // Check if the current user is the author of the post.
      if (post.author.toString() !== author.toString()) {
        throw new GraphQLError('You are not authorized to update this blog', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const updatedPost = await postModel.findByIdAndUpdate(
        updatePost.id,
        {
          ...updatePost,
          author,
        },
        {new: true}
      );
      return updatedPost;
    },
  },
};
