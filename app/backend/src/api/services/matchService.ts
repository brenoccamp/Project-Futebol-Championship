import { IMatch, IMatches, IMatchService, INewMatch } from '../../interfaces/match';
import Match from '../../database/models/MatchModel';
import Team from '../../database/models/TeamModel';

export default class MatchService implements IMatchService {
  private _matchModel;

  private _teamModel;

  constructor() {
    this._matchModel = Match;
    this._teamModel = Team;
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

  public async createMatchInProgress(newMatch: INewMatch): Promise<IMatch | undefined> {
    const homeTeam = await this._teamModel.findOne({ where: { id: newMatch.homeTeam } });
    const awayTeam = await this._teamModel.findOne({ where: { id: newMatch.awayTeam } });

    if (!homeTeam) return undefined;
    if (!awayTeam) return undefined;

    const createdMatch = await this._matchModel.create({
      homeTeam: newMatch.homeTeam,
      homeTeamGoals: newMatch.homeTeamGoals,
      awayTeam: newMatch.awayTeam,
      awayTeamGoals: newMatch.awayTeamGoals,
      inProgress: true,
    });

    return createdMatch;
  }

  public async finishMatch(id: string): Promise<boolean> {
    const foundMatch = await this._matchModel.findOne({ where: { id } });

    if (!foundMatch) return false;

    await this._matchModel.update({ inProgress: false }, { where: { id } });

    return true;
  }
}
