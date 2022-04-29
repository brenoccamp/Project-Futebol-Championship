import { IMatches } from '../../interfaces/match';
import {
  ILeaderboardService,
  ILeaderboardObj,
  // ITeamMatchesData,
} from '../../interfaces/leaderboard';
import { ITeam } from '../../interfaces/team';

export default class LeaderboardService implements ILeaderboardService {
  private createLeaderboardObj = (teams: ITeam[]): ILeaderboardObj => {
    const leaderboardObj = teams
      .reduce((acc: ILeaderboardObj, { teamName }) => {
        // acc[teamName] = {
        //   name: teamName,
        //   totalPoints: 0,
        //   totalGames: 0,
        //   totalVictories: 0,
        //   totalDraws: 0,
        //   totalLosses: 0,
        //   goalsFavor: 0,
        //   goalsOwn: 0,
        //   goalsBalance: 0,
        //   efficiency: 0,
        // };

        acc[teamName] = {
          name: teamName,
          homeMatches: { victories: 0, losses: 0, draws: 0, goalsFavor: 0, goalsOwn: 0 },
          awayMatches: { victories: 0, losses: 0, draws: 0, goalsFavor: 0, goalsOwn: 0 },
        };

        return acc;
      }, {});

    return leaderboardObj;
  };

  private calcWinsDrawsAndLosses = (board: ILeaderboardObj, games: IMatches[]): ILeaderboardObj => {
    const leaderboardUpdated = board;

    games.forEach((match) => {
      leaderboardUpdated[match.teamHome.teamName].homeMatches.goalsFavor += match.homeTeamGoals;
      leaderboardUpdated[match.teamHome.teamName].homeMatches.goalsOwn += match.awayTeamGoals;

      leaderboardUpdated[match.teamAway.teamName].awayMatches.goalsFavor += match.awayTeamGoals;
      leaderboardUpdated[match.teamAway.teamName].awayMatches.goalsOwn += match.homeTeamGoals;

      if (match.homeTeamGoals > match.awayTeamGoals) {
        leaderboardUpdated[match.teamHome.teamName].homeMatches.victories += 1;
        leaderboardUpdated[match.teamAway.teamName].awayMatches.losses += 1; return;
      }

      if (match.awayTeamGoals > match.homeTeamGoals) {
        leaderboardUpdated[match.teamAway.teamName].awayMatches.victories += 1;
        leaderboardUpdated[match.teamHome.teamName].homeMatches.losses += 1; return;
      }

      leaderboardUpdated[match.teamHome.teamName].homeMatches.draws += 1;
      leaderboardUpdated[match.teamAway.teamName].awayMatches.draws += 1;
    });

    return leaderboardUpdated;
  };

  // private calcGamesAndDraws = (
  //   leaderboard: ILeaderboardObj,
  //   matches: IMatches[],
  // ): ILeaderboardObj => {
  //   const leaderboardUpdated = leaderboard;

  //   matches.forEach((match) => {
  //     const { teamHome: { teamName: homeTeamName } } = match;
  //     const { teamAway: { teamName: awayTeamName } } = match;

  //     if (match.homeTeamGoals === match.awayTeamGoals) {
  //       leaderboardUpdated[homeTeamName].totalDraws += 1;
  //       leaderboardUpdated[awayTeamName].totalDraws += 1;
  //     }

  //     leaderboardUpdated[homeTeamName].totalGames += 1;
  //     leaderboardUpdated[awayTeamName].totalGames += 1;
  //   });

  //   return leaderboardUpdated;
  // };

  // private calcGoalsFavorAndGoalsOwn = (
  //   leaderboard: ILeaderboardObj,
  //   matches: IMatches[],
  // ): ILeaderboardObj => {
  //   const leaderboardUpdated = leaderboard;

  //   matches.forEach((match) => {
  //     const { teamHome: { teamName: homeTeamName } } = match;
  //     const { teamAway: { teamName: awayTeamName } } = match;

  //     const { homeTeamGoals } = match;
  //     const { awayTeamGoals } = match;

  //     leaderboardUpdated[homeTeamName].goalsFavor += homeTeamGoals;
  //     leaderboardUpdated[homeTeamName].goalsOwn += awayTeamGoals;

  //     leaderboardUpdated[awayTeamName].goalsFavor += awayTeamGoals;
  //     leaderboardUpdated[awayTeamName].goalsOwn += homeTeamGoals;
  //   });

  //   return leaderboardUpdated;
  // };

  // private calcGoalsBalanceAndEfficiency = (
  //   leaderboard: ILeaderboardObj,
  // ): ILeaderboardObj => {
  //   const leaderboardUpdated = leaderboard;

  //   Object.values(leaderboard)
  //     .forEach(({ goalsFavor, goalsOwn, totalPoints, totalGames, name }) => {
  //       const balanceGoals = goalsFavor - goalsOwn;
  //       const teamEfficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);

  //       leaderboardUpdated[name].goalsBalance = balanceGoals;
  //       leaderboardUpdated[name].efficiency = Number(teamEfficiency);
  //     });

  //   return leaderboardUpdated;
  // };

  public async leaderboardHome(teams: ITeam[], matches: IMatches[]): Promise<ILeaderboardObj> {
    let leaderboardObj;

    leaderboardObj = this.createLeaderboardObj(teams);

    leaderboardObj = this.calcWinsDrawsAndLosses(leaderboardObj, matches);

    // leaderboardObj = this.calcGamesAndDraws(leaderboardObj, matches);

    // leaderboardObj = this.calcGoalsFavorAndGoalsOwn(leaderboardObj, matches);

    // leaderboardObj = this.calcGoalsBalanceAndEfficiency(leaderboardObj);

    return leaderboardObj;
  }
}
