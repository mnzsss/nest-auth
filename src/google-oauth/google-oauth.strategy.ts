import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

const PROVIDER_NAME = 'google';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      // Put config in `.env`
      clientID: process.env.OAUTH_GOOGLE_ID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      callbackURL: process.env.OAUTH_GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const userProvider = await this.usersService.findUserProviderByProviderId(
      PROVIDER_NAME,
      profile._json.sub,
    );

    if (!userProvider) {
      throw new HttpException(
        `Este e-mail ${profile._json.email} não está cadastrado.`,
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.usersService.user({ id: userProvider.userId });

    return user;
  }
}
