import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import Validate from './app/middlewares/validations';
import IAPIResponse from './interfaces/response';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.config();

    this.routes();
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

  private routes(): void {
    this.app.post(
      '/login',
      App.handlerBuilder(Validate.login),
      /* controlador de login */
    );
  }

  private static handlerBuilder(handler: (
    req: Request, next?: NextFunction,
  ) => Promise<IAPIResponse>) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
      try {
        const response = await handler(req);

        if (response.body) {
          return res.status(response.statusCode).json({ message: response.body });
        }

        if (response.err) {
          return res.status(response.statusCode).json({ error: response.err });
        }

        if (!response.body && !response.err) return next();

        return res.end();
      } catch (err) {
        next(err);
      }
    };
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
