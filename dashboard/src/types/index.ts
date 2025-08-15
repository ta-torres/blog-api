export interface User {
  id: string;
  email: string;
  isAuthor: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    email: string;
  };
}
