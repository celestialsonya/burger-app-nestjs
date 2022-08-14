import {Role} from "../../../types";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class AssignRoleDto{
    @IsNotEmpty()
    @IsNumber()
    userId: number
    @IsNotEmpty()
    @IsString()
    role: Role
}