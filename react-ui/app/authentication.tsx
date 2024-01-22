"use client";

import axios from "axios";
import getConfig from "next/config";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LoginComponent from "./login";

enum LoginExperience {
  DEFAULT,
  IFRAME,
}

interface LoginOptionDto {
  label: string;
  loginUri: string;
  isSameAuthority: boolean;
}
async function getLoginOptions(): Promise<Array<LoginOptionDto>> {
  const response = await axios.get<Array<LoginOptionDto>>("/login-options");
  return response.data;
}

interface UserinfoDto {
  username: string;
  email: string;
  roles: string[];
  exp: number;
}
async function getMe(): Promise<UserinfoDto> {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publicRuntimeConfig = getConfig();
  const [loginUri, setLoginUri] = useState("");
  const [currentUser, setCurrentUser] = useState(User.ANONYMOUS);
  const [isLoginModalDisplayed, setIsLoginModalDisplayed] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const currentPath = usePathname()

  getLoginOptions().then((loginOpts) => {
    if (loginOpts?.length < 1 || !loginOpts[0].loginUri) {
      setLoginUri("");
    } else {
      setLoginUri(loginOpts[0].loginUri);
    }
  });

  async function login(formData: FormData) {
    if (!loginUri) {
      return;
    }
    const url = new URL(loginUri);
    url.searchParams.append(
      "post_login_success_uri",
      `${publicRuntimeConfig.baseUri}${currentPath}`
    );
    const loginUrl = url.toString();
    if (
      formData.get("selectedLoginExperience")?.toString() ===
      LoginExperience[LoginExperience.IFRAME]
    ) {
      setIframeSrc(loginUrl);
      setIsLoginModalDisplayed(true);
    } else {
      window.location.href = loginUrl;
    }
  }

  function logout() {
    setCurrentUser(User.ANONYMOUS);
    axios
      .post("/logout", null, {
        headers: {
          "X-POST-LOGOUT-SUCCESS-URI": publicRuntimeConfig.baseUri,
        },
      })
      .then((resp) => {
        const logoutUri = resp.headers["location"];
        if (!!logoutUri) {
          window.location.href = logoutUri;
        }
      })
      .finally(() => {
        setCurrentUser(User.ANONYMOUS);
      });
  }

  return (
    <div>
      <div className="flex bg-blue-500">
        <div className="m-auto"></div>
        <h1>React UI</h1>
        <div className="m-auto"></div>
        {loginUri && !currentUser.isAuthenticated && <LoginComponent></LoginComponent>}
      </div>
      {isLoginModalDisplayed && <iframe src={iframeSrc}></iframe>}
    </div>
  );
}
