import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";


export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="group flex items-center gap-2 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
            <Shield className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight transition-colors group-hover:text-primary">CampusSafe</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/" className="relative text-muted-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:origin-bottom-left hover:after:scale-x-100" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground font-medium" }}>Home</Link>
          <Link to="/about" className="relative text-muted-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:origin-bottom-left hover:after:scale-x-100" activeProps={{ className: "text-foreground font-medium" }}>About</Link>
          <Link to="/contact" className="relative text-muted-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:origin-bottom-left hover:after:scale-x-100" activeProps={{ className: "text-foreground font-medium" }}>Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="transition-transform duration-200 hover:scale-105 hover:shadow-md">
            <Link to="/auth" search={{ tab: "signup" } as never}>Get started</Link>
          </Button>
        </div>

      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} CampusSafe. Built for safer campuses.</p>
        <div className="flex gap-4">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
