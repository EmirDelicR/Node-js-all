const {
  hash,
  validateHash,
  createJWT,
  createPagination,
  deleteFile
} = require("../util/helpers");

const { validateUser, validatePost } = require("./validation/validator");

const User = require("../models/user");
const Post = require("../models/post");

module.exports = {
  createUser: async function({ userInput }, req) {
    const existingUser = await User.findOne({ email: userInput.email });
    validateUser(userInput);

    if (existingUser) {
      const error = new Error(
        `User with this E-Mail: ${userInput.email}  already exist!`
      );
      throw error;
    }
    const hashPassword = await hash(userInput.password);

    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashPassword
    });

    const createdUser = await user.save();

    return {
      ...createdUser._doc,
      _id: createdUser._id.toString()
    };
  },

  login: async function({ email, password }, req) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found!");
      error.code = 401;
      throw error;
    }

    const isEqual = await validateHash(password, user.password);

    if (!isEqual) {
      const error = new Error("Password is incorrect!");
      error.code = 401;
      throw error;
    }

    const token = createJWT({ userId: user._id.toString(), email: user.email });

    return {
      token: token,
      userId: user._id.toString()
    };
  },

  createPost: async function({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    validatePost(postInput);

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("Invalid user!");
      error.code = 401;
      throw error;
    }

    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user
    });

    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString()
    };
  },

  posts: async function({ page }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const totalPosts = await Post.find().countDocuments();
    const posts = await createPagination(Post, page);
    return {
      posts: posts.map(p => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        };
      }),
      totalPosts: totalPosts
    };
  },

  post: async function({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id).populate("creator");

    if (!post) {
      const error = new Error(`No post found with id ${id}!`);
      error.code = 404;
      throw error;
    }

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };
  },

  updatePost: async function({ id, postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    validatePost(postInput);
    const post = await Post.findById(id).populate("creator");

    if (!post) {
      const error = new Error(`No post found with id ${id}!`);
      error.code = 404;
      throw error;
    }

    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error(`Not authorized!`);
      error.code = 403;
      throw error;
    }

    post.title = postInput.title;
    post.content = postInput.content;

    if (postInput.imageUrl !== "undefined") {
      post.imageUrl = postInput.imageUrl;
    }

    const updatedPost = await post.save();
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString()
    };
  },

  deletePost: async function({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id);

    if (!post) {
      const error = new Error(`No post found with id ${id}!`);
      error.code = 404;
      throw error;
    }

    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error(`Not authorized!`);
      error.code = 403;
      throw error;
    }

    deleteFile(post.imageUrl);

    await Post.findByIdAndDelete(id);
    const user = await User.findById(req.userId);
    user.posts.pull(id);
    await user.save();

    return true;
  },

  user: async function(args, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error(`No user found with id ${req.userId}!`);
      error.code = 404;
      throw error;
    }

    return {
      ...user._doc,
      _id: user._id.toString()
    };
  },

  updateStatus: async function({ status }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error(`No user found with id ${req.userId}!`);
      error.code = 404;
      throw error;
    }
    user.status = status;
    const updatedUser = await user.save();

    return {
      ...updatedUser._doc,
      _id: updatedUser._id.toString()
    };
  }
};
