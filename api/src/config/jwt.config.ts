import { Constants } from './constants';

const jwtConfig = {
  secret: Constants.JWT_SECRET,
  signOptions: { expiresIn: Constants.JWT_EXPIRATION },
};

export default jwtConfig;
