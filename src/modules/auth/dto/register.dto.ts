import { IsEmail, IsNotEmpty, MinLength, IsPhoneNumber, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;
}
