import { Request, Response, NextFunction } from 'express';
import MatchModel from '../database/models/MatchModel';

export interface IMatch {
  id: number;
}

export interface INewMatch extends IMatch {
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
}

export interface IMatchWithInProgress extends INewMatch {
  inProgress: boolean;
}

export interface IMatches extends MatchModel {
  teamHome: { teamName: string };
  teamAway: { teamName: string };
}

export interface IMatchResult {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface IMatchController {
  getAllMatches(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  createMatchInProgress(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  setMatchFinish(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  setMatchResult(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}

export interface IMatchService {
  getAllMatches(): Promise<IMatches[]>;
  createMatchInProgress(newMatch: INewMatch): Promise<IMatch | undefined>;
  setMatchFinish(id: string): Promise<boolean>;
  setMatchResult(id: string, result: IMatchResult): Promise<boolean>;
  getMatchesByProgress(inProgress: boolean): Promise<IMatches[]>;
}
