import { Exclude, Expose } from "class-transformer";

export class UserDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    provider?: string;

    @Expose()
    providerId?: string;

    @Exclude()
    password?: string;
}