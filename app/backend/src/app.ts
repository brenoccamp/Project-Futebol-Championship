import * as express from 'express';
// import { Request, Response, NextFunction } from 'express';
import Validate from './api/middlewares/validations';
// import UserController from './api/controllers/userController';
class App {
  public app: express.Express;

  constructor() {
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
      // async (req: Request, res: Response, next: NextFunction): void => {}
    );
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
