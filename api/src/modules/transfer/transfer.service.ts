import { Inject, Injectable } from '@nestjs/common';

import { Transfer } from 'src/database/models/transfer.model';
import { TokenService } from 'src/helpers/token.service';
import { UserService } from '../user/user.service';
import { Constants } from 'src/config/constants';

@Injectable()
export class TransferService {
  constructor(
    @Inject(Constants.PROIVDERS.TRANSFER_REPOSITORY)
    private transferModel: typeof Transfer,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}
  async saveTransfer(data) {
    const document = new this.transferModel({
      fromEmail: data.fromEmail,
      toEmail: data.toEmail,
      filePath: data.filePath,
      status: data.status,
      title: data.title,
      message: data.message,
    });
    await document.save();
    return document;
  }

  async getTransfer(id) {
    const document = await this.transferModel.findOne({ where: { id } });
    return document;
  }
  async assignToken(data): Promise<string> {
    return await this.tokenService.assignToken(data);
  }
  async getUserById(id): Promise<any> {
    return await this.userService.getUserById(id);
  }
  async getUserByEmail(email): Promise<any> {
    return await this.userService.getUserByEmail(email);
  }
  async createUser(data): Promise<any> {
    return await this.userService.createUser(data);
  }
  async updateUser(id, data): Promise<any> {
    return await this.userService.updateUser(id, data);
  }
}
