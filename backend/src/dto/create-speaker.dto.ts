import { IsOptional, IsString } from "class-validator";

export class CreateSpeakerDto {
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
