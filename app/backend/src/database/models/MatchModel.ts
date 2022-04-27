import { DataTypes, Model } from 'sequelize';
import db from '.';
import Team from './TeamModel';

class Match extends Model {
  declare id: number;

  declare homeTeam: number;

  declare homeTeamGoals: number;

  declare awayTeam: string;

  declare awayTeamGoals: number;

  declare inProgress: boolean;
}

Match.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  homeTeam: { type: DataTypes.INTEGER, allowNull: false },
  homeTeamGoals: { type: DataTypes.INTEGER, allowNull: false },
  awayTeam: { type: DataTypes.INTEGER, allowNull: false },
  awayTeamGoals: { type: DataTypes.INTEGER, allowNull: false },
  inProgress: { type: DataTypes.BOOLEAN, allowNull: false },
}, {
  underscored: true,
  sequelize: db,
  modelName: 'Match',
  timestamps: false,
  tableName: 'matches',
});

Match.belongsTo(Team, { foreignKey: 'homeTeam', as: 'teamHome' });
Match.belongsTo(Team, { foreignKey: 'awayTeam', as: 'teamAway' });

export default Match;
