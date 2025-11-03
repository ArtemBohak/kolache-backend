import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { SignInUserDTO } from './dto/sign-in-user.dto';
import { AuthService } from './auth.service';
import { SignUpUserDTO } from './dto/sign-up-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AUTH_ROLES } from 'types/auth';

@Controller('auth')
export class AuthController {
  refreshTokenOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() data: SignInUserDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(data);

    response.cookie('refreshToken', refreshToken, this.refreshTokenOptions);

    return { accessToken };
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  async signUp(
    @Body() data: SignUpUserDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signUp(data);

    response.cookie('refreshToken', refreshToken, this.refreshTokenOptions);

    return { accessToken };
  }

  @Roles(AUTH_ROLES.KOLACHE_GAME_USER)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request, @Res() response: Response) {
    const refreshToken = await this.authService.refreshAccessToken(
      request.cookies.refreshToken,
    );
    if (!refreshToken) {
      response.clearCookie('refreshToken', this.refreshTokenOptions);
      throw new UnauthorizedException();
    }
  }

  @Roles(AUTH_ROLES.KOLACHE_GAME_USER)
  @Get('profile')
  getProfile(@Req() req: { user: object }) {
    return req.user;
  }
}
