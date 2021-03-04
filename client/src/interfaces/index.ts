export interface IInputGroupProps {
  className?: string;
  error?: string | undefined;
  type: string;
  placeholder: string;
  value: string;
  setValue: (string: string) => void;
}

export interface IPost {
  identifier: string;
  title: string;
  body?: string;
  subName: string;
  slug: string;
  sub?: ISub;
  username: string;
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  url: string;
  voteScore?: number;
  commentCount?: number;
  userVote?: number;
}

export interface IUser {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IState {
  authenticated: boolean;
  user: IUser | undefined;
  loading: boolean;
}

export interface IAction {
  type: string;
  payload: any;
}

export interface ISub {
  title: string;
  name: string;
  slug: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: IPost[];
  postCount?: number;
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  imageUrl: string;
  bannerUrl: string;
}
