import { IMatches } from '../../interfaces/match';
import { ILeaderboardService, ILeaderboardObj } from '../../interfaces/leaderboard';
// import MatchModel from '../../database/models/MatchModel';
// import TeamModel from '../../database/models/TeamModel';
import { ITeam } from '../../interfaces/team';

export default class LeaderboardService implements ILeaderboardService {
  constructor() {
    this.createLeaderboardObj = this.createLeaderboardObj.bind(this);
  }

  private createLeaderboardObj = (teams: ITeam[]): ILeaderboardObj => {
    const leaderboardObj = teams
      .reduce((acc: ILeaderboardObj, { teamName }) => {
        acc[teamName] = {
          name: teamName,
          totalPoints: 0,
          totalGames: 0,
          totalVictories: 0,
          totalDraws: 0,
          totalLosses: 0,
          goalsFavor: 0,
          goalsOwn: 0,
          goalsBalance: 0,
          efficiency: 0,
        };

        return acc;
      }, {});
    // console.log(leaderboardObj);
    return leaderboardObj;
  };

  private calcTeamsTotalPoints = (
    leaderboard: ILeaderboardObj,
    matches: IMatches[],
  ): ILeaderboardObj => {
    const leaderboardUpdated = leaderboard;

    matches.forEach((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        leaderboardUpdated[match.teamHome.teamName].totalPoints += 3;
        return;
      }
      if (match.awayTeamGoals > match.homeTeamGoals) {
        leaderboardUpdated[match.teamAway.teamName].totalPoints += 3;
        return;
      }
      leaderboardUpdated[match.teamHome.teamName].totalPoints += 1;
      leaderboardUpdated[match.teamAway.teamName].totalPoints += 1;
    });

    return leaderboardUpdated;
  };

  public async leaderboardHome(teams: ITeam[], matches: IMatches[]): Promise<ILeaderboardObj> {
    let leaderboardObj;

    leaderboardObj = this.createLeaderboardObj(teams);

    leaderboardObj = this.calcTeamsTotalPoints(leaderboardObj, matches);

    return leaderboardObj;
  }
}
