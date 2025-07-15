import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "@prisma/client";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get("rooms-occupancy")
    getRoomsOccupancy() {
        return this.adminService.getRoomsOccupancy();
    }

    @Get("rooms/:id/planning")
    getRoomPlanning(@Param("id", ParseIntPipe) id: number) {
        return this.adminService.getRoomPlanning(id);
    }

    @Get("sponsors")
    getSponsors() {
        return this.adminService.getSponsors();
    }
}
