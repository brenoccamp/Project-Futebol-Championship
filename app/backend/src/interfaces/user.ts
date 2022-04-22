import { Request, Response } from 'express';

export interface IUser {
  email: string;
  password: string;
}

export interface IUserFullData {
  id: number;
  username: string;
  role: string;
  email: string;
}

export interface ILoginUserData {
  user: IUserFullData;
  token: string;
}

export interface IUserController {
  login(req: Request): Promise<Response | void>;
}

export interface IUserService {
  login(user: IUser): Promise<ILoginUserData | boolean>;
}
