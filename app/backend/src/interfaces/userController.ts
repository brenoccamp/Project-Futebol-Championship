import { Request } from 'express';
import IAPIResponse from './responses';

export interface IUserController {
  login(req: Request): Promise<IAPIResponse>;
}
