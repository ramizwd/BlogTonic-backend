import {User} from './User';
import {Document} from 'mongoose';

interface Post extends Document {
  title: string;
  content: string;
  author: User;
  likes: User[];
}

interface PostTest {
  id?: string;
  title?: string;
  content?: string;
  author?: User;
  likes?: User[];
}

export {Post, PostTest};
