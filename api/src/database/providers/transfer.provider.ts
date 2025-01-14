import { Constants } from 'src/config/constants';
import { Transfer } from '../models/transfer.model';

export const transferProviders = [
  {
    provide: Constants.PROIVDERS.TRANSFER_REPOSITORY,
    useValue: Transfer,
  },
];
