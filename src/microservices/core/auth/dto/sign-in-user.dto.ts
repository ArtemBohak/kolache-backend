import { IsString } from 'class-validator';

export class SignInUserDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
