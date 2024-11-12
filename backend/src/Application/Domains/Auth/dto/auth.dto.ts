import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{8,15}$/, {
    message:
      'A senha deve ter 8 carecteres, um especial um maúsculo e um número no mínimo',
  })
  password: string;
}
