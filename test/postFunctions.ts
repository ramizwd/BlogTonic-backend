/* eslint-disable node/no-unpublished-import */
require('dotenv').config();
import request from 'supertest';
import expect from 'expect';
import {PostTest} from '../src/interfaces/Post';

/* test for graphql query
mutation CreatePost($title: String!, $content: String!) {
  createPost(title: $title, content: $content) {
    author {
      id
      email
      username
    }
    id
    title
    content
    createdAt
    updatedAt
  }
}
*/
const createPost = (
  url: string | Function,
  post: PostTest,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation CreatePost($title: String!, $content: String!) {
                        createPost(title: $title, content: $content) {
                            author {
                                id
                                email
                                username
                            }
                            id
                            title
                            content
                            createdAt
                            updatedAt
                        }
                    }`,
        variables: post,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const newPost = response.body.data.createPost;
          expect(newPost).toHaveProperty('id');
          expect(newPost).toHaveProperty('author');
          expect(newPost).toHaveProperty('title');
          expect(newPost).toHaveProperty('content');
          expect(newPost.author).toHaveProperty('id');
          expect(newPost.author).toHaveProperty('email');
          expect(newPost.author).toHaveProperty('username');
          expect(newPost.title).toBe(post.title);
          expect(newPost.content).toBe(post.content);
          expect(newPost).toHaveProperty('createdAt');
          expect(newPost).toHaveProperty('updatedAt');
          resolve(newPost);
        }
      });
  });
};

/* test for graphql query
query Posts {
  posts {
    id
    title
    content
    author {
      id
      email
      username
    }
    createdAt
    updatedAt
  }
}
*/
const getPosts = (url: string | Function): Promise<PostTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `query Posts {
                        posts {
                            id
                            title
                            content
                            author {
                                id
                                email
                                username
                            }
                            createdAt
                            updatedAt
                        }
                    }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const posts = response.body.data.posts;
          expect(posts).toBeInstanceOf(Array);
          posts.forEach((post: PostTest) => {
            expect(post).toHaveProperty('id');
            expect(post).toHaveProperty('author');
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('content');
            expect(post.author).toHaveProperty('id');
            expect(post.author).toHaveProperty('email');
            expect(post.author).toHaveProperty('username');
            expect(post).toHaveProperty('createdAt');
            expect(post).toHaveProperty('updatedAt');
          });
          resolve(posts);
        }
      });
  });
};

/* test for graphql query
query PostById($postByIdId: ID!) {
  postById(id: $postByIdId) {
    author {
      id
      email
      username
    }
    id
    title
    content
  }
}
*/
const getPostById = (url: string | Function, id: string): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `query PostById($postByIdId: ID!) {
                        postById(id: $postByIdId) {
                            author {
                                id
                                email
                                username
                            }
                            id
                            title
                            content
                            createdAt
                            updatedAt
                        }
                    }`,
        variables: {postByIdId: id},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const post = response.body.data.postById;
          expect(post).toHaveProperty('id');
          expect(post).toHaveProperty('author');
          expect(post).toHaveProperty('title');
          expect(post).toHaveProperty('content');
          expect(post).toHaveProperty('createdAt');
          expect(post).toHaveProperty('updatedAt');
          expect(post.author).toHaveProperty('id');
          expect(post.author).toHaveProperty('email');
          expect(post.author).toHaveProperty('username');
          resolve(post);
        }
      });
  });
};

/* test for graphql query
query PostsByAuthorId($authorId: ID!) {
  postsByAuthorId(authorId: $authorId) {
    author {
      id
      email
      username
    }
    id
    title
    content
    createdAt
    updatedAt
  }
}
*/
const getPostsByAuthorId = (
  url: string | Function,
  authorId: string
): Promise<PostTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `query PostsByAuthorId($authorId: ID!) {
                        postsByAuthorId(authorId: $authorId) {
                            author {
                                id
                                email
                                username
                            }
                            id
                            title
                            content
                            createdAt
                            updatedAt
                        }
                    }`,
        variables: {authorId},
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const posts = response.body.data.postsByAuthorId;
          expect(posts).toBeInstanceOf(Array);
          posts.forEach((post: PostTest) => {
            expect(post).toHaveProperty('id');
            expect(post).toHaveProperty('author');
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('content');
            expect(post).toHaveProperty('createdAt');
            expect(post).toHaveProperty('updatedAt');
            expect(post.author).toHaveProperty('id');
            expect(post.author).toHaveProperty('email');
            expect(post.author).toHaveProperty('username');
          });
          resolve(posts);
        }
      });
  });
};

