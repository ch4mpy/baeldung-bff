"use client";

import axios from "axios";
import getConfig from "next/config";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

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

export default function LoginComponent() {
  const publicRuntimeConfig = getConfig();
  const [loginUri, setLoginUri] = useState("");
  const [selectedLoginExperience, setSelectedLoginExperience] = useState(
    LoginExperience.DEFAULT
  );
  const [isLoginModalDisplayed, setIsLoginModalDisplayed] = useState(false);
  const [isIframeLoginPossible, setIframeLoginPossible] = useState(false);
  const currentPath = usePathname();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchLoginOptions();

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.src = "";
    }
    iframe?.addEventListener("load", onIframeLoad);
    return () => {
      iframe?.removeEventListener("load", onIframeLoad);
    };
  }, []);

  async function fetchLoginOptions() {
    const loginOpts = await getLoginOptions();
    if (loginOpts?.length < 1 || !loginOpts[0].loginUri) {
      setLoginUri("");
      setIframeLoginPossible(false);
    } else {
      setLoginUri(loginOpts[0].loginUri);
      setIframeLoginPossible(loginOpts[0].isSameAuthority);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!loginUri) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const url = new URL(loginUri);
    url.searchParams.append(
      "post_login_success_uri",
      `${publicRuntimeConfig.baseUri}${currentPath}`
    );
    const loginUrl = url.toString();
    if (
      formData.get("selectedLoginExperience")?.toString() === "iframe" &&
      iframeRef.current
    ) {
      iframeRef.current.src = loginUrl;
      setIsLoginModalDisplayed(true);
    } else {
      window.location.href = loginUrl;
    }
  }

  function onIframeLoad(event: any) {
    if (!!event.currentTarget.src) {
      setIsLoginModalDisplayed(true);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <select
        value={selectedLoginExperience}
        onChange={(e) => {
          setSelectedLoginExperience(
            e?.target?.value === "iframe"
              ? LoginExperience.IFRAME
              : LoginExperience.DEFAULT
          );
        }}
      >
        {isIframeLoginPossible && (
          <option value={LoginExperience.IFRAME}>iframe</option>
        )}
        <option value={LoginExperience.DEFAULT}>default</option>
      </select>
      <button type="submit">Login</button>
      {isLoginModalDisplayed && <iframe ref={iframeRef}></iframe>}
    </form>
  );
}
