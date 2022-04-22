import * as express from 'express';
import Validate from './api/middlewares/validations';
import UserController from './api/controllers/userController';
import UserService from './api/services/userService';
import { IUserController, IUserService } from './interfaces/user';

class App {
  public app: express.Express;

  private _userController: IUserController;

  private _userService: IUserService;

  constructor() {
    this._userService = new UserService();
    this._userController = new UserController(this._userService);
    this.app = express();
    this.app.use(express.json());
    this.config();

    this.userRoutes();
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }

  private userRoutes(): void {
    this.app.post(
      '/login',
      Validate.login,
      this._userController.login,
    );

    this.app.get(
      '/login/validate',
      this._userController.loginValidate,
    );
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
