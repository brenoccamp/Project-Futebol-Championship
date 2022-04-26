import { Request, Response, NextFunction } from 'express';
import { ITeamController, ITeamService } from '../../interfaces/team';

export default class TeamController implements ITeamController {
  constructor(
    private teamService: ITeamService,
  ) {}

  public getAllTeams = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const teamServiceResponse = await this.teamService.getAllTeams();

      if (!teamServiceResponse.length) {
        return res.status(404).json({ message: 'Any team registered yet' });
      }

      return res.status(200).json(teamServiceResponse);
    } catch (err) {
      next(err);
    }
  };

  public getTeamById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const id = Number(req.params.id);

      const teamServiceResponse = await this.teamService.getTeamById(id);

      if (!teamServiceResponse) return res.status(404).json({ message: 'Team not found' });

      return res.status(200).json(teamServiceResponse);
    } catch (err) {
      next(err);
    }
  };
}
