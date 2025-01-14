import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to your public folder
      serveRoot: '/files', // Serve files under the '/files' route
    }),
  ],
})
export class StaticFilesModule {}
