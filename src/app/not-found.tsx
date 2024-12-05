// src/app/not-found.tsx
import Link from "next/link"
import { Button } from "./components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-[2.5rem] font-bold">
        404 - Page Not Found!
      </h1>
      <p className="mt-2 text-xl text-gray-500">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="mt-3 inline-block">
        <Button
          variant={"outline"}
          className="w-full justify-start"
        >
          Go Back Home
        </Button>
      </Link>
    </main>
  );
}
