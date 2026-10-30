import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bookmark, Check, Copy, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AiTool({
  tool,
  buildInput,
  children,
  cta,
}: {
  tool: string;
  buildInput: () => string | null;
  children: ReactNode;
  cta: string;
}) {
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastInput, setLastInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  async function save() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      toast("Sign in to save your results.", { action: { label: "Sign in", onClick: () => navigate({ to: "/auth" }) } });
      return;
    }
    setSaving(true);
    const firstLine = out.split("\n").find((l) => l.trim()) ?? "Untitled";
    const title = firstLine.replace(/[#*_`>|]/g, "").replace(/^\s*Subject:\s*/i, "").trim().slice(0, 100) || "Untitled";
    const { error } = await supabase.from("saved_items").insert({ tool, title, input: lastInput, output: out });
    setSaving(false);
    if (error) { toast.error("Couldn't save. Please try again."); return; }
    setSaved(true);
    toast.success("Saved", { action: { label: "View", onClick: () => navigate({ to: "/saved" }) } });
  }

  async function run() {
    const input = buildInput();
    if (!input) {
      toast.error("Please fill in the required fields.");
      return;
    }
    setLoading(true);
    setOut("");
    setSaved(false);
    setLastInput(input);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tool, input }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        setOut(text);
      }
      if (!text.trim()) throw new Error("The AI didn't return a result. Please try again later.");
    } catch (e) {
      toast.error(e instanceof Error && e.message ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
        {children}
        <Button onClick={run} disabled={loading} className="w-full" size="lg">
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />} {cta}
        </Button>
      </div>
      <div className="rounded-2xl border bg-card p-5 shadow-sm min-h-[320px] relative">
        {out ? (
          <>
            <div className="absolute right-4 top-4 flex gap-2">
              {!loading && (
                <Button variant="outline" size="sm" onClick={save} disabled={saving || saved}>
                  {saved ? <Check /> : <Bookmark />} {saved ? "Saved" : "Save"}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(out);
                  toast.success("Copied");
                }}
              >
                <Copy /> Copy
              </Button>
            </div>
            <div className="prose-ai pt-10">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{out}</ReactMarkdown>
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-muted-foreground">
            <Sparkles className="mb-3 size-8 text-primary" />
            <p>{loading ? "Thinking…" : "Your result will appear here."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
