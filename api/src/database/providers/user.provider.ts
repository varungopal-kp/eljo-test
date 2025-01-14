import { Constants } from 'src/config/constants';
import { User } from '../models/user.model';

export const usersProviders = [
  {
    provide: Constants.PROIVDERS.USER_REPOSITORY,
    useValue: User,
  },
];
