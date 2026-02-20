import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";

export class SingUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 32)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(["USER", "ADMIN"])
  Role?: string;
}
