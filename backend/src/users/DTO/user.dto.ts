import { Exclude } from "class-transformer";
import { IsOptional } from "class-validator";

export class UserDto {
    id: string;
    name: string;
    email: string;

    @IsOptional()
    @Exclude()
    password?: string;
}