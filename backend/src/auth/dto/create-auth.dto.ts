import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example: 'john@gmail.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  password: string;
}
