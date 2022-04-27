import { Request, Response, NextFunction } from 'express';
import { IMatchController, IMatchService } from '../../interfaces/match';

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
}
