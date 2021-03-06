import { Response, Request, NextFunction } from 'express';
import { IUser, IUserController, IUserService } from '../../interfaces/user';

export default class UserController implements IUserController {
  constructor(
    private userService: IUserService,
  ) { }

  login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const user: IUser = req.body;

      const serviceResponse = await this.userService.login(user);

      if (!serviceResponse) return res.status(401).json({ message: 'Incorrect email or password' });

      return res.status(200).json(serviceResponse);
    } catch (err) {
      next(err);
    }
  };

  loginValidate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { authorization } = req.headers;

      if (!authorization) return res.status(401).json({ message: 'Token not found' });

      const validateLoginServiceResponse = await this.userService.loginValidate(authorization);

      if (validateLoginServiceResponse === 'Invalid token or user not found.') {
        return res
          .status(404)
          .json({ message: 'Invalid token or user not found.' });
      }

      return res.status(200).json(validateLoginServiceResponse);
    } catch (err) {
      next(err);
    }
  };
}
