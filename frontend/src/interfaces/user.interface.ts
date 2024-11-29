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
