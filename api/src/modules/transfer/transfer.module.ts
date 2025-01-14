import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { MailService } from 'src/helpers/mail.service';
import { multerConfig } from 'src/config/multer.config';
import { transferProviders } from 'src/database/providers/transfer.provider';
import { UserService } from '../user/user.service';
import { usersProviders } from 'src/database/providers/user.provider';
import { TokenService } from 'src/helpers/token.service';

@Module({
  imports: [multerConfig],
  controllers: [TransferController],
  providers: [
    TransferService,
    MailService,
    UserService,
    TokenService,
    ...transferProviders,
    ...usersProviders,
  ],
})
export class TransferModule {}
