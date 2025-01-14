import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import { User } from '../../database/models/user.model';
import { TokenService } from 'src/helpers/token.service';
import { Constants } from 'src/config/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Constants.PROIVDERS.USER_REPOSITORY)
    private userModel: typeof User,
    private readonly tokenService: TokenService,
  ) {}

  async signup(name: string, email: string, password: string) {
    const existingUser = await this.userModel.findOne({ where: { email } });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      if (!existingUser.loginType) {
        throw new BadRequestException('User already exists');
      } else {
        existingUser.password = hashedPassword;
        existingUser.name = name;
        existingUser.loginType = null;
        existingUser.otp = null;

        await existingUser.save();
        return existingUser;
      }
    } else {
      const user = new this.userModel({
        name,
        email,
        password: hashedPassword,
      });
      await user.save();
      return user;
    }
  }

  async signin(email: string, password: string) {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if(!user.password){
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    return tokens;
  }

  generateTokens(user: User) {
    const payload = { userId: user.id, userEmail: user.email };
    const accessToken = this.tokenService.assignToken(payload);
    const refreshToken = this.tokenService.assignToken(payload, '7d');

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.tokenService.verifyToken(refreshToken);
      const user = await this.userModel.findByPk(decoded.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = this.tokenService.assignToken({
        userId: user.id,
        userEmail: user.email,
      });
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  async createSocialUser(name: string, email: string) {
    try {
      const user = await this.userModel
        .findOrCreate({
          where: { email },
          defaults: { name, loginType: 'social' },
        })
        .then(([user, created]) => user);
      if (user) {
        return this.generateTokens(user);
      } else {
        throw new BadRequestException('User create error');
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException('User create error');
    }
  }

  async otpVerify(otp, fromEmail) {
    try {
      const user = await this.userModel.findOne({
        where: { email: fromEmail },
      });
      if (user) {
        if (user.otp == otp) {
          user.otp = null;
          await user.save();
          return user;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Token failed error');
    }
  }
  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne<User>({ where: { email } });
  }
  async verifyToken(token: string) {
    try {
      const decoded = this.tokenService.verifyToken(token);
      return decoded;
    } catch (error) {
      throw new BadRequestException('Token failed error');
    }
  }
}
