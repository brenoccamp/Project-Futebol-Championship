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
      const allMatches = await this._matchService.getMatchesByProgress(false);

      const allLeaderboards = this._leaderboardService
        .generateAllLeaderboards(allTeams, allMatches);

      return res.status(200).json(allLeaderboards.homeLeaderboard);
    } catch (err) {
      next(err);
    }
  };

  public leaderboardAway = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const allTeams = await this._teamService.getAllTeams();
      const allMatches = await this._matchService.getMatchesByProgress(false);

      const allLeaderboards = this._leaderboardService
        .generateAllLeaderboards(allTeams, allMatches);

      return res.status(200).json(allLeaderboards.awayLeaderboard);
    } catch (err) {
      next(err);
    }
  };

  public generalLeaderboard = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const allTeams = await this._teamService.getAllTeams();
      const allMatches = await this._matchService.getMatchesByProgress(false);

      const allLeaderboards = this._leaderboardService
        .generateAllLeaderboards(allTeams, allMatches);

      return res.status(200).json(allLeaderboards.generalLeaderboard);
    } catch (err) {
      next(err);
    }
  };
}
