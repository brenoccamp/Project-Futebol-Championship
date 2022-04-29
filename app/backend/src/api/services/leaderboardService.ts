import { IMatches } from '../../interfaces/match';
import {
  ILeaderboardService,
  ITeamPerformance,
  IHomeAndAwayLeaderboard,
  ITeamMatchesData,
} from '../../interfaces/leaderboard';
import { ITeam } from '../../interfaces/team';

export default class LeaderboardService implements ILeaderboardService {
  private createLeaderboardObj = (teams: ITeam[]): ITeamPerformance => {
    const teamPerformance = teams
      .reduce((acc: ITeamPerformance, { teamName }) => {
        acc[teamName] = {
          name: teamName,
          homeMatches: { victories: 0, losses: 0, draws: 0, goalsFavor: 0, goalsOwn: 0 },
          awayMatches: { victories: 0, losses: 0, draws: 0, goalsFavor: 0, goalsOwn: 0 },
        };

        return acc;
      }, {});

    return teamPerformance;
  };

  private calcHomeAndAwayResults = (board:ITeamPerformance, games:IMatches[]):ITeamPerformance => {
    const teamPerformance = board;

    games.forEach((match) => {
      teamPerformance[match.teamHome.teamName].homeMatches.goalsFavor += match.homeTeamGoals;
      teamPerformance[match.teamHome.teamName].homeMatches.goalsOwn += match.awayTeamGoals;

      teamPerformance[match.teamAway.teamName].awayMatches.goalsFavor += match.awayTeamGoals;
      teamPerformance[match.teamAway.teamName].awayMatches.goalsOwn += match.homeTeamGoals;

      if (match.homeTeamGoals > match.awayTeamGoals) {
        teamPerformance[match.teamHome.teamName].homeMatches.victories += 1;
        teamPerformance[match.teamAway.teamName].awayMatches.losses += 1; return;
      }

      if (match.awayTeamGoals > match.homeTeamGoals) {
        teamPerformance[match.teamAway.teamName].awayMatches.victories += 1;
        teamPerformance[match.teamHome.teamName].homeMatches.losses += 1; return;
      }

      teamPerformance[match.teamHome.teamName].homeMatches.draws += 1;
      teamPerformance[match.teamAway.teamName].awayMatches.draws += 1;
    });

    return teamPerformance;
  };

  private calcHomeTeamScores = (teamsDataObj: ITeamPerformance): ITeamPerformance => {
    const teamPerformance = teamsDataObj;

    Object.values(teamsDataObj).forEach(({ name, homeMatches }) => {
      const totalPoints = ((homeMatches.victories * 3) + homeMatches.draws);
      const totalGames = homeMatches.victories + homeMatches.losses + homeMatches.draws;

      teamPerformance[name].homeScores = {
        name,
        totalPoints,
        totalGames,
        totalVictories: homeMatches.victories,
        totalDraws: homeMatches.draws,
        totalLosses: homeMatches.losses,
        goalsFavor: homeMatches.goalsFavor,
        goalsOwn: homeMatches.goalsOwn,
        goalsBalance: (homeMatches.goalsFavor - homeMatches.goalsOwn),
        efficiency: Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2)) };
    });

    return teamPerformance;
  };

  private calcAwayTeamScores = (teamsDataObj: ITeamPerformance): ITeamPerformance => {
    const teamPerformance = teamsDataObj;

    Object.values(teamsDataObj).forEach(({ name, awayMatches }) => {
      const totalPoints = ((awayMatches.victories * 3) + awayMatches.draws);
      const totalGames = awayMatches.victories + awayMatches.losses + awayMatches.draws;

      teamPerformance[name].awayScores = {
        name,
        totalPoints,
        totalGames,
        totalVictories: awayMatches.victories,
        totalDraws: awayMatches.draws,
        totalLosses: awayMatches.losses,
        goalsFavor: awayMatches.goalsFavor,
        goalsOwn: awayMatches.goalsOwn,
        goalsBalance: (awayMatches.goalsFavor - awayMatches.goalsOwn),
        efficiency: Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2)) };
    });

    return teamPerformance;
  };

  // private testeFunction = (teamsDataObj: ITeamPerformance): ITeamPerformance => {
  //   const teamPerformance = teamsDataObj;

  //   Object.values(teamsDataObj).forEach(({ name, awayMatches }) => {
  //     const totalPoints = ((awayMatches.victories * 3) + awayMatches.draws);
  //     const totalGames = awayMatches.victories + awayMatches.losses + awayMatches.draws;

  //     teamPerformance[name].awayScores = {
  //       name,
  //       totalPoints,
  //       totalGames,
  //       totalVictories: awayMatches.victories,
  //       totalDraws: awayMatches.draws,
  //       totalLosses: awayMatches.losses,
  //       goalsFavor: awayMatches.goalsFavor,
  //       goalsOwn: awayMatches.goalsOwn,
  //       goalsBalance: (awayMatches.goalsFavor - awayMatches.goalsOwn),
  //       efficiency: Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2)) };
  //   });

  //   return teamPerformance;
  // };

  private generateLeaderboards = (teamPerformance: ITeamPerformance): IHomeAndAwayLeaderboard => {
    const homeAndAwayLeaderboards = Object.values(teamPerformance)
      .reduce((acc: IHomeAndAwayLeaderboard, curr: ITeamMatchesData) => {
        if (curr.homeScores && curr.awayScores) {
          acc.leaderboardHome.push(curr.homeScores);
          acc.leaderboardAway.push(curr.awayScores);
        }

        return acc;
      }, { leaderboardHome: [], leaderboardAway: [] } as IHomeAndAwayLeaderboard);

    return homeAndAwayLeaderboards;
  };

  public async leaderboardHome(teams: ITeam[], matches: IMatches[]): Promise<any> {
    let teamPerformance;

    teamPerformance = this.createLeaderboardObj(teams);

    teamPerformance = this.calcHomeAndAwayResults(teamPerformance, matches);

    teamPerformance = this.calcHomeTeamScores(teamPerformance);

    teamPerformance = this.calcAwayTeamScores(teamPerformance);

    teamPerformance = this.generateLeaderboards(teamPerformance);

    return teamPerformance;
  }
}
