export interface User {
  id: string;
  email: string;
  isAuthor: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  postImage?: string;
  images: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    email: string;
  };
}

export interface CreatePostData {
  title: string;
  content: string;
  postImage?: string;
  images?: object[];
  published?: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  postImage?: string;
  images?: object[];
  published?: boolean;
}
