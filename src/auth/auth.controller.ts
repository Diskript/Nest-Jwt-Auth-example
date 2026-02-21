import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService, Tokens } from "./auth.service";
import { SingUpDto } from "./dto/singup.dto";
import type { Request } from "express";
import { loginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/local/singup")
  async singUpLocal(
    @Body() data: SingUpDto,
    @Req() req: Request,
  ): Promise<Tokens> {
    return this.authService.singUpLocal(data, req);
  }

  @Post("/local/singin")
  async singin(@Body() data: loginDto, @Req() req: Request): Promise<Tokens> {
    return await this.authService.singin(data, req);
  }

  @Post("/logout")
  async logout(@Req() req: Request): Promise<void> {
    const userId = this.authService.extractSubFromToken(
      this.authService.extractRefreshTokenFromRequest(req),
    );
    await this.authService.logout(userId);
  }

  @Post("/refresh")
  async refresh(@Req() req: Request): Promise<Tokens> {
    const refreshToken = this.authService.extractRefreshTokenFromRequest(req);
    const userId = this.authService.extractSubFromToken(refreshToken);
    return await this.authService.refresh(req, userId, refreshToken);
  }
}
