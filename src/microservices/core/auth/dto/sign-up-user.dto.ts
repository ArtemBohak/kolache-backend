import { IsString } from 'class-validator';

export class SignUpUserDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  email: string;
}
