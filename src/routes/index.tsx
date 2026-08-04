import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, MapPin, Bell, BarChart3, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader, PublicFooter } from "@/components/layout/PublicHeader";
import heroImage from "@/assets/campus-hero.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Feature({ icon: Icon, title, children }: { icon: typeof Shield; title: string; children: React.ReactNode }) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold transition-colors group-hover:text-primary">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}


function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Students walking on a university campus walkway at sunset"
            className="h-full w-full object-cover"
            width={1920}
            height={1088}
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-28 md:py-36 lg:py-44">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Shield className="h-3.5 w-3.5 text-white" /> Campus Safety Platform
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Safer campuses,<br />reported in real time.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/90 md:text-lg">
              CampusSafe lets students, hostel residents and security officers report,
              map and resolve security incidents together — so response is faster and
              hotspots stop being blind spots.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/auth" search={{ tab: "signup" } as never}>Create an account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link to="/auth">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>


      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need to keep campus safe</h2>
          <p className="mt-3 text-muted-foreground">
            Built for universities, hostels and student villas — with clear roles for students,
            security officers and administrators.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Feature icon={MapPin} title="Interactive Map">
            View incidents on a live campus map with severity-coded markers and a hotspot heatmap.
          </Feature>
          <Feature icon={Bell} title="Emergency Alerts">
            Emergency reports trigger real-time alerts to security officers and dashboards.
          </Feature>
          <Feature icon={BarChart3} title="Hotspot Analytics">
            Weekly and monthly trends, category breakdowns and location hotspots at a glance.
          </Feature>
          <Feature icon={Lock} title="Anonymous Reporting">
            Report sensitive incidents anonymously without compromising accountability.
          </Feature>
          <Feature icon={Shield} title="Verified Incidents">
            Security officers verify, update and resolve reports — status flows to reporters.
          </Feature>
          <Feature icon={Users} title="Role-Based Access">
            Students, security officers and admins each get purpose-built dashboards.
          </Feature>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
          {[
            { n: "1", t: "Sign up", d: "Create your student, security or admin account in seconds." },
            { n: "2", t: "Report", d: "Submit an incident with location, category and optional photo." },
            { n: "3", t: "Resolve", d: "Security officers verify, respond and update status live." },
          ].map((s) => (
            <div key={s.n} className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
              <div className="mb-3 grid h-9 w-9 place-items-center rounded-full bg-primary font-semibold text-primary-foreground transition-transform duration-200 group-hover:scale-110">
                {s.n}
              </div>
              <h3 className="text-lg font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Ready to make your campus safer?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Join CampusSafe today and start building a safer, more responsive community.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/auth" search={{ tab: "signup" } as never}>Get started free</Link>
        </Button>
      </section>

      <PublicFooter />
    </div>
  );
}