/* test for graphql query
mutation UpdatePost($updatePost: UpdatePostInput!) {
  updatePost(updatePost: $updatePost) {
    author {
      id
      email
      username
    }
    id
    title
    content
    createdAt
    updatedAt
  }
}
*/
const updatePost = (
  url: string | Function,
  post: PostTest,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UpdatePost($updatePost: UpdatePostInput!) {
                        updatePost(updatePost: $updatePost) {
                            author {
                                id
                                email
                                username
                            }
                            id
                            title
                            content
                            createdAt
                            updatedAt
                        }
                    }`,
        variables: {
          updatePost: {
            id: id,
            title: post.title,
            content: post.content,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const post = response.body.data.updatePost;
          expect(post).toHaveProperty('id');
          expect(post).toHaveProperty('author');
          expect(post).toHaveProperty('title');
          expect(post).toHaveProperty('content');
          expect(post).toHaveProperty('updatedAt');
          expect(post.author).toHaveProperty('id');
          expect(post.author).toHaveProperty('email');
          expect(post.author).toHaveProperty('username');
          resolve(post);
        }
      });
  });
};

const wrongUserUpdatePost = (
  url: string | Function,
  post: PostTest,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')

      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UpdatePost($updatePost: UpdatePostInput!) {
                        updatePost(updatePost: $updatePost) {
                            author {
                                id
                                email
                                username
                            }
                            id
                            title
                            content
                            createdAt
                            updatedAt
                        }
                    }`,
        variables: {
          updatePost: {
            id: id,
            title: post.title,
            content: post.content,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const post = response.body.data.updatePost;
          expect(post).toBe(null);
          resolve(post);
        }
      });
  });
};

/* test for graphql query
mutation UpdatePostAsAdmin($updatePostAsAdmin: UpdatePostInput!) {
  updatePostAsAdmin(updatePostAsAdmin: $updatePostAsAdmin) {
    author {
      email
      id
      username
    }
    id
    title
    content
    likes
    createdAt
    updatedAt
  }
}
*/
const updatePostAsAdmin = (
  url: string | Function,
  post: PostTest,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UpdatePostAsAdmin($updatePostAsAdmin: UpdatePostInput!) {
                        updatePostAsAdmin(updatePostAsAdmin: $updatePostAsAdmin) {
                            author {
                                id
                                email
                                username
                            }
                            id
                            title
                            content
                            createdAt
                            updatedAt
                        }
                    }`,
        variables: {
          updatePostAsAdmin: {
            id: id,
            title: post.title,
            content: post.content,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const post = response.body.data.updatePostAsAdmin;
          expect(post).toHaveProperty('id');
          expect(post).toHaveProperty('author');
          expect(post).toHaveProperty('title');
          expect(post).toHaveProperty('content');
          expect(post).toHaveProperty('updatedAt');
          expect(post.author).toHaveProperty('id');
          expect(post.author).toHaveProperty('email');
          expect(post.author).toHaveProperty('username');
          expect(post.title).toBe(post.title);
          expect(post.content).toBe(post.content);
          resolve(post);
        }
      });
  });
};

/* test for graphql query
mutation DeletePost($deletePostId: ID!) {
  deletePost(id: $deletePostId) {
    author {
      id
      email
      username
    }
    id
    title
    content
    createdAt
    updatedAt
  }
}
*/
const deletePost = (
  url: string | Function,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeletePost($deletePostId: ID!) {
            deletePost(id: $deletePostId) {
              id
            }
          }`,
        variables: {
          deletePostId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const post = response.body.data.deletePost;
          expect(post.id).toBe(id);
          resolve(post);
        }
      });
  });
};

const wrongUserDeletePost = (
  url: string | Function,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeletePost($deletePostId: ID!) {
            deletePost(id: $deletePostId) {
              id
            }
          }`,
        variables: {
          deletePostId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const post = response.body.data.deletePost;
          expect(post).toBe(null);
          resolve(post);
        }
      });
  });
};

/* test for graphql query
mutation DeletePostAsAdmin($deletePostAsAdminId: ID!) {
  deletePostAsAdmin(id: $deletePostAsAdminId) {
    id
  }
}
*/
const deletePostAsAdmin = (
  url: string | Function,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeletePostAsAdmin($deletePostAsAdminId: ID!) {
                deletePostAsAdmin(id: $deletePostAsAdminId) {
                id
                }
            }`,
        variables: {
          deletePostAsAdminId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const post = response.body.data.deletePostAsAdmin;
          expect(post.id).toBe(id);
          resolve(post);
        }
      });
  });
};

