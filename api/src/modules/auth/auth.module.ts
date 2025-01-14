import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { usersProviders } from 'src/database/providers/user.provider';
import { TokenService } from 'src/helpers/token.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, ...usersProviders],
})
export class AuthModule {}
