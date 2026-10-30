import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Grid2X2, Maximize, StickyNote, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { slides, DeckSlide } from "@/components/slides/deck";
import { ScaledSlide } from "@/components/slides/ScaledSlide";

export const Route = createFileRoute("/slides")({
  validateSearch: (search: Record<string, unknown>) => ({ slide: Math.min(slides.length, Math.max(1, Number(search.slide) || 1)), print: search.print === true || search.print === "true" }),
  head: () => ({ meta: [
    { title: "SmartWork AI — Product Presentation" },
    { name: "description", content: "Explore SmartWork AI’s email generator, meeting notes summarizer and task planner in a seven-slide presentation." },
    { property: "og:title", content: "SmartWork AI — Product Presentation" },
    { property: "og:description", content: "Clear communication and organized work: discover the three SmartWork AI productivity tools." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: SlidesPage,
});

function SlidesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const index = search.slide - 1;
  const [grid, setGrid] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [notes, setNotes] = useState(slides.map((s) => s.notes));
  const [loaded, setLoaded] = useState(false);
  const touchStart = useRef<number | null>(null);
  const current = slides[index];
  useEffect(() => {
    try { const stored = JSON.parse(localStorage.getItem("smartwork-slide-notes") || "null"); if (Array.isArray(stored) && stored.length === slides.length && stored.every((n) => typeof n === "string")) setNotes(stored); } catch { /* Keep the deck's default notes. */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) { try { localStorage.setItem("smartwork-slide-notes", JSON.stringify(notes)); } catch { /* Device storage may be unavailable. */ } } }, [notes, loaded]);
  useEffect(() => { document.title = `${index + 1}/${slides.length} — ${current?.title ?? "SmartWork AI"}`; }, [index, current]);
  function go(next: number) { navigate({ search: { ...search, slide: Math.max(1, Math.min(slides.length, next + 1)) }, replace: true }); }
  async function present() { try { await document.documentElement.requestFullscreen(); setPresenting(true); setGrid(false); } catch { setPresenting(true); setGrid(false); } }
  function exit() { setPresenting(false); if (document.fullscreenElement) void document.exitFullscreen(); }
  useEffect(() => {
    const fullscreen = () => { if (!document.fullscreenElement) setPresenting(false); };
    document.addEventListener("fullscreenchange", fullscreen);
    const keyboard = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("textarea,input")) return;
      if (["ArrowRight", "ArrowLeft", " ", "F5"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowRight" || e.key === " ") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "Escape") { exit(); setGrid(false); }
      if (e.key.toLowerCase() === "g") setGrid((v) => !v);
      if (e.key === "F5") void present();
    };
    window.addEventListener("keydown", keyboard);
    return () => { document.removeEventListener("fullscreenchange", fullscreen); window.removeEventListener("keydown", keyboard); };
  });
  if (search.print) return <div className="print-deck"><div className="print-actions"><Button onClick={() => window.print()}><Download />Save as PDF</Button><Button asChild variant="outline"><Link to="/slides" search={{ slide: search.slide, print: false }}>Back to slides</Link></Button></div>{slides.map((s, i) => <div key={s.title} className="print-slide"><DeckSlide index={i} /></div>)}</div>;
  return <div className={`deck-editor ${presenting ? "deck-presenting" : ""}`}>
    {!presenting && <header className="deck-toolbar"><Button asChild variant="ghost" size="icon" aria-label="Back to dashboard" title="Back to dashboard"><Link to="/"><ArrowLeft /></Link></Button><div className="deck-toolbar-title"><strong className="font-display">SmartWork AI</strong><span className="text-xs text-muted-foreground">Product presentation</span></div><div className="ml-auto flex gap-1"><Button variant={grid ? "secondary" : "ghost"} size="icon" aria-label="Slide overview" title="Slide overview" onClick={() => setGrid(!grid)}><Grid2X2 /></Button><Button variant={notesOpen ? "secondary" : "ghost"} size="icon" aria-label="Presenter notes" title="Presenter notes" onClick={() => setNotesOpen(!notesOpen)}><StickyNote /></Button><Button asChild variant="ghost" size="icon" aria-label="Export PDF" title="Export PDF"><Link to="/slides" search={{ slide: search.slide, print: true }}><Download /></Link></Button><Button onClick={present}><Maximize /><span className="hidden sm:inline">Present</span></Button></div></header>}
    <div className="deck-workspace">
      {!presenting && !grid && <aside className="deck-sidebar">{slides.map((s, i) => <Button key={s.title} variant="ghost" className={`deck-thumbnail ${index === i ? "selected" : ""}`} onClick={() => go(i)} aria-label={`Slide ${i + 1}: ${s.title}`}><div className="thumbnail-canvas"><ScaledSlide index={i} /></div><span>{String(i + 1).padStart(2, "0")} · {s.title}</span></Button>)}</aside>}
      <main className="deck-main">
        {grid ? <div className="deck-grid">{slides.map((s, i) => <Button key={s.title} variant="ghost" className="deck-grid-item" onClick={() => { go(i); setGrid(false); }} aria-label={`Open slide ${i + 1}`}><div className="thumbnail-canvas"><ScaledSlide index={i} /></div><span>{i + 1}. {s.title}</span></Button>)}</div> : <div className="deck-stage" onTouchStart={(e) => { touchStart.current = e.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(e) => { const end = e.changedTouches[0]?.clientX; if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 50) go(index + (end < touchStart.current ? 1 : -1)); touchStart.current = null; }}><ScaledSlide index={index} /></div>}
        {!grid && <div className="deck-navigation"><Button variant="ghost" size="icon" disabled={index === 0} aria-label="Previous slide" onClick={() => go(index - 1)}><ChevronLeft /></Button><span>{index + 1} / {slides.length}</span><Button variant="ghost" size="icon" disabled={index === slides.length - 1} aria-label="Next slide" onClick={() => go(index + 1)}><ChevronRight /></Button>{presenting && <Button variant="ghost" size="icon" aria-label="Exit presentation" onClick={exit}><X /></Button>}</div>}
        {notesOpen && !presenting && <section className="deck-notes"><label htmlFor="presenter-notes" className="text-sm font-medium">Presenter notes</label><Textarea id="presenter-notes" value={notes[index] ?? ""} onChange={(e) => setNotes((old) => old.map((note, i) => i === index ? e.target.value : note))} rows={3} /></section>}
      </main>
    </div>
  </div>;
}