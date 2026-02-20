import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SingUpDto } from "./dto/singup.dto";
import type { Request } from "express";
import { loginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/local/singup")
  singUpLocal(
    @Body() data: SingUpDto,
    @Req() req: Request,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.singUpLocal(data, req);
  }

  @Post("/local/singin")
  singin(@Body() data: loginDto, @Req() req: Request) {
    return this.authService.singin(data, req);
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
