import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import sealedBackdrop from "@/assets/sealed-backdrop.jpg";
import heroBackdrop from "@/assets/hero-backdrop.jpg";
import waxSeal from "@/assets/wax-seal.png";
import paperTexture from "@/assets/paper-texture.jpg";

const COUPLE = { a: "Aarav", b: "Anaya" };
const WEDDING = new Date("2027-02-14T18:30:00+05:30");
const VENUE = "The Grand Pavilion";

const EVENTS = [
  { name: "Mehendi", when: "2027-02-12T16:00:00+05:30", place: "The Lotus Courtyard", note: "Shades of green & gold" },
  { name: "Sangeet", when: "2027-02-13T19:30:00+05:30", place: "The Moonlit Terrace", note: "Festive Indian" },
  { name: "Wedding", when: "2027-02-14T18:30:00+05:30", place: VENUE, note: "Peacock jewel tones" },
  { name: "Reception", when: "2027-02-15T20:00:00+05:30", place: "The Mirror Hall", note: "Black tie" },
];

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(iso)) + " IST";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aarav & Anaya — 14 February 2027" },
      { name: "description", content: "You are invited to the wedding of Aarav & Anaya at The Grand Pavilion, 14 February 2027." },
      { property: "og:title", content: "Aarav & Anaya — Wedding Invitation" },
      { property: "og:description", content: "Join us under the full moon at The Grand Pavilion, 14 February 2027." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

/* ---------- ornaments ---------- */
function Divider() {
  return (
    <svg viewBox="0 0 320 40" className="mx-auto my-6 h-8 w-64 text-accent" aria-hidden>
      <defs>
        <linearGradient id="gd" x1="0" x2="1"><stop offset="0" stopColor="var(--scratch-foil)" stopOpacity="0" /><stop offset=".5" stopColor="var(--accent)" /><stop offset="1" stopColor="var(--scratch-foil)" stopOpacity="0" /></linearGradient>
      </defs>
      <path d="M0 20H125M195 20H320" stroke="url(#gd)" strokeWidth="1" />
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M160 6c8 6 8 22 0 28c-8-6-8-22 0-28z" fill="color-mix(in oklab, var(--accent) 25%, transparent)" />
        <path d="M160 14c-10-6-22-2-28 6c6 8 18 12 28 6M160 14c10-6 22-2 28 6c-6 8-18 12-28 6" />
        <circle cx="160" cy="20" r="2.5" fill="currentColor" />
        <circle cx="122" cy="20" r="1.6" fill="currentColor" /><circle cx="198" cy="20" r="1.6" fill="currentColor" />
      </g>
    </svg>
  );
}

function Corner({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 80 80" className={`absolute h-14 w-14 text-accent sm:h-20 sm:w-20 ${className}`} style={style} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M4 76V20Q4 4 20 4h56" />
        <path d="M10 76V26Q10 10 26 10h50" strokeOpacity=".5" />
        <path d="M18 18c10 2 18 10 20 22c-12-2-20-10-20-22z" fill="color-mix(in oklab, var(--accent) 20%, transparent)" />
        <path d="M18 18c14 0 30 6 40 16M18 18c0 14 6 30 16 40" strokeOpacity=".7" />
        <circle cx="18" cy="18" r="3" fill="currentColor" />
        <circle cx="62" cy="36" r="1.5" fill="currentColor" /><circle cx="36" cy="62" r="1.5" fill="currentColor" />
      </g>
    </svg>
  );
}

function Frame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`card-frame mx-auto max-w-2xl px-6 py-14 sm:px-14 sm:py-20 ${dark ? "bg-surface text-paper-light" : ""}`}>
      <Corner className="left-2 top-2" />
      <Corner className="right-2 top-2" style={{ transform: "scaleX(-1)" }} />
      <Corner className="bottom-2 left-2" style={{ transform: "scaleY(-1)" }} />
      <Corner className="bottom-2 right-2" style={{ transform: "scale(-1)" }} />
      {children}
    </div>
  );
}

function Heading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="text-center">
      <p className="label text-accent">{kicker}</p>
      <div className="mx-auto mt-4 h-px w-16 bg-accent" />
      <h2 className="font-display mt-4 text-4xl font-medium italic sm:text-5xl">{title}</h2>
      <Divider />
    </div>
  );
}

function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (el.classList.add("in"), io.disconnect()), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className="reveal">{children}</div>;
}

