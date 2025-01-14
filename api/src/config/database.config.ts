import { SequelizeOptions } from 'sequelize-typescript';

const databaseConfig: SequelizeOptions = {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'eljo',
};

export default databaseConfig;
