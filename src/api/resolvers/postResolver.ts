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

    // Fetch user liked posts from graphql.
    postsLikedByUserId: async (_parent: unknown, args: {userId: string}) => {
      return await postModel.find({likes: args.userId});
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

      const post = await postModel.findById(updatePost.id);

      if (!post) {
        throw new GraphQLError('Post not found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }

      // Check if the current user is the author of the post.
      if (post.author.toString() !== id.toString()) {
        throw new GraphQLError('You are not authorized to update this blog', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const updatedPost = await postModel.findByIdAndUpdate(
        updatePost.id,
        {
          ...updatePost,
          id,
        },
        {new: true}
      );
      return updatedPost;
    },

    // Delete a post with graphql.
    deletePost: async (
      _parent: unknown,
      {id}: {id: string},
      {id: userId, token}: UserIdWithToken
    ) => {
      if (!token) {
        throw new GraphQLError('You are not authorized to delete a blog', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const post = await postModel.findById(id);

      if (!post) {
        throw new GraphQLError('Post not found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }

      // Check if the current user is the author of the post.
      if (post.author.toString() !== userId.toString()) {
        throw new GraphQLError('You are not authorized to delete this blog', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      return await postModel.findByIdAndDelete(id);
    },

    // Update a post as admin with graphql.
    updatePostAsAdmin: async (
      _parent: unknown,
      args: {updatePostAsAdmin: Post},
      {token, isAdmin}: UserIdWithToken
    ) => {
      if (!token || !isAdmin) {
        throw new GraphQLError('You are not authorized to update a blog', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      return await postModel.findByIdAndUpdate(
        args.updatePostAsAdmin.id,
        args.updatePostAsAdmin,
        {
          new: true,
        }
      );
    },

    // Delete a post as admin with graphql.
    deletePostAsAdmin: async (
      _parent: unknown,
      args: {id: string},
      {token, isAdmin}: UserIdWithToken
    ) => {
      if (!token || !isAdmin) {
        throw new GraphQLError('You are not authorized to delete a blog', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      return await postModel.findByIdAndDelete(args.id);
    },

    // Like a post with graphql.
    likePost: async (
      _parent: unknown,
      args: {postId: string},
      {id}: UserIdWithToken
    ) => {
      const post = await postModel.findById(args.postId);

      if (!post) {
        throw new GraphQLError('Post not found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }

      const userId = id as unknown as User;

      if (post.likes.includes(userId)) {
        throw new GraphQLError('Post already liked', {
          extensions: {code: 'BAD_REQUEST'},
        });
      }

      post.likes.push(userId);
      await post.save();

      return post;
    },

    // Unlike a post with graphql.
    unlikePost: async (
      _parent: unknown,
      args: {postId: string},
      {id, token}: UserIdWithToken
    ) => {
      if (!token) {
        throw new GraphQLError('You are not authorized to unlike a post', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const userId = id as unknown as User;
      const post = await postModel.findById(args.postId);

      if (!post) {
        throw new GraphQLError('Post not found', {
          extensions: {code: 'NOT_FOUND'},
        });
      }

      if (!post.likes.includes(userId)) {
        throw new GraphQLError('Post not liked', {
          extensions: {code: 'BAD_REQUEST'},
        });
      }

      post.likes = post.likes.filter(
        (likeId) => likeId.toString() !== userId.toString()
      );

      await post.save();

      return post;
    },
  },
};
