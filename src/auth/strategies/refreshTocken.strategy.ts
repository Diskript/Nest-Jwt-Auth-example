import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RtToken extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "anothersecret",
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any): any {
    const header = req.get("Authorization");
    if (!header) {
      throw new Error("no auth header");
    }
    try {
      const refreshToken = header.replace("Bearer", "").trim();
      return {
        ...payload,
        refreshToken,
      };
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