/* ---------- countdown ---------- */
function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, WEDDING.getTime() - (now ?? WEDDING.getTime()));
  const parts = [
    ["Days", Math.floor(diff / 864e5)],
    ["Hours", Math.floor(diff / 36e5) % 24],
    ["Minutes", Math.floor(diff / 6e4) % 60],
    ["Seconds", Math.floor(diff / 1e3) % 60],
  ] as const;
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {parts.map(([l, v]) => (
        <div key={l} className="border border-accent/40 px-1 py-4 text-center">
          <div className="font-display gold-text text-3xl sm:text-5xl">{now === null ? "—" : String(v).padStart(2, "0")}</div>
          <div className="label mt-2 text-[0.55rem] text-accent-soft sm:text-[0.65rem]">{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- scratch to reveal ---------- */
function ScratchCard() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const foil = css.getPropertyValue("--scratch-foil").trim();
    const hi = css.getPropertyValue("--highlight").trim();
    const ink = css.getPropertyValue("--scratch-ink").trim();
    const r = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = r.width * dpr; c.height = r.height * dpr;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, foil); g.addColorStop(0.5, hi); g.addColorStop(1, foil);
    ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height);
    for (let i = 0; i < 900; i++) { ctx.fillStyle = `${ink}14`; ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 1, 1); }
    ctx.fillStyle = ink; ctx.globalAlpha = 0.7;
    ctx.font = `500 11px Jost, sans-serif`; ctx.textAlign = "center";
    ctx.fillText("SCRATCH TO REVEAL", r.width / 2, r.height / 2 + 4);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "destination-out";
    let down = false, count = 0;
    const scratch = (e: PointerEvent) => {
      if (!down) return;
      const b = c.getBoundingClientRect();
      ctx.beginPath(); ctx.arc(e.clientX - b.left, e.clientY - b.top, 22, 0, Math.PI * 2); ctx.fill();
      if (++count > 45) setDone(true);
    };
    const d = (e: PointerEvent) => { down = true; c.setPointerCapture(e.pointerId); scratch(e); };
    const u = () => (down = false);
    c.addEventListener("pointerdown", d); c.addEventListener("pointermove", scratch); c.addEventListener("pointerup", u);
    return () => { c.removeEventListener("pointerdown", d); c.removeEventListener("pointermove", scratch); c.removeEventListener("pointerup", u); };
  }, []);
  return (
    <div className="relative mx-auto aspect-[2/1] w-full max-w-sm overflow-hidden border border-accent/60">
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface text-paper-light">
        <p className="label text-accent-soft">Sunday</p>
        <p className="font-display gold-text mt-1 text-4xl sm:text-5xl">14 · 02 · 2027</p>
        <p className="label mt-2 text-accent-soft">6:30 PM IST</p>
      </div>
      <canvas
        ref={ref}
        aria-label="Scratch to reveal the date"
        className={`absolute inset-0 h-full w-full touch-none cursor-pointer transition-opacity duration-700 ${done ? "pointer-events-none opacity-0" : ""}`}
      />
    </div>
  );
}

/* ---------- opening ---------- */
function Opening({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const open = () => {
    if (opening) return;
    setOpening(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(onOpen, reduce ? 50 : 2800);
  };
  const half = (side: "left" | "right") => (
    <div
      className={`absolute inset-y-0 w-1/2 overflow-hidden ${side === "left" ? "left-0" : "right-0"} ${opening ? `curtain-open-${side}` : ""}`}
      style={{ transformOrigin: side === "left" ? "left top" : "right top" }}
    >
      <img
        src={sealedBackdrop}
        alt=""
        width={1536}
        height={1024}
        className="absolute top-0 h-full w-[200%] max-w-none object-cover"
        style={{ left: side === "left" ? 0 : "-100%" }}
      />
    </div>
  );
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background">
      {half("left")}
      {half("right")}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--background)_120%)]" />
      <button
        onClick={open}
        aria-label="Open the invitation"
        className={`seal-pulse absolute left-1/2 top-1/2 aspect-square w-[44vw] max-w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full ${opening ? "seal-breaking" : ""}`}
      >
        <img src={waxSeal} alt="" width={816} height={816} className="h-full w-full drop-shadow-[0_18px_24px_var(--scratch-ink)]" />
        <span className="font-display absolute inset-0 flex items-center justify-center text-[clamp(1.6rem,9vw,3.4rem)] italic text-highlight [text-shadow:0_1px_0_var(--scratch-foil),0_-1px_1px_var(--scratch-ink)]">
          A<span className="mx-0.5 text-[0.6em]">&</span>A
        </span>
      </button>
      <p className={`label absolute bottom-[8%] left-0 right-0 text-center text-accent-soft transition-opacity ${opening ? "opacity-0" : ""}`}>
        Tap the seal to open
      </p>
    </div>
  );
}

