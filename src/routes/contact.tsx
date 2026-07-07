import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PublicHeader, PublicFooter } from "@/components/layout/PublicHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CampusSafe" },
      { name: "description", content: "Get in touch with the CampusSafe team." },
      { property: "og:title", content: "Contact CampusSafe" },
      { property: "og:description", content: "Reach the CampusSafe team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
          <p className="mt-3 text-muted-foreground">
            Questions, feedback, or interested in bringing CampusSafe to your campus?
            We'd love to hear from you.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> hello@campussafe.app</div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> +1 (555) 010-2024</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> Campus Innovation Hub, Block A</div>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSending(true);
            setTimeout(() => {
              setSending(false);
              toast.success("Message sent — we'll be in touch soon.");
              (e.target as HTMLFormElement).reset();
            }, 600);
          }}
          className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required maxLength={100} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required maxLength={255} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="msg">Message</Label>
            <Textarea id="msg" required maxLength={1000} rows={5} />
          </div>
          <Button type="submit" disabled={sending} className="w-full">
            {sending ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
      <PublicFooter />
    </div>
  );
}
