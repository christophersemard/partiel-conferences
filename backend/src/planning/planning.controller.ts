import {
    Controller,
    Get,
    Param,
    Post,
    Delete,
    ParseIntPipe,
    UseGuards,
} from "@nestjs/common";
import { PlanningService } from "./planning.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { GetUser } from "../decorators/get-user.decorator";
import { User, Role } from "@prisma/client";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "../guards/roles.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.VISITOR)
@Controller()
export class PlanningController {
    constructor(private readonly planningService: PlanningService) {}

    @Get("/me/planning")
    getUserPlanning(@GetUser() user: User) {
        return this.planningService.getUserPlanning(user.id);
    }

    @Post("/planning/:conferenceId")
    addToPlanning(
        @Param("conferenceId", ParseIntPipe) conferenceId: number,
        @GetUser() user: User
    ) {
        return this.planningService.addToPlanning(user.id, conferenceId);
    }

    @Delete("/planning/:conferenceId")
    removeFromPlanning(
        @Param("conferenceId", ParseIntPipe) conferenceId: number,
        @GetUser() user: User
    ) {
        return this.planningService.removeFromPlanning(user.id, conferenceId);
    }
}
