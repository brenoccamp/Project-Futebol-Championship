import { NextFunction, Request, Response } from 'express';
import { IUser } from '../../interfaces/userInterface';

export default abstract class Validate {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const user: IUser = req.body;
      const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (!user.email || !user.password) {
        return res.status(400).json({ message: 'Email and password must be filled.' });
      }

      if (!emailRegex.test(user.email)) {
        return res.status(401).json({ message: 'Email must be a valid email.' });
      }

      if (typeof user.email !== 'string' || typeof user.password !== 'string') {
        return res.status(401).json({ message: 'Email and password must be a string.' });
      }

      if (user.password.length < 7) {
        return res.status(400).json({ message: 'Password must have at least 7 characters.' });
      }
    } catch (err) {
      next(err);
    }
  }
}
