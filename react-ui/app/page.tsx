"use client";

import { useUserContext } from "./layout";


export default function Home() {
  const user = useUserContext();
  const message = user.isAuthenticated
    ? `Hi ${user.name}, you are granted with [${
        user.roles.length ? '"' : ""
      }${user.roles.join('", "')}${user.roles.length ? '"' : ""}].`
    : "You are not authenticated.";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Home</h1>
        <p>{message}</p>
      </div>
    </main>
  );
}
