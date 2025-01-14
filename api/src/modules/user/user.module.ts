import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { usersProviders } from '../../database/providers/user.provider';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, ...usersProviders],
})
export class UserModule {}
