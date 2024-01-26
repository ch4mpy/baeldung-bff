"use client";

import Link from "next/link";
import { useUserContext } from "./layout";

export default function Home() {
  const user = useUserContext();
  const message = user.isAuthenticated
    ? `Hi ${user.name}, you are granted with [${
        user.roles.length ? '"' : ""
      }${user.roles.join('", "')}${user.roles.length ? '"' : ""}].`
    : "You are not authenticated.";

  return (
    <main className="min-h-screen">
      <div className="flex">
        <span className="ml-2"></span>
        <button>
          <Link href="/about">About</Link>
        </button>
        <span className="m-auto"></span>
        <h1>Home</h1>
        <span className="m-auto"></span>
      </div>
      <div className="flex flex-col items-center justify-between p-24">
        <p>{message}</p>
      </div>
    </main>
  );
}
