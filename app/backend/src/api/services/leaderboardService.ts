import { IMatches } from '../../interfaces/match';
import {
  ILeaderboardService,
  ITeamPerformance,
  IHomeAndAwayLeaderboard,
  ITeamMatchesData,
  IParamObj,
  ITeamScoresData,
} from '../../interfaces/leaderboard';
import { ITeam } from '../../interfaces/team';

export default class LeaderboardService implements ILeaderboardService {
  private generateTeamPerformanceObj = (teams: ITeam[]): ITeamPerformance => {
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

  private calcScores = (paramObj: IParamObj): ITeamPerformance => {
    const { teamPerformance, matchType, scoreType } = paramObj;

    Object.values(teamPerformance).forEach((teamData) => {
      const totalPoints = ((teamData[matchType].victories * 3) + teamData[matchType].draws);
      const totalGames = teamData[matchType].victories + teamData[matchType].losses
        + teamData[matchType].draws;

      teamPerformance[teamData.name][scoreType] = {
        name: teamData.name,
        totalPoints,
        totalGames,
        totalVictories: teamData[matchType].victories,
        totalDraws: teamData[matchType].draws,
        totalLosses: teamData[matchType].losses,
        goalsFavor: teamData[matchType].goalsFavor,
        goalsOwn: teamData[matchType].goalsOwn,
        goalsBalance: (teamData[matchType].goalsFavor - teamData[matchType].goalsOwn),
        efficiency: Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2)) };
    });

    return teamPerformance;
  };

  private leaderboardsGenerate = (teamPerformance: ITeamPerformance): IHomeAndAwayLeaderboard => {
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

  private leaderboardsSort = (leaderboardArray: ITeamScoresData[]): ITeamScoresData[] => {
    leaderboardArray
      .sort((a:ITeamScoresData, b:ITeamScoresData) => (a.goalsOwn > b.goalsOwn ? -1 : 1))
      .sort((a:ITeamScoresData, b: ITeamScoresData) => (a.goalsFavor > b.goalsFavor ? -1 : 1))
      .sort((a:ITeamScoresData, b:ITeamScoresData) => (a.goalsBalance > b.goalsBalance ? -1 : 1))
      .sort(
        (a:ITeamScoresData, b:ITeamScoresData) => (a.totalVictories > b.totalVictories ? -1 : 1),
      )
      .sort((a:ITeamScoresData, b:ITeamScoresData) => (a.totalPoints > b.totalPoints ? -1 : 1));

    return leaderboardArray;
  };

  public createHomeAndawayLeaderboards(teams:ITeam[], matches:IMatches[]): IHomeAndAwayLeaderboard {
    let teamPerformance;

    teamPerformance = this.generateTeamPerformanceObj(teams);

    teamPerformance = this.calcHomeAndAwayResults(teamPerformance, matches);

    const calcHomeScores: IParamObj = {
      teamPerformance, matchType: 'homeMatches', scoreType: 'homeScores',
    };

    const calcAwayScores: IParamObj = {
      teamPerformance, matchType: 'awayMatches', scoreType: 'awayScores',
    };

    teamPerformance = this.calcScores(calcHomeScores);
    teamPerformance = this.calcScores(calcAwayScores);

    teamPerformance = this.leaderboardsGenerate(teamPerformance);

    teamPerformance.leaderboardHome = this.leaderboardsSort(teamPerformance.leaderboardHome);
    teamPerformance.leaderboardAway = this.leaderboardsSort(teamPerformance.leaderboardAway);

    return teamPerformance;
  }
}
