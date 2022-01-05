import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { GoogleOauthModule } from './google-oauth/google-oauth.module';

@Module({
  imports: [AuthModule, UsersModule, GoogleOauthModule],
  controllers: [AppController],
  providers: [PrismaService, UsersService],
})
export class AppModule {}
