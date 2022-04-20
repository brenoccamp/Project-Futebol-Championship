import IAPIResponse from './responses';
import { IUser } from './userInterface';

export interface IUserService {
  login(user: IUser): Promise<IAPIResponse>;
}
