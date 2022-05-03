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

  private calcHomeAndAwayResults = (board:ITeamPerformance, games:IMatches[]): ITeamPerformance => {
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

  private calcHomeAndAwayScores = (paramObj: IParamObj): ITeamPerformance => {
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

  private calcGeneralScores = (teamPerformance: ITeamPerformance): ITeamPerformance => {
    const updatedPerformance = teamPerformance;

    Object.values(updatedPerformance).forEach(({ name, homeScores, awayScores }) => {
      updatedPerformance[name].generalScores = {
        name,
        totalPoints: Number(homeScores?.totalPoints) + Number(awayScores?.totalPoints),
        totalGames: Number(homeScores?.totalGames) + Number(awayScores?.totalGames),
        totalVictories: Number(homeScores?.totalVictories) + Number(awayScores?.totalVictories),
        totalDraws: Number(homeScores?.totalDraws) + Number(awayScores?.totalDraws),
        totalLosses: Number(homeScores?.totalLosses) + Number(awayScores?.totalLosses),
        goalsFavor: Number(homeScores?.goalsFavor) + Number(awayScores?.goalsFavor),
        goalsOwn: Number(homeScores?.goalsOwn) + Number(awayScores?.goalsOwn),
        goalsBalance: Number(homeScores?.goalsBalance) + Number(awayScores?.goalsBalance),
        efficiency: Number((((Number(homeScores?.totalPoints) + Number(awayScores?.totalPoints))
          / ((Number(homeScores?.totalGames) + Number(awayScores?.totalGames)) * 3)) * 100)
          .toFixed(2)) };
    });

    return updatedPerformance;
  };

  private leaderboardsGenerate = (teamPerformance: ITeamPerformance): IHomeAndAwayLeaderboard => {
    const homeAndAwayLeaderboards = Object.values(teamPerformance)
      .reduce((acc: IHomeAndAwayLeaderboard, curr: ITeamMatchesData) => {
        if (curr.homeScores && curr.awayScores && curr.generalScores) {
          acc.homeLeaderboard.push(curr.homeScores);
          acc.awayLeaderboard.push(curr.awayScores);
          acc.generalLeaderboard.push(curr.generalScores);
        }

        return acc;
      }, {
        homeLeaderboard: [],
        awayLeaderboard: [],
        generalLeaderboard: [],
      } as IHomeAndAwayLeaderboard);

    return homeAndAwayLeaderboards;
  };

  private leaderboardsSort = (leaderboardArray: ITeamScoresData[]): ITeamScoresData[] => {
    leaderboardArray
      .sort((a:ITeamScoresData, b:ITeamScoresData) => b.goalsOwn - a.goalsOwn)
      .sort((a:ITeamScoresData, b: ITeamScoresData) => b.goalsFavor - a.goalsFavor)
      .sort((a:ITeamScoresData, b:ITeamScoresData) => b.goalsBalance - a.goalsBalance)
      .sort((a:ITeamScoresData, b:ITeamScoresData) => b.totalVictories - a.totalVictories)
      .sort((a:ITeamScoresData, b:ITeamScoresData) => b.totalPoints - a.totalPoints);

    return leaderboardArray;
  };

  public generateAllLeaderboards(teams:ITeam[], matches:IMatches[]): IHomeAndAwayLeaderboard {
    let teamPerformance;

    teamPerformance = this.generateTeamPerformanceObj(teams);

    teamPerformance = this.calcHomeAndAwayResults(teamPerformance, matches);

    const calcHomeScores: IParamObj = {
      teamPerformance, matchType: 'homeMatches', scoreType: 'homeScores',
    };

    const calcAwayScores: IParamObj = {
      teamPerformance, matchType: 'awayMatches', scoreType: 'awayScores',
    };

    teamPerformance = this.calcHomeAndAwayScores(calcHomeScores);
    teamPerformance = this.calcHomeAndAwayScores(calcAwayScores);
    teamPerformance = this.calcGeneralScores(teamPerformance);

    teamPerformance = this.leaderboardsGenerate(teamPerformance);

    teamPerformance.homeLeaderboard = this.leaderboardsSort(teamPerformance.homeLeaderboard);
    teamPerformance.awayLeaderboard = this.leaderboardsSort(teamPerformance.awayLeaderboard);
    teamPerformance.generalLeaderboard = this.leaderboardsSort(teamPerformance.generalLeaderboard);

    return teamPerformance;
  }
}
