import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gokul Electronics — Electronics & Appliances Store in Dhanori, Pune" },
      {
        name: "description",
        content:
          "TVs, refrigerators, air coolers, washing machines and appliances at discounted prices in Dhanori, Pune. Open daily till 9 PM. Call 077750 11155.",
      },
      { property: "og:title", content: "Gokul Electronics — Dhanori, Pune" },
      {
        property: "og:description",
        content: "Your trusted electronics & appliances store in Dhanori, Pune.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  beforeLoad: () => {
    throw redirect({ href: "/site/index.html" });
  },
  component: () => null,
});
