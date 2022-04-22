import { NextFunction, Response, Request } from 'express';
import { IUser, IUserService } from '../../interfaces/user';

export default class UserController {
  constructor(
    private userService: IUserService,
  ) { }

  public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user: IUser = req.body;

      const serviceResponse = await this.userService.login(user);

      if (!serviceResponse) return res.status(401).json({ message: 'Incorrect email or password' });

      return res.status(200).json({ message: serviceResponse });
    } catch (err) {
      next(err);
    }
  }
}
