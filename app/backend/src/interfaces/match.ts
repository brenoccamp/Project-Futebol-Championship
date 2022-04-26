import { Request, Response, NextFunction } from 'express';
import MatchModel from '../database/models/MatchModel';

export interface IMatch {
  homeTeam: string;
  homeTeamGoals: string;
  awayTeam: string;
  awayTeamGoals: string;
  inProgress: boolean;
}

export interface IMatches extends MatchModel {
  teamHome: { teamName: string };
  teamAway: { teamName: string };
}

export interface IMatchController {
  getAllMatches(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}

export interface IMatchService {
  getAllMatches(): Promise<IMatch[] | []>;
}
