import { DataTypes, Model } from 'sequelize';
import db from '.';

class User extends Model {

}

User.init({
  username: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize: db,
  modelName: 'User',
  timestamps: false,
  underscored: true,
  tableName: 'users',
});

export default User;
