import {
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateSpeakerDto } from "./create-speaker.dto";

export class UpdateConferenceDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsDateString()
    startTime?: string;

    @IsOptional()
    @IsDateString()
    endTime?: string;

    @IsOptional()
    @IsInt()
    roomId?: number;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateSpeakerDto)
    speaker?: CreateSpeakerDto;

    @IsOptional()
    @IsInt()
    sponsorId?: number;
}
