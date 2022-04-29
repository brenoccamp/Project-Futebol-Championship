import { Request, Response, NextFunction } from 'express';
import { IMatches } from './match';
import { ITeam } from './team';

export interface ITeamScoresData {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;
}

export interface IMatchData {
  victories: number;
  losses: number;
  draws: number;
  goalsFavor: number;
  goalsOwn: number;
}

export interface ITeamMatchesData {
  name: string;
  homeMatches: IMatchData;
  awayMatches: IMatchData;
  homeScores?: ITeamScoresData;
  awayScores?: ITeamScoresData;
}

export interface ITeamPerformance {
  [key: string]: ITeamMatchesData;
}

export interface IHomeAndAwayLeaderboard {
  leaderboardHome: ITeamScoresData[];
  leaderboardAway: ITeamScoresData[];
}

export interface ILeaderboardController {
  leaderboardHome(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}

export interface ILeaderboardService {
  leaderboardHome(teams: ITeam[], matches: IMatches[]): Promise<any>;
}
