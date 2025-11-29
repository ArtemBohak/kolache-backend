import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from 'src/microservices/core/auth/auth.service';
import { AUTH_ROLES } from '../types/auth';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { TELEGRAM_REQUEST } from 'guards/telegram-request.decorator';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AUTH_ROLES[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const isTelegramRequest = this.reflector.get(
      TELEGRAM_REQUEST,
      context.getClass(),
    );

    if (isTelegramRequest) {
      // return this.validateTelegram(context, requiredRoles);
    } else if (context.getType() === 'http') {
      return this.validateJwt(context, requiredRoles);
    }

    return true;
  }

  private extractAccessToken(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }

  private async validateJwt(
    context: ExecutionContext,
    requiredRoles: AUTH_ROLES[],
  ) {
    const request: Request = context.switchToHttp().getRequest();

    const accessToken = this.extractAccessToken(request);

    try {
      const decodedAccessToken = await this.authService.asyncVerifyToken<{
        roles: AUTH_ROLES[];
      }>(accessToken);
      if (!decodedAccessToken) {
        throw new UnauthorizedException();
      }

      const hasPermission = requiredRoles.every((role) => {
        return decodedAccessToken.roles.includes(role);
      });

      if (!hasPermission) {
        throw new ForbiddenException();
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  // private async validateTelegram(
  //   context: ExecutionContext,
  //   requiredRoles: AUTH_ROLES[],
  // ) {
  //   return true;
  // }
}
