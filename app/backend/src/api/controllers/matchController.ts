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
      const matchServiceResponse = await this._matchService.getAllMatches();

      if (!matchServiceResponse.length) {
        return res.status(400).json({ message: 'Any match registered yet' });
      }

      return res.status(200).json(matchServiceResponse);
    } catch (err) {
      next(err);
    }
  };
}
