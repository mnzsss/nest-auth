import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from '../auth/auth.module';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthStrategy } from './google-oauth.strategy';

@Module({
  imports: [AuthModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthStrategy, UsersService, PrismaService],
})
export class GoogleOauthModule {}
