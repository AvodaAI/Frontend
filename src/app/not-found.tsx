// src/app/not-found.tsx

import Link from 'next/link'
import { Button } from "@components/ui/button";
import { Section } from "@components/section";
import { Container } from "@components/container";

export default async function NotFound() {
  return (
    <Container className="min-h-[80vh] flex flex-col justify-center items-center text-center">
      <Section>
      <h1 className="text-[2.5rem] font-bold">
        Page Not Found!
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
      </Section>
    </Container>
  );
}
