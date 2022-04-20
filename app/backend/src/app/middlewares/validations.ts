import { Request } from 'express';
import IAPIResponse from '../../interfaces/response';
import { IUser } from '../../interfaces/userInterface';

export default abstract class Validate {
  static async login(req: Request): Promise<IAPIResponse> {
    const user: IUser = req.body;
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!user.email || !user.password) {
      return { statusCode: 400, err: 'Email and password must be filled.' };
    }

    if (!emailRegex.test(user.email)) {
      return { statusCode: 401, err: 'Email must be a valid email.' };
    }

    if (typeof user.email !== 'string' || typeof user.password !== 'string') {
      return { statusCode: 401, err: 'Email and password must be a string.' };
    }

    if (user.password.length < 7) {
      return { statusCode: 400, err: 'Password must have at least 7 characters.' };
    }

    return { statusCode: 200 };
  }
}
