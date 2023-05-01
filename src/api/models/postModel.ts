import mongoose from 'mongoose';
import {Post} from '../../interfaces/Post';

// Define the post schema.
const postModel = new mongoose.Schema<Post>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Post>('Post', postModel);
