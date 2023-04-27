import {User} from './User';
import {Document} from 'mongoose';

interface Post extends Document {
  title: string;
  content: string;
  author: User;
}

export {Post};
