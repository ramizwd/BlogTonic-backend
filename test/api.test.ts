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
  deleteUserAsAdmin,
  getUserById,
  getUsers,
  login,
  updateUser,
  updateUserAsAdmin,
} from './userFunctions';
import {PostTest} from '../src/interfaces/Post';
import {
  createPost,
  deletePost,
  deletePostAsAdmin,
  getPostById,
  getPosts,
  getPostsByAuthorId,
  likePost,
  likePostAgain,
  postsLikedByUserId,
  unlikePost,
  unlikePostAgain,
  updatePost,
  updatePostAsAdmin,
  wrongUserDeletePost,
  wrongUserUpdatePost,
} from './postFunctions';

const DATABASE_URL = process.env.DATABASE_URL as string;

describe('GraphQL API tests', () => {
  beforeAll(async () => {
    await mongoose.connect(DATABASE_URL);
  });

  let loggedInUser: LoginMessageResponse;
  let loggedInUser2: LoginMessageResponse;
  let adminData: LoginMessageResponse;

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

  const adminUser: UserTest = {
    email: 'admin@admin.com',
    password: '123456',
  };

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it('should respond with not found message', async () => {
    await getNotFound(app);
  });

  describe('User tests', () => {
    // create first user
    it('should create a new user', async () => {
      await createUser(app, testUser);
    });

    // create second user to try to modify someone else's blog and user data
    it('should create second user', async () => {
      await createUser(app, testUser2);
    });

    // test login
    it('should login user', async () => {
      loggedInUser = await login(app, testUser);
    });

    // test login with second user
    it('should login second user', async () => {
      loggedInUser2 = await login(app, testUser2);
    });

    // test login as admin
    it('should login admin', async () => {
      adminData = await login(app, adminUser);
    });

    // test get all users
    it('should return an array of users', async () => {
      await getUsers(app);
    });

    // test get single user
    it('should return single user', async () => {
      await getUserById(app, loggedInUser.user.id!);
    });

    // test update user
    it('should update user', async () => {
      await updateUser(app, loggedInUser.token!);
    });

    // test update user as admin
    it('should update user as admin', async () => {
      await updateUserAsAdmin(app, loggedInUser2.user.id!, adminData.token!);
    });

    // test delete user based on token
    it('should delete current user', async () => {
      await deleteUser(app, loggedInUser.token!);
    });

    // test delete user by id as admin
    it('should delete a user as admin', async () => {
      await deleteUserAsAdmin(app, loggedInUser2.user.id!, adminData.token!);
    });

    // make sure token has role (so that we can test if user is admin or not)
    it('should have isAdmin property in token data', async () => {
      const dataFromToken = jwt.verify(
        loggedInUser.token!,
        process.env.JWT_SECRET as string
      );
      expect(dataFromToken).toHaveProperty('isAdmin');
    });
  });

  describe('Post tests', () => {
    let postID1: string;
    let postID2: string;

    const testPost: PostTest = {
      title: 'test title',
      content: 'test content',
    };

    // test create post
    it('should create a new post', async () => {
      await createUser(app, testUser);
      loggedInUser = await login(app, testUser);
      const post = await createPost(app, testPost, loggedInUser.token!);
      postID1 = post.id!;
    });

    // test create another post
    it('should create another post', async () => {
      const post = await createPost(app, testPost, loggedInUser.token!);
      postID2 = post.id!;
    });

    // test get all posts
    it('should return an array of posts', async () => {
      await getPosts(app);
    });

    // test get post by id
    it('should return single post', async () => {
      await getPostById(app, postID1);
    });

    // test get posts by author id
    it('should return posts by author id', async () => {
      await getPostsByAuthorId(app, loggedInUser.user.id!);
    });

    // test update a post
    it('should update a post', async () => {
      const newPost: PostTest = {
        title: 'titleUpdated' + randomstring.generate(7),
        content: 'contentUpdated' + randomstring.generate(7),
      };
      await updatePost(app, newPost, postID1, loggedInUser.token!);
    });

    // test should not update post if not author
    it('should not update post if not author', async () => {
      const newPost: PostTest = {
        title: 'title' + randomstring.generate(7),
      };
      await wrongUserUpdatePost(app, newPost, postID1, loggedInUser2.token!);
    });

    // test should update a post as admin ´
    it('should update a post as admin', async () => {
      const newPost: PostTest = {
        title: 'titleUpdatedAsAdmin' + randomstring.generate(7),
        content: 'contentUpdatedAsAdmin' + randomstring.generate(7),
      };
      await updatePostAsAdmin(app, newPost, postID1, adminData.token!);
    });

    // test should not delete post if not author
    it('should not delete post if not author', async () => {
      await wrongUserDeletePost(app, postID1, loggedInUser2.token!);
    });

    describe('Like posts tests', () => {
      // test like post
      it('should like post', async () => {
        await likePost(app, postID1, loggedInUser.token!);
      });

      // test like post again
      it('should not like post again', async () => {
        await likePostAgain(app, postID1, loggedInUser.token!);
      });

      // test get posts user liked posts
      it('should return user liked posts', async () => {
        await postsLikedByUserId(app, loggedInUser.user.id!);
      });

      // test unlike post
      it('should unlike post', async () => {
        await unlikePost(app, postID1, loggedInUser.token!);
      });

      // test should not unlike post again
      it('should not unlike post again', async () => {
        await unlikePostAgain(app, postID1, loggedInUser.token!);
      });
    });

    // test delete post
    it('should delete post', async () => {
      await deletePost(app, postID1, loggedInUser.token!);
    });

    // test delete post as admin
    it('should delete post as admin', async () => {
      await deletePostAsAdmin(app, postID2, adminData.token!);
    });
  });
});
