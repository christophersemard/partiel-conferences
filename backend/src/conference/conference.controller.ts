import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    Query,
} from "@nestjs/common";
import { ConferenceService } from "./conference.service";
import { CreateConferenceDto } from "../dto/create-conference.dto";
import { UpdateConferenceDto } from "../dto/update-conference.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { Role, User } from "@prisma/client";
import { GetUser } from "../decorators/get-user.decorator";

@Controller("conferences")
export class ConferenceController {
    constructor(private readonly service: ConferenceService) {}

    @Get()
    findAll(
        @Query("date") date?: string,
        @Query("roomId", new ParseIntPipe({ optional: true })) roomId?: number,
        @Query("speaker") speakerName?: string
    ) {
        return this.service.findAll({ date, roomId, speakerName });
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    create(@Body() dto: CreateConferenceDto) {
        return this.service.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SPONSOR)
    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: UpdateConferenceDto,
        @GetUser() user: User
    ) {
        return this.service.update(id, dto, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.service.delete(id);
    }
}
