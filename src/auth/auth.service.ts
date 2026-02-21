import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaModuleService } from "src/prisma-module/prisma-module.service";
import { SingUpDto } from "./dto/singup.dto";
import * as bcrypt from "bcrypt";
import { ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { loginDto } from "./dto/login.dto";

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaModuleService,
    private jwtService: JwtService,
  ) {}

  async singUpLocal(data: SingUpDto, req: Request): Promise<Tokens> {
    try {
      const hashedPassword: string = await bcrypt.hash(data.password, 10);

      const user = await this.prismaService.user.create({
        data: {
          email: data.email,
          username: data.username,
          passwordHash: hashedPassword,
        },
      });

      const tokens = await this.getToken(user.id, user.email);
      await this.updateRefreshToken(req, user.id, tokens.refresh_token);
      console.log(user);
      return tokens;
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "P2002") {
        throw new ConflictException("Email or username already exists");
      }
      throw error;
    }
  }

  async singin(data: loginDto, req: Request): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) throw new ForbiddenException("User not found" as string);

    const passwordMatches = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );
    if (!passwordMatches)
      throw new ForbiddenException("Incorrect password" as string);

    const tokens = await this.getToken(user.id, user.email);
    await this.updateRefreshToken(req, user.id, tokens.refresh_token);
    console.log(user);
    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
        token: {
          not: undefined,
        },
      },
    });
  }

  async refresh(req: Request, userId: number, rt: string): Promise<Tokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ConflictException("User not found" as string);

    const refreshHash = await this.prismaService.refreshToken.findFirstOrThrow({
      where: {
        userId,
      },
    });
    if (!refreshHash)
      throw new ConflictException("Refresh tokens not found" as string);

    const rtMatches = await bcrypt.compare(rt, refreshHash.token);
    if (!rtMatches)
      throw new ConflictException("Invalid Refresh Token" as string);

    const tokens = await this.getToken(user.id, user.email);
    await this.updateRefreshToken(req, user.id, tokens.refresh_token);
    return tokens;
  }

  extractSubFromToken(token: string): number {
    const payload = this.jwtService.verify<{ sub: number }>(token, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });
    return payload.sub;
  }

  async getToken(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: "secret",
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: "anothersecret",
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  getUserDeviceInfoFromRequest(req: Request) {
    return {
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    };
  }

  async updateRefreshToken(
    req: Request,
    userId: number,
    rt: string,
  ): Promise<void> {
    const hashedRt = await bcrypt.hash(rt, 10);

    await this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
    console.log(hashedRt);
    await this.prismaService.refreshToken.create({
      data: {
        token: hashedRt,
        userId,
        deviceInfo: this.getUserDeviceInfoFromRequest(req),
      },
    });
  }

  extractRefreshTokenFromRequest(req: Request): string {
    const cookies = req.cookies as Record<string, string> | undefined;
    const refreshToken: string | undefined =
      cookies?.refresh_token || req.headers.authorization?.split(" ")[1];
    if (!refreshToken)
      throw new ConflictException("Refresh token not found" as string);
    return refreshToken;
  }
}
