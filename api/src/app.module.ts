import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { StaticFilesModule } from './static-files.module';
import { AuthModule } from './modules/auth/auth.module';
import { ApiMiddleware } from './middlewares/api.middleware';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    StaticFilesModule,
    TransferModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiMiddleware)
      .exclude(
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'transfer/share-guest', method: RequestMethod.POST },
        { path: 'transfer/verify-token', method: RequestMethod.POST },
        { path: 'files/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply middleware for all other routes
  }
}
