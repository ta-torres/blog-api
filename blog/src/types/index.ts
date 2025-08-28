export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  isAuthor: boolean;
  createdAt?: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  published?: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}

export interface SignupData {
  email: string;
  username: string;
  displayName?: string;
  password: string;
}
