import { IsEmail, IsNotEmpty, IsPhoneNumber, IsOptional } from 'class-validator';

export class OtpDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;
}

export class VerifyOtpDto {
    @IsNotEmpty()
    otp: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;
}
