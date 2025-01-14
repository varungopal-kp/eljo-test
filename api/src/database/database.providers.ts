import { Sequelize } from 'sequelize-typescript';
import { User } from './models/user.model';
import databaseConfig from '../config/database.config';
import { Transfer } from './models/transfer.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(databaseConfig);
      sequelize.addModels([User, Transfer]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
