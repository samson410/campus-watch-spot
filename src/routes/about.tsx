import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader, PublicFooter } from "@/components/layout/PublicHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CampusSafe" },
      { name: "description", content: "How CampusSafe helps universities and hostels report and respond to security incidents." },
      { property: "og:title", content: "About CampusSafe" },
      { property: "og:description", content: "How CampusSafe helps campuses respond to security incidents." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight">About CampusSafe</h1>
        <div className="prose prose-neutral dark:prose-invert mt-6 space-y-4 text-muted-foreground">
          <p>
            CampusSafe was built to close the gap between when a security incident
            happens and when the people who can help know about it.
          </p>
          <p>
            Students, hostel residents and villa mates can report incidents in seconds —
            with location, category and optional evidence. Security officers see reports
            on a live map, verify them, and update status. Administrators get analytics
            that surface hotspots and trends.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Our mission</h2>
          <p>
            Every campus deserves a safety network that is transparent, fast and
            privacy-respecting. Anonymous reporting is built in, so nobody has to
            choose between reporting and comfort.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Who uses it</h2>
          <ul className="list-disc pl-5">
            <li>Students & hostel residents reporting incidents</li>
            <li>Campus security officers verifying and responding</li>
            <li>University administrators tracking safety trends</li>
          </ul>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
