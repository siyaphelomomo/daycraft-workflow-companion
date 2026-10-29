import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Loader2, Sparkles } from "lucide-react";
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

  async function run() {
    const input = buildInput();
    if (!input) return toast.error("Please fill in the required fields.");
    setLoading(true);
    setOut("");
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
            <Button
              variant="outline"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => {
                navigator.clipboard.writeText(out);
                toast.success("Copied");
              }}
            >
              <Copy /> Copy
            </Button>
            <div className="prose-ai">
              <ReactMarkdown>{out}</ReactMarkdown>
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
