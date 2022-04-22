import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { IUserFullData } from '../../interfaces/user';

export default abstract class Jwt {
  static _JWT_SECRET: string;

  static _JWT_CONFIG: jwt.SignOptions;

  constructor() {
    Jwt._JWT_SECRET = fs.readFileSync('jwt.evaluation.key', 'utf-8');
    Jwt._JWT_CONFIG = { expiresIn: '7d', algorithm: 'HS256' };
  }

  static generateToken(userData: IUserFullData): string {
    return jwt.sign(userData, Jwt._JWT_SECRET, Jwt._JWT_CONFIG);
  }
}
