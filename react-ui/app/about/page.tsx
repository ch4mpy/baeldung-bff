import getConfig from "next/config";
import Image from "next/image";

const { publicRuntimeConfig } = getConfig();

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <p>
          This application is a show-case for an Angular app consuming a REST
          API through an OAuth2 BFF.
        </p>
      </div>
    </main>
  );
}
