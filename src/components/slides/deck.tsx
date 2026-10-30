import type { ReactNode } from "react";
import { Bookmark, CalendarClock, CheckCheck, FileText, Mail, Sparkles, ArrowRight } from "lucide-react";
import cover from "@/assets/smartwork-deck.jpg";

export const slides = [
  { title: "SmartWork AI", notes: "Introduce SmartWork AI and yourself. This presentation covers three practical productivity tools: email generation, meeting summaries and task planning." },
  { title: "One workspace. Three everyday needs.", notes: "Explain the everyday challenge: turning ideas into clear communication, notes into decisions, and tasks into a realistic plan." },
  { title: "Smart Email Generator", notes: "Describe an email purpose, add a recipient and your name, then choose a tone. Review the draft before using it. The app generates text; it does not send emails." },
  { title: "Meeting Notes Summarizer", notes: "Paste notes or a transcript. The tool extracts a summary, key points, decisions and action items. Owners and deadlines are not invented when missing." },
  { title: "AI Task Planner", notes: "Add tasks and deadlines, choose daily or weekly planning, and set working hours. Review priorities, time allocations, breaks and carry-over tasks." },
  { title: "Keep your work within reach", notes: "Sign in and save a finished result. Open Saved to revisit, filter, copy or delete your emails, meeting summaries and plans." },
  { title: "Clear communication. Organized work.", notes: "Close by recapping the three tools. Invite the audience to try SmartWork AI with a real email, meeting note or task list. Take questions." },
];

export function SlideLayout({ children, index }: { children: ReactNode; index: number }) {
  return <div className={`slide-content ${index === 6 ? "slide-dark" : ""}`}>
    <div className="slide-top"><span>SMARTWORK AI</span><span>PRODUCT OVERVIEW</span></div>
    {children}
    <footer className="slide-footer"><span>Tila Mashego · SmartWork AI</span><span>{String(index + 1).padStart(2, "0")} / 07</span></footer>
  </div>;
}

function Point({ title, children }: { title: string; children: ReactNode }) {
  return <div className="slide-point"><CheckCheck /><div><h3 className="slide-body-lg">{title}</h3><p className="slide-body">{children}</p></div></div>;
}

export function DeckSlide({ index }: { index: number }) {
  const slide = slides[index];
  if (!slide) return null;
  return <SlideLayout index={index}>
    {index === 0 ? <>
      <img src={cover} alt="Laptop, notebook and clock on a bright workspace" className="slide-cover" width={1920} height={1088} />
      <div className="slide-cover-copy"><p className="slide-kicker">AI-POWERED PRODUCTIVITY</p><h1 className="slide-title-lg">SmartWork<br />AI<span className="slide-dot">.</span></h1><p className="slide-subtitle">Write clearly.<br />Capture what matters.<br />Plan with purpose.</p></div>
    </> : index === 1 ? <div className="slide-main"><p className="slide-kicker">THE EVERYDAY WORKFLOW</p><h2 className="slide-title">One workspace.<br />Three everyday needs.</h2><div className="slide-columns">
      {[{ Icon: Mail, title: "Communicate", text: "Turn an email idea into a professional draft." }, { Icon: FileText, title: "Capture", text: "Turn meeting notes into decisions and actions." }, { Icon: CalendarClock, title: "Organize", text: "Turn a task list into a structured schedule." }].map(({ Icon, title, text }, i) => <div className="slide-column" key={title}><span className="slide-number">0{i + 1}</span><Icon className="slide-big-icon" /><h3 className="slide-subtitle">{title}</h3><p className="slide-body">{text}</p></div>)}
    </div></div> : index === 2 ? <div className="slide-main"><p className="slide-kicker">01 / COMMUNICATE</p><h2 className="slide-title">Smart Email Generator</h2><div className="slide-two-col"><div className="slide-points"><Point title="Start with your purpose">Describe the message and add the recipient and your name.</Point><Point title="Choose your voice">Formal, friendly, persuasive, apologetic or concise.</Point><Point title="Review a complete draft">A subject, greeting, message and closing — ready to edit.</Point></div><div className="slide-document"><Mail className="slide-big-icon" /><p className="slide-kicker">EXAMPLE REQUEST</p><p className="slide-subtitle">“Ask my manager for Friday off for a family event.”</p><div className="slide-document-bottom"><span className="slide-body">Purpose + tone</span><ArrowRight /><span className="slide-body">Email draft</span></div></div></div></div> : index === 3 ? <div className="slide-main"><p className="slide-kicker">02 / CAPTURE</p><h2 className="slide-title">Meeting Notes Summarizer</h2><p className="slide-body-lg slide-intro">From raw notes to a clear record of what matters.</p><div className="slide-summary-grid">{[{ title: "Summary", text: "A concise overview of the meeting." }, { title: "Key points", text: "The main topics and important details." }, { title: "Decisions", text: "Agreements captured in the notes." }, { title: "Action items", text: "Tasks, owners and deadlines in a table." }].map((item, i) => <div key={item.title} className="slide-summary-item"><span className="slide-number">0{i + 1}</span><h3 className="slide-subtitle">{item.title}</h3><p className="slide-body">{item.text}</p></div>)}</div><p className="slide-caption slide-note">Missing owners or deadlines are marked “Not specified”.</p></div> : index === 4 ? <div className="slide-main"><p className="slide-kicker">03 / ORGANIZE</p><h2 className="slide-title">AI Task Planner</h2><div className="slide-two-col"><div className="slide-points"><Point title="Set the boundaries">List tasks and deadlines, choose daily or weekly, and set working hours.</Point><Point title="Focus on what matters">Priorities based on urgency and importance.</Point><Point title="Make time realistic">A timed schedule with breaks, reminders and carry-over tasks.</Point></div><div className="slide-document"><CalendarClock className="slide-big-icon" /><p className="slide-kicker">THE PLANNING FLOW</p><div className="slide-flow"><span>Tasks + deadlines</span><ArrowRight /><span>Priorities</span><ArrowRight /><span>Daily or weekly plan</span></div></div></div></div> : index === 5 ? <div className="slide-main"><p className="slide-kicker">SAVE & REVISIT</p><h2 className="slide-title">Keep your work<br />within reach.</h2><div className="slide-columns">{[{ Icon: Sparkles, title: "Generate", text: "Create an email, meeting summary or task plan." }, { Icon: Bookmark, title: "Save", text: "Sign in and save the result to your account." }, { Icon: CheckCheck, title: "Revisit", text: "Open Saved to filter, read, copy or delete your work." }].map(({ Icon, title, text }, i) => <div key={title} className="slide-column"><span className="slide-number">0{i + 1}</span><Icon className="slide-big-icon" /><h3 className="slide-subtitle">{title}</h3><p className="slide-body">{text}</p></div>)}</div></div> : <div className="slide-closing"><Sparkles className="slide-big-icon" /><p className="slide-kicker">SMARTWORK AI</p><h2 className="slide-title-lg">Clear communication.<br />Organized work.</h2><p className="slide-subtitle">Emails. Meeting summaries. Task plans.</p><div className="slide-closing-bottom"><span className="slide-body-lg">Thank you.</span><span className="slide-body">Questions & discussion</span></div></div>}
  </SlideLayout>;
}