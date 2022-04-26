import { Request, Response, NextFunction } from 'express';

export interface ITeam {
  id: number;
  teamName: string;
}

export interface ITeamController {
  getAllTeams(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}

export interface ITeamService {
  getAllTeams(): Promise<ITeam[] | []>;
}
