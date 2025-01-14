import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../database/models/user.model';
import * as bcrypt from 'bcryptjs';
import { Constants } from 'src/config/constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(Constants.PROIVDERS.USER_REPOSITORY)
    private userModel: typeof User,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userModel.findAll<User>();
  }
  async getUserById(id: number): Promise<User> {
    return await this.userModel.findByPk<User>(id, {
      attributes: { exclude: ['password', 'otp'] },
    });
  }
  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne<User>({ where: { email } });
  }
  async createUser(user): Promise<User> {
    const newuser = new this.userModel(user);
    await newuser.save();
    return user;
  }
  async updateUser(id: number, user): Promise<User> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
      user.loginType = null;
    }

    await this.userModel.update<User>(user, { where: { id } });
    const updatedUser = await this.userModel.findOne({ where: { id } });
    return updatedUser;
  }
}