/* test for graphql query
mutation LikePost($postId: ID!) {
  likePost(postId: $postId) {
    author {
      email
      id
      username
    }
    content
    createdAt
    id
    title
    updatedAt
    likes
  }
}
*/
const likePost = (
  url: string | Function,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation LikePost($postId: ID!) {
                        likePost(postId: $postId) {
                            author {
                                email
                                id
                                username
                            }
                            content
                            createdAt
                            id
                            title
                            updatedAt
                            likes
                        }
                    }`,
        variables: {
          postId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const post = response.body.data.likePost;
          expect(post).toHaveProperty('likes');
          expect(post.likes).toBeInstanceOf(Array);
          expect(post.likes).toBeInstanceOf(Array);
          expect(post.likes.length).toBeGreaterThan(0);
          expect(post).toHaveProperty('id');
          expect(post).toHaveProperty('author');
          expect(post).toHaveProperty('title');
          expect(post).toHaveProperty('content');
          expect(post).toHaveProperty('updatedAt');
          expect(post.author).toHaveProperty('id');
          expect(post.author).toHaveProperty('email');
          expect(post.author).toHaveProperty('username');
          resolve(post);
        }
      });
  });
};

const likePostAgain = (
  url: string | Function,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation LikePost($postId: ID!) {
                          likePost(postId: $postId) {
                              author {
                                  email
                                  id
                                  username
                              }
                              content
                              createdAt
                              id
                              title
                              updatedAt
                              likes
                          }
                      }`,
        variables: {
          postId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const post = response.body.data.likePost;
          console.log(post);
          expect(post).toBe(null);
          resolve(post);
        }
      });
  });
};

/* test for graphql query
query PostsLikedByUserId($userId: ID!) {
  postsLikedByUserId(userId: $userId) {
    author {
      email
      id
      username
    }
    id
    title
    content
    createdAt
    updatedAt
    likes
  }
}
*/
const postsLikedByUserId = (
  url: string | Function,
  id: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: `query PostsLikedByUserId($userId: ID!) {

                postsLikedByUserId(userId: $userId) {
                    author {
                        email
                        id
                        username
                    }
                    id
                    title
                    content
                    createdAt
                    updatedAt
                    likes
                }
            }`,
        variables: {
          userId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const posts = response.body.data.postsLikedByUserId;
          expect(posts).toBeInstanceOf(Array);
          expect(posts.length).toBeGreaterThan(0);
          expect(posts[0]).toHaveProperty('likes');
          expect(posts[0]).toHaveProperty('id');
          expect(posts[0]).toHaveProperty('author');
          expect(posts[0]).toHaveProperty('title');
          expect(posts[0]).toHaveProperty('content');
          expect(posts[0]).toHaveProperty('updatedAt');
          expect(posts[0].author).toHaveProperty('id');
          expect(posts[0].author).toHaveProperty('email');
          expect(posts[0].author).toHaveProperty('username');
          resolve(posts);
        }
      });
  });
};

/* test for graphql query
mutation UnlikePost($postId: ID!) {
  unlikePost(postId: $postId) {
    author {
      id
      email
      username
    }
    content
    createdAt
    id
    likes
    title
    updatedAt
  }
}
*/
const unlikePost = (
  url: string | Function,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UnlikePost($postId: ID!) {
                        unlikePost(postId: $postId) {
                            author {
                                id
                                email
                                username
                            }
                            content
                            createdAt
                            id
                            likes
                            title
                            updatedAt
                        }
                    }`,
        variables: {
          postId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const post = response.body.data.unlikePost;
          expect(post).toHaveProperty('likes');
          expect(post.likes).toBeInstanceOf(Array);
          expect(post.likes).toBeInstanceOf(Array);
          expect(post.likes.length).toBe(0);
          expect(post).toHaveProperty('id');
          expect(post).toHaveProperty('author');
          expect(post).toHaveProperty('title');
          expect(post).toHaveProperty('content');
          expect(post).toHaveProperty('updatedAt');
          expect(post.author).toHaveProperty('id');
          expect(post.author).toHaveProperty('email');
          expect(post.author).toHaveProperty('username');
          resolve(post);
        }
      });
  });
};

const unlikePostAgain = (
  url: string | Function,
  id: string,
  token: string
): Promise<PostTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation UnlikePost($postId: ID!) {
                          unlikePost(postId: $postId) {
                              author {
                                  id
                                  email
                                  username
                              }
                              content
                              createdAt
                              id
                              likes
                              title
                              updatedAt
                          }
                      }`,
        variables: {
          postId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const post = response.body.data.unlikePost;
          expect(post).toBe(null);
          resolve(post);
        }
      });
  });
};

export {
  createPost,
  getPosts,
  getPostById,
  getPostsByAuthorId,
  updatePost,
  wrongUserUpdatePost,
  updatePostAsAdmin,
  deletePost,
  wrongUserDeletePost,
  deletePostAsAdmin,
  likePost,
  likePostAgain,
  postsLikedByUserId,
  unlikePost,
  unlikePostAgain,
};
