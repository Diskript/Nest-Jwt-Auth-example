import { OmitType } from "@nestjs/mapped-types";
import { SingUpDto } from "./singup.dto";

export class loginDto extends OmitType(SingUpDto, [
  "username",
  "Role",
] as const) {}
