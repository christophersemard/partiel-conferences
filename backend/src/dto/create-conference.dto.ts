import {
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateSpeakerDto } from "./create-speaker.dto";

export class CreateConferenceDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    date: string; // format ISO string

    @IsDateString()
    startTime: string;

    @IsDateString()
    endTime: string;

    @IsInt()
    roomId: number;

    @IsOptional()
    @IsInt()
    sponsorId?: number;

    @ValidateNested()
    @Type(() => CreateSpeakerDto)
    speaker: CreateSpeakerDto;
}
