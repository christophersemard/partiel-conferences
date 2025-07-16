import { IsOptional, IsString } from "class-validator";

export class CreateSpeakerDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    @IsString()
    photoUrl?: string;

    @IsOptional()
    @IsString()
    bio?: string;
}
