import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { IUserFullData } from '../../interfaces/user';

export default abstract class Jwt {
  static _JWT_SECRET = fs.readFileSync('jwt.evaluation.key', 'utf-8');

  static _JWT_CONFIG: jwt.SignOptions = { expiresIn: '7d', algorithm: 'HS256' };

  static generateToken(userData: IUserFullData): string {
    return jwt.sign(userData, Jwt._JWT_SECRET, Jwt._JWT_CONFIG);
  }

  static verifyToken(token: string): IUserFullData {
    const tokenDecoded = jwt.verify(token, Jwt._JWT_SECRET);

    return tokenDecoded as IUserFullData;
  }
}
