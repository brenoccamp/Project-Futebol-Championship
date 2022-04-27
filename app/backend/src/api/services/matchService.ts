import { IMatches, IMatchService } from '../../interfaces/match';
import Match from '../../database/models/MatchModel';
import Team from '../../database/models/TeamModel';

export default class MatchService implements IMatchService {
  private _matchModel;

  constructor() {
    this._matchModel = Match;
  }

  public async getAllMatches(): Promise<IMatches[]> {
    const matches = await this._matchModel.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });

    return matches as IMatches[];
  }
}
