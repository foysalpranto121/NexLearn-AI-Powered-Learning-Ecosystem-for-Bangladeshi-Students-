import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address formatting' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(10, { message: 'Password must be at least 10 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 numeric value',
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;
}
