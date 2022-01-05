import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new HttpException(
        `Nenhum usuário com esse e-mail ${email} foi encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordMatched = await bcrypt.compare(pass, user.password);

    if (!passwordMatched) {
      throw new HttpException(
        `Senha ou e-mail inválidos`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
