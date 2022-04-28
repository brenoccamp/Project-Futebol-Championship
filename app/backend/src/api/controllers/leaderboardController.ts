import { NextFunction, Request, Response } from 'express';
import { IMatchService } from '../../interfaces/match';
import { ILeaderboardController, ILeaderboardService } from '../../interfaces/leaderboard';
import { ITeamService } from '../../interfaces/team';

export default class LeaderboardController implements ILeaderboardController {
  constructor(
    private _leaderboardService: ILeaderboardService,
    private _matchService: IMatchService,
    private _teamService: ITeamService,
  ) {}

  public leaderboardHome = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const allTeams = await this._teamService.getAllTeams();
      const allMatches = await this._matchService.getAllMatches();

      const leaderboardObj = await this._leaderboardService.leaderboardHome(allTeams, allMatches);

      const leaderboardArray = Object.values(leaderboardObj);

      return res.status(200).json(leaderboardArray);
    } catch (err) {
      next(err);
    }
  };
}
