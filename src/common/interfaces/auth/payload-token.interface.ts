import { Roles } from "src/common/constants/enum-roles";

export interface PayloadToken{
    sub: string,
    role: Roles
}