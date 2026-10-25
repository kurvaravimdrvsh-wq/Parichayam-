import { createFileRoute } from "@tanstack/react-router";
import { Parichayam } from "@/components/parichayam";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Parichayam />;
}
