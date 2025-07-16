import { Controller } from "@nestjs/common";
import { Get, UseGuards } from "@nestjs/common";
import { SponsorService } from "./sponsor.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { GetUser } from "../decorators/get-user.decorator";
import { User } from "@prisma/client";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "@prisma/client";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SPONSOR)
@Controller("sponsor")
export class SponsorController {
    constructor(private readonly sponsorService: SponsorService) {}

    // Get all conferences for a sponsor
    @Get("conferences")
    getConferences(@GetUser() user: User) {
        const conferences = this.sponsorService.getConferencesForSponsor(
            user.id
        );
        return conferences;
    }
}
