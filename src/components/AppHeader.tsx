import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, LogOut, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

export function AppHeader() {
  const { user, ready } = useSession();
  const qc = useQueryClient();
  const navigate = useNavigate();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }
  return (
    <header className="border-b bg-card/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">S</div>
          <span className="font-display text-xl font-bold">SmartWork AI</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/slides" search={{ slide: 1, print: false }}><Presentation /> <span className="hidden sm:inline">Slides</span></Link></Button>
          {ready && user ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/saved"><Bookmark /> Saved</Link></Button>
              <Button variant="outline" size="sm" onClick={signOut}><LogOut /> <span className="hidden sm:inline">Sign out</span></Button>
            </>
          ) : ready ? (
            <Button asChild size="sm"><Link to="/auth">Sign in</Link></Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
