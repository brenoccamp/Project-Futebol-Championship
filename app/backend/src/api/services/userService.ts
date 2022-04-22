import * as bcryptjs from 'bcryptjs';
import User from '../../database/models/UserModel';
import { IUser, ILoginUserData } from '../../interfaces/user';
import Jwt from '../middlewares/auth';

export default class UserService {
  private _userModel;

  constructor() {
    this._userModel = User;
  }

  public async login(user: IUser): Promise<ILoginUserData | boolean> {
    let serviceResponse: ILoginUserData | boolean = false;
    const modelResponse = await this._userModel.findOne({ where: { email: user.email } });

    if (!modelResponse) return serviceResponse;

    const validUserData = await bcryptjs.compare(user.password, modelResponse.password);
    if (!validUserData) return serviceResponse;

    const token = Jwt.generateToken(modelResponse);
    serviceResponse = { user: modelResponse, token };
    return serviceResponse;
  }
}