/* ---------- page ---------- */
function Invitation() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "" : "hidden";
  }, [open]);

  return (
    <div style={{ "--paper-img": `url(${paperTexture})` } as CSSProperties}>
      {!open && <Opening onOpen={() => setOpen(true)} />}

      {/* HERO */}
      <header className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background">
        <img src={heroBackdrop} alt="" width={1536} height={1024} className={`absolute inset-0 h-full w-full object-cover object-center ${open ? "kenburns" : ""}`} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--background)_45%,transparent),transparent_35%,transparent_60%,var(--background))]" />
        {open && (
          <div className="relative z-10 px-6 text-center text-paper-light">
            <p className="label rise text-accent-soft" style={{ animationDelay: ".2s" }}>Together with their families</p>
            <h1 className="font-display rise mt-6 text-[clamp(3.2rem,15vw,9rem)] font-medium leading-[0.9] [text-shadow:0_4px_30px_var(--background)]" style={{ animationDelay: ".5s" }}>
              <span className="gold-text shimmer block">{COUPLE.a}</span>
              <span className="block text-[0.4em] italic text-accent-soft">&</span>
              <span className="gold-text shimmer block">{COUPLE.b}</span>
            </h1>
            <div className="rise mx-auto mt-8 inline-block border border-accent/60 bg-background/55 px-8 py-4 backdrop-blur-sm" style={{ animationDelay: ".9s" }}>
              <p className="label text-accent-soft">Sunday</p>
              <p className="font-display mt-1 text-2xl">14 February 2027</p>
              <p className="label mt-1 text-accent">{VENUE}</p>
            </div>
          </div>
        )}
      </header>

      <main className="paper-ground space-y-20 px-4 py-20 sm:space-y-28 sm:px-8 sm:py-28">
        <Reveal>
          <Frame>
            <Heading kicker="An Invitation" title="Under the Full Moon" />
            <p className="font-display mx-auto max-w-md text-center text-xl leading-relaxed text-foreground/85 sm:text-2xl">
              With joy in our hearts and the blessings of our elders, we invite you to share in the celebration of our marriage — an evening of lamplight, lotus and moonrise on the palace terrace.
            </p>
          </Frame>
        </Reveal>

        <Reveal>
          <Frame dark>
            <Heading kicker="Save the Date" title="The Auspicious Hour" />
            <ScratchCard />
            <div className="mt-10"><Countdown /></div>
          </Frame>
        </Reveal>

        <Reveal>
          <Frame>
            <Heading kicker="The Celebrations" title="Four Evenings" />
            <ol className="space-y-10">
              {EVENTS.map((e, i) => (
                <li key={e.name} className="text-center">
                  <p className="label text-tint">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-display mt-2 text-3xl italic">{e.name}</h3>
                  <p className="mt-2 text-sm text-foreground/80">{fmtDate(e.when)} · {fmtTime(e.when)}</p>
                  <p className="label mt-2 text-muted-foreground">{e.place} — {e.note}</p>
                  {i < EVENTS.length - 1 && <div className="mx-auto mt-10 h-px w-24 bg-accent/50" />}
                </li>
              ))}
            </ol>
          </Frame>
        </Reveal>

        <Reveal>
          <Frame>
            <Heading kicker="The Venue" title={VENUE} />
            <p className="text-center text-foreground/80">Lake Palace Road, Udaipur, Rajasthan</p>
            <div className="mt-8 text-center">
              <a
                href="https://maps.google.com/?q=Udaipur+Lake+Palace"
                target="_blank"
                rel="noreferrer"
                className="label inline-block border border-accent bg-surface px-8 py-4 text-highlight transition hover:bg-tint"
              >
                Open in Maps
              </a>
            </div>
          </Frame>
        </Reveal>

        <Reveal>
          <Frame dark>
            <Heading kicker="Kindly Reply" title="Will You Join Us?" />
            <RSVP />
          </Frame>
        </Reveal>

        <footer className="pb-6 text-center">
          <Divider />
          <p className="font-display text-3xl italic text-tint">{COUPLE.a} & {COUPLE.b}</p>
          <p className="label mt-3 text-muted-foreground">14 · 02 · 2027</p>
        </footer>
      </main>
    </div>
  );
}

function RSVP() {
  const [sent, setSent] = useState<string | null>(null);
  if (sent) return <p className="font-display text-center text-2xl italic text-accent-soft">Thank you, {sent}. Your reply is received.</p>;
  return (
    <form
      className="mx-auto max-w-sm space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setSent(String(f.get("name") || "dear guest"));
      }}
    >
      <input name="name" required placeholder="Your name" className="w-full border-b border-accent/60 bg-transparent py-3 text-center font-display text-xl text-paper-light placeholder:text-accent-soft/50 focus:border-highlight focus:outline-none" />
      <select name="guests" className="w-full border-b border-accent/60 bg-surface py-3 text-center text-paper-light focus:outline-none">
        {[1, 2, 3, 4].map((n) => <option key={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3 pt-3">
        <button className="label border border-accent bg-accent py-4 text-scratch-ink">Joyfully accept</button>
        <button type="button" onClick={() => setSent("dear guest")} className="label border border-accent/60 py-4 text-accent-soft">Regretfully decline</button>
      </div>
    </form>
  );
}
