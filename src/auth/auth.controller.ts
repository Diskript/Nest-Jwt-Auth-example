import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SingUpDto } from "./dto/singup.dto";
import type { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/local/singup")
  singup(
    @Body() data: SingUpDto,
    @Req() req: Request,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.singup(data, req);
  }

  @Post("/local/singin")
  singin() {
    return this.authService.singin();
  }

  @Post("/logout")
  logout() {
    return this.authService.logout();
  }

  @Post("/refresh")
  refresh() {
    return this.authService.refresh();
  }
}
