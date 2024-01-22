import axios from "axios";

export interface UserinfoDto {
  username: string;
  email: string;
  roles: string[];
  exp: number;
}
export async function getMe(): Promise<UserinfoDto> {
  const response = await axios.get<UserinfoDto>("/bff/v1/me");
  return response.data;
}

export class User {
  static readonly ANONYMOUS = new User("", "", []);

  constructor(
    readonly name: string,
    readonly email: string,
    readonly roles: string[]
  ) {}

  get isAuthenticated(): boolean {
    return !!this.name;
  }

  hasAnyRole(...roles: string[]): boolean {
    for (let r of roles) {
      if (this.roles.includes(r)) {
        return true;
      }
    }
    return false;
  }
}
