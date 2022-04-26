import { NextFunction, Request, Response } from 'express';
import { IUser } from '../../interfaces/user';

export default abstract class Validate {
  static async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const user: IUser = req.body;
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!user.email || !user.password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    if (typeof user.email !== 'string' || typeof user.password !== 'string') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!emailRegex.test(user.email)) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    if (user.password.length < 6) {
      return res.status(400).json({ message: 'Password must have at least 6 characters' });
    }

    next();
  }
}
