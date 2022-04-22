import * as bcryptjs from 'bcryptjs';
import User from '../../database/models/UserModel';
import { IUser, ILoginUserData, IUserFullData } from '../../interfaces/user';
import Jwt from '../middlewares/auth';

export default class UserService {
  private _userModel;

  constructor() {
    this._userModel = User;
  }

  public async login(user: IUser): Promise<ILoginUserData | boolean> {
    let loginResponse: ILoginUserData | boolean = false;
    const modelResponse = await this._userModel.findOne({ where: { email: user.email } });

    if (!modelResponse) return loginResponse;
    const validUserData = await bcryptjs.compare(user.password, modelResponse.password);

    if (!validUserData) return loginResponse;
    const { id, username, role, email } = modelResponse;
    const userData = { id, username, role, email };
    const token = Jwt.generateToken(userData);
    loginResponse = { user: userData, token };

    return loginResponse;
  }

  public async loginValidate(token: string): Promise<IUserFullData> {
    const { email } = Jwt.verifyToken(token);
    const loginValidateResponse = await this._userModel.findOne({ where: { email } });

    return loginValidateResponse as IUserFullData;
  }
}
