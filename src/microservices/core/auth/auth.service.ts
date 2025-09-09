import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SignInUserDTO } from './dto/sign-in-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { SignUpUserDTO } from './dto/sign-up-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async signIn(data: SignInUserDTO) {
    const user = await this.usersService.findOne(data);
    if (!user) {
      throw new UnauthorizedException('Such a user does not exist');
    }

    const passwordIsCorrect = await this.comparePasswords(
      data.password,
      user?.password,
    );

    if (!passwordIsCorrect) {
      throw new UnauthorizedException('Username or password is wrong');
    }

    return await this.createJwtTokens(user);
  }

  async signUp(data: SignUpUserDTO) {
    const { username, email } = data;
    const existingUser = await this.usersService.findOne({
      username,
      email,
    });
    if (existingUser) {
      throw new ConflictException('User with such data already exists');
    }

    const hashedPassword = await this.hashPassword(data.password);
    const newUser = await this.usersService.createNewUser({
      ...data,
      password: hashedPassword,
    });
    if (!newUser) {
      throw new InternalServerErrorException('Failed to create user');
    }

    return await this.createJwtTokens(newUser);
  }

  async createJwtTokens(user: User) {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    if (!accessToken || !refreshToken) {
      throw new InternalServerErrorException(
        'Failed to create tokens for authentication',
      );
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decodedToken: { username: string } =
        await this.asyncVerifyToken(refreshToken);
      if (!decodedToken) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.findOne({
        username: decodedToken.username,
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      const newAccessToken = await this.createAccessToken(user);
      return {
        accessToken: newAccessToken,
      };
    } catch {
      return null;
    }
  }

  async createAccessToken(user: User) {
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
      email: user.email,
      userId: user.id,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
  }

  async createRefreshToken(user: User) {
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
      email: user.email,
      userId: user.id,
    };

    return await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
  }

  async asyncVerifyToken<T extends object>(token: string) {
    try {
      const secret = this.configService.get('JWT_SECRET_KEY') as string;
      const decodedToken: T = await this.jwtService.verifyAsync(token, {
        secret,
      });
      return decodedToken;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  async hashPassword(password: string) {
    const passwordHashSalt = this.configService.get(
      'PASSWORD_HASH_SALT',
    ) as string;
    const hashedPassword = await bcrypt.hash(password, passwordHashSalt);
    return hashedPassword;
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
