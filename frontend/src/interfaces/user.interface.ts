export interface UserInterface {
  name: string;
  email: string;
  isAdmin: boolean;
  _id?: string;
  userId?: string; // for local updates
  isProtected?: boolean;
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

export interface UserAuthFormValidators {
  name?: boolean;
  email: boolean;
  password: boolean;
  passwordMatch?: boolean;
}

export interface UserEditValidators {
  name: boolean;
  email: boolean;
  isAdmin?: boolean;
}
