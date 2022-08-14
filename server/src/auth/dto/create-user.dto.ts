import {IsNotEmpty, IsPhoneNumber, IsString} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;
    @IsPhoneNumber()
    phone_number: string;
}
