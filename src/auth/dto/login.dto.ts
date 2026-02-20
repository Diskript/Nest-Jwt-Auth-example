import { OmitType } from "@nestjs/mapped-types";
import { SingUpDto } from "./singup.dto";

export class logitDto extends OmitType(SingUpDto, [
  "username",
  "Role",
] as const) {}
