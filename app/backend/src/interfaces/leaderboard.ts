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
  generalScores?: ITeamScoresData;
}

export interface ITeamPerformance {
  [key: string]: ITeamMatchesData;
}

export interface IHomeAndAwayLeaderboard {
  homeLeaderboard: ITeamScoresData[];
  awayLeaderboard: ITeamScoresData[];
  generalLeaderboard: ITeamScoresData[];
}

export type MatchTypes = 'homeMatches' | 'awayMatches';
export type ScoreTypes = 'homeScores' | 'awayScores';

export interface IParamObj {
  teamPerformance: ITeamPerformance;
  matchType: MatchTypes;
  scoreType: ScoreTypes;
}

export interface ILeaderboardController {
  leaderboardHome(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  leaderboardAway(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  generalLeaderboard(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}

export interface ILeaderboardService {
  generateAllLeaderboards(teams: ITeam[], matches: IMatches[]): IHomeAndAwayLeaderboard;
}
