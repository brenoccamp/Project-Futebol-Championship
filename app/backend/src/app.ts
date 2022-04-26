import * as express from 'express';
import Validate from './api/middlewares/validations';
import UserController from './api/controllers/userController';
import UserService from './api/services/userService';
import { IUserController, IUserService } from './interfaces/user';
import { ITeamController, ITeamService } from './interfaces/team';
import TeamController from './api/controllers/teamController';
import TeamService from './api/services/teamService';
import { IMatchController } from './interfaces/match';
import error from './api/middlewares/error';

class App {
  public app: express.Express;

  private _userController: IUserController;

  private _userService: IUserService;

  private _teamController: ITeamController;

  private _teamService: ITeamService;

  private _matchService: IMatchController;

  constructor() {
    this._userService = new UserService();
    this._userController = new UserController(this._userService);
    this._teamService = new TeamService();
    this._teamController = new TeamController(this._teamService);

    this.app = express();
    this.app.use(express.json());

    this.config();
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);

    this.userRoutes();
    this.teamsRoutes();

    this.app.use(error);
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

  private teamsRoutes(): void {
    this.app.get(
      '/teams',
      this._teamController.getAllTeams,
    );

    this.app.get(
      '/teams/:id',
      this._teamController.getTeamById,
    );
  }

  private matchesRoutes(): void {
    this.app.get(
      '/matches',
      /* controller de matches */
    );
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
