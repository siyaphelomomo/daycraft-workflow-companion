import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, FileText, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiTool } from "@/components/AiTool";
import { AppHeader } from "@/components/AppHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartWork AI — Emails, Meeting Summaries & Task Plans" },
      { name: "description", content: "Write professional emails, summarize meeting notes and plan your day or week with AI." },
      { property: "og:title", content: "SmartWork AI" },
      { property: "og:description", content: "AI-powered emails, meeting summaries and task planning in one simple dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function EmailTab() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState("formal");
  return (
    <AiTool
      tool="email"
      cta="Generate email"
      buildInput={() =>
        purpose.trim()
          ? `Tone: ${tone}\nRecipient: ${recipient || "unspecified"}\nSender: ${sender || "unspecified"}\nWhat the email is about:\n${purpose}`
          : null
      }
    >
      <Field label="What is the email about? *">
        <Textarea rows={6} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Ask my manager for Friday off to attend a family event" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Recipient">
          <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Mr. Dlamini" />
        </Field>
        <Field label="Your name">
          <Input value={sender} onChange={(e) => setSender(e.target.value)} placeholder="e.g. Tila" />
        </Field>
      </div>
      <Field label="Tone">
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["formal", "friendly", "persuasive", "apologetic", "concise"].map((t) => (
              <SelectItem key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </AiTool>
  );
}

function SummaryTab() {
  const [notes, setNotes] = useState("");
  return (
    <AiTool tool="summary" cta="Summarize notes" buildInput={() => (notes.trim() ? `Meeting notes:\n${notes}` : null)}>
      <Field label="Paste your meeting notes *">
        <Textarea rows={14} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste raw notes or a transcript. Include names and dates so action items can be assigned." />
      </Field>
    </AiTool>
  );
}

function PlannerTab() {
  const [tasks, setTasks] = useState("");
  const [period, setPeriod] = useState("daily");
  const [hours, setHours] = useState("08:00 - 17:00");
  return (
    <AiTool
      tool="planner"
      cta="Build my plan"
      buildInput={() =>
        tasks.trim() ? `Plan type: ${period}\nWorking hours: ${hours}\nToday: ${new Date().toDateString()}\nTasks (with deadlines/notes):\n${tasks}` : null
      }
    >
      <Field label="Your tasks *">
        <Textarea rows={8} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"One per line, e.g.\nFinish sales report – due Friday\nReply to client emails\nStudy for exam – 2 hours"} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Plan type">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Working hours">
          <Input value={hours} onChange={(e) => setHours(e.target.value)} />
        </Field>
      </div>
    </AiTool>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <h1 className="font-display text-3xl font-bold md:text-5xl">Work smarter, not longer.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">
          Write emails, summarize meetings and plan your time — just type and let AI do the organizing.
        </p>
        <Tabs defaultValue="email" className="mt-8">
          <TabsList className="mb-6 grid h-auto w-full grid-cols-3 md:w-fit">
            <TabsTrigger value="email" className="gap-2 py-2"><Mail className="size-4" /><span className="hidden sm:inline">Email Generator</span><span className="sm:hidden">Email</span></TabsTrigger>
            <TabsTrigger value="summary" className="gap-2 py-2"><FileText className="size-4" /><span className="hidden sm:inline">Notes Summarizer</span><span className="sm:hidden">Notes</span></TabsTrigger>
            <TabsTrigger value="planner" className="gap-2 py-2"><CalendarClock className="size-4" /><span className="hidden sm:inline">Task Planner</span><span className="sm:hidden">Plan</span></TabsTrigger>
          </TabsList>
          <TabsContent value="email"><EmailTab /></TabsContent>
          <TabsContent value="summary"><SummaryTab /></TabsContent>
          <TabsContent value="planner"><PlannerTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
