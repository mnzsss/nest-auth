import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { GoogleOauthGuard } from './google-oauth.guard';

@Controller('auth/google')
export class GoogleOauthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() _req) {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { access_token } = await this.authService.login(req.user as User);
    res.cookie('jwt', access_token);
    return req.user;
  }
}
