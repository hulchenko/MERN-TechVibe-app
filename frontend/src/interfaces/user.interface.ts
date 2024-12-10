export interface UserInterface {
  name: string;
  email: string;
  isAdmin: boolean;
  _id?: string;
  userId?: string;
}

export interface UserAuth {
  name?: string;
  email: string;
  password: string;
}

export interface UserPaginationRes {
  users: UserInterface[];
  page: number;
  pages: number;
}

export interface UserValidators {
  name?: boolean;
  email: boolean;
  password: boolean;
  passwordMatch?: boolean;
}
