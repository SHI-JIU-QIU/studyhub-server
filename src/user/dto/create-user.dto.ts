import { IsNotEmpty, IsAlphanumeric, Length, Validate, IsEmail } from 'class-validator'



export class CreateUserDto {
    @IsNotEmpty()
    @Length(5, 10)
    @IsAlphanumeric()
    username: string;

    @Length(8, 16)
    @IsNotEmpty()
    @IsAlphanumeric()
    password: string;


    @IsNotEmpty()
    confirmPassword: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    captcha: string

}
