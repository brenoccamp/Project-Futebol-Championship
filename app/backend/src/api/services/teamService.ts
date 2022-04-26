import { ITeam, ITeamService } from '../../interfaces/team';
import TeamModel from '../../database/models/TeamModel';

export default class TeamService implements ITeamService {
  private _teamModel;

  constructor() {
    this._teamModel = TeamModel;
  }

  public async getAllTeams(): Promise<ITeam[] | []> {
    const teams = await this._teamModel.findAll();

    return teams;
  }
}
