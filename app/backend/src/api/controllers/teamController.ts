import { Request, Response, NextFunction } from 'express';
import { ITeamController, ITeamService } from '../../interfaces/team';

export default class TeamController implements ITeamController {
  constructor(
    private teamService: ITeamService,
  ) {}

  public getAllTeams = async (
    req: Request,
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
}
