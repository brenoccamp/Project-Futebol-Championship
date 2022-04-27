import { Request, Response, NextFunction } from 'express';
import { IMatchController, IMatchService, INewMatch } from '../../interfaces/match';

export default class MatchController implements IMatchController {
  constructor(
    private _matchService: IMatchService,
  ) { }

  public getAllMatches = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { inProgress } = req.query;

      let matchServiceResponse = await this._matchService.getAllMatches();

      if (inProgress && matchServiceResponse.length) {
        const conditionToFilter = inProgress === 'true';
        matchServiceResponse = matchServiceResponse
          .filter((match) => match.inProgress === conditionToFilter);
      }

      return res.status(200).json(matchServiceResponse);
    } catch (err) {
      next(err);
    }
  };

  public createMatchInProgress = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const newMatch: INewMatch = req.body;

      console.log('awayTeamId: ', newMatch.awayTeam, 'homeTeamId: ', newMatch.homeTeam);
      if (newMatch.awayTeam === newMatch.homeTeam) {
        return res.status(401)
          .json({ message: 'It is not possible to create a match with two equal teams' });
      }

      const createdMatch = await this._matchService.createMatchInProgress(newMatch);

      if (!createdMatch) return res.status(404).json({ message: 'There is no team with such id!' });

      return res.status(201).json(createdMatch);
    } catch (err) {
      next(err);
    }
  };
}
