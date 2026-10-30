import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved results — SmartWork AI" },
      { name: "description", content: "Revisit your saved emails, meeting summaries and task plans." },
      { property: "og:title", content: "Saved results — SmartWork AI" },
      { property: "og:description", content: "All your saved AI emails, summaries and plans in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SavedPage,
});

const LABELS: Record<string, string> = { email: "Email", summary: "Meeting summary", planner: "Task plan" };

function SavedPage() {
  const { user, ready } = useSession();
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["saved", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_items").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("saved_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["saved"] });
    },
  });

  const items = filter === "all" ? data : data.filter((i) => i.tool === filter);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Saved results</h1>
        {!ready ? null : !user ? (
          <p className="mt-4 text-muted-foreground">
            <Link to="/auth" className="text-primary underline">Sign in</Link> to see your saved results.
          </p>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              {["all", "email", "summary", "planner"].map((f) => (
                <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
                  {f === "all" ? "All" : LABELS[f]}
                </Button>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {isLoading && <p className="text-muted-foreground">Loading…</p>}
              {!isLoading && items.length === 0 && (
                <p className="text-muted-foreground">Nothing saved yet. <Link to="/" className="text-primary underline">Generate something</Link> and press Save.</p>
              )}
              {items.map((i) => (
                <div key={i.id} className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <button className="flex-1 text-left" onClick={() => setOpenId(openId === i.id ? null : i.id)}>
                      <div className="text-xs font-medium uppercase tracking-wide text-primary">{LABELS[i.tool]}</div>
                      <div className="font-semibold">{i.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleString()}</div>
                    </button>
                    <Button variant="ghost" size="icon" aria-label="Copy" onClick={() => { navigator.clipboard.writeText(i.output); toast.success("Copied"); }}><Copy /></Button>
                    <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => del.mutate(i.id)}><Trash2 /></Button>
                  </div>
                  {openId === i.id && (
                    <div className="prose-ai mt-4 border-t pt-4">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{i.output}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
