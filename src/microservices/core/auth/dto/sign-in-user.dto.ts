import { IsString } from 'class-validator';

export class SignInUserDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
