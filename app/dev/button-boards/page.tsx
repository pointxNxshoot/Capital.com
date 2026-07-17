"use client";

/* ============================================================================
   BUTTON & TAB REDESIGN BOARDS  —  design-choice showcase (Capital.com)
   ----------------------------------------------------------------------------
   A standalone iteration page. The buttons, filter pills, tabs and search bar
   from the live site are re-drawn here across five directions so you can pick a
   look. Nothing here is wired into the app — it's a moodboard you can click.

   Each board is lifted from one of the reference shots:
     A · Studio        → the "Styles" panel (segmented style controls, coral)
     B · Mono Menu     → the black/white folder menu (solid pill + badges)
     C · Soft Neutral  → the RevenueX sidebar (warm card active state)
     D · Warm Gradient → the "Boost your Online Presence" cards
     E · Glow Field    → the "Meet AI Mode" search bar

   The live site accent is blue-600 (#2563EB). These boards explore a coral
   accent per the references; board A ships an on-brand blue swap too.
   ========================================================================== */

import { useState } from "react";

const CORAL = "#FF6A3D";
const CORAL_SOFT = "#FFE9E1";
const BLUE = "#2563EB";
const INK = "#171717";
const PANEL = "#F3F4F6";
const BORDER = "#E5E7EB";
const MUTED = "#6B7280";

/* ---------------------------------------------------------------- scaffold */

function BoardShell({
  index,
  title,
  reference,
  blurb,
  children,
}: {
  index: string;
  title: string;
  reference: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-gray-200 py-16 first:border-t-0">
      <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-sm tabular-nums text-gray-400">{index}</span>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h2>
        <span className="text-xs uppercase tracking-wider text-gray-400">
          ref · {reference}
        </span>
      </div>
      <p className="mb-10 max-w-2xl text-sm leading-relaxed text-gray-500">{blurb}</p>
      {children}
    </section>
  );
}

function Swatch({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs uppercase tracking-wider text-gray-400">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

/* ================================================================ BOARD A · STUDIO */

function BoardStudio() {
  const [accent, setAccent] = useState(CORAL);
  const [round, setRound] = useState<"sharp" | "slightly" | "round">("round");
  const [styleTab, setStyleTab] = useState<"buttons" | "inputs">("buttons");

  const radius = round === "sharp" ? 4 : round === "slightly" ? 8 : 999;
  const btnRadius = round === "sharp" ? 6 : round === "slightly" ? 10 : 999;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
      <div className="space-y-9">
        <Swatch label="Tabs · segmented">
          <div className="inline-flex gap-1 bg-gray-100 p-1" style={{ borderRadius: 12 }}>
            {(["buttons", "inputs"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setStyleTab(t)}
                className="px-6 py-2 text-sm font-medium capitalize transition-all"
                style={{
                  borderRadius: 9,
                  background: styleTab === t ? "#fff" : "transparent",
                  color: styleTab === t ? INK : MUTED,
                  boxShadow:
                    styleTab === t
                      ? "0 1px 2px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.04)"
                      : "none",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </Swatch>

        <Swatch label="Roundness">
          <div className="inline-flex gap-1 bg-gray-100 p-1" style={{ borderRadius: 12 }}>
            {(["sharp", "slightly", "round"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRound(r)}
                className="px-5 py-2 text-sm font-medium capitalize transition-all"
                style={{
                  borderRadius: 9,
                  background: round === r ? "#fff" : "transparent",
                  color: round === r ? INK : MUTED,
                  boxShadow: round === r ? "0 1px 2px rgba(0,0,0,.08)" : "none",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </Swatch>

        <Swatch label="Buttons · filled / outline / shadowed">
          <button
            className="px-6 py-3 text-sm font-medium text-white transition-transform active:translate-y-px"
            style={{ background: accent, borderRadius: btnRadius }}
          >
            List a company
          </button>
          <button
            className="px-6 py-3 text-sm font-medium transition-colors"
            style={{
              borderRadius: btnRadius,
              color: accent,
              border: `1.5px solid ${accent}`,
              background: "transparent",
            }}
          >
            Outline
          </button>
          <button
            className="px-6 py-3 text-sm font-medium transition-all active:translate-y-px"
            style={{
              borderRadius: btnRadius,
              color: INK,
              background: "#fff",
              boxShadow: "0 1px 2px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.06)",
            }}
          >
            Shadowed
          </button>
        </Swatch>

        <Swatch label="Inputs · rest / error">
          <div
            className="flex items-center gap-2 bg-white px-4 py-3"
            style={{
              borderRadius: radius === 999 ? 12 : radius,
              boxShadow: "0 1px 2px rgba(0,0,0,.05), inset 0 0 0 1px " + BORDER,
              width: 260,
            }}
          >
            <SearchIcon />
            <span className="text-sm text-gray-400">Search companies…</span>
          </div>
          <div
            className="flex items-center gap-2 bg-white px-4 py-3"
            style={{
              borderRadius: radius === 999 ? 12 : radius,
              boxShadow: `0 0 0 1.5px ${accent}, 0 0 0 4px ${accent}22`,
              width: 260,
            }}
          >
            <SearchIcon color={accent} />
            <span className="text-sm" style={{ color: accent }}>
              Enter a valid company name
            </span>
          </div>
        </Swatch>
      </div>

      <aside
        className="h-fit space-y-4 p-6"
        style={{ background: PANEL, borderRadius: 14, minWidth: 200 }}
      >
        <span className="text-xs uppercase tracking-wider text-gray-400">Accent</span>
        <div className="flex gap-3">
          {[
            { c: CORAL, name: "Coral" },
            { c: BLUE, name: "Brand blue" },
          ].map(({ c, name }) => (
            <button key={c} onClick={() => setAccent(c)} className="flex flex-col items-center gap-2">
              <span
                className="size-10 transition-transform"
                style={{
                  background: c,
                  borderRadius: 10,
                  outline: accent === c ? `2px solid ${INK}` : "none",
                  outlineOffset: 2,
                }}
              />
              <span className="text-xs text-gray-500">{name}</span>
            </button>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-gray-500">
          Toggle the accent to re-tint the board. Blue is the current site button colour.
        </p>
      </aside>
    </div>
  );
}

/* ================================================================ BOARD B · MONO MENU */

function BoardMonoMenu() {
  const [active, setActive] = useState("listings");
  const items = [
    { id: "home", label: "Home" },
    { id: "saved", label: "Saved", badge: "2" },
    { id: "add", label: "Add listing", plus: true },
    { id: "advisors", label: "Advisors" },
    {
      id: "listings",
      label: "Listings",
      children: ["For sale", "Under offer", "Sold"],
    },
    { id: "account", label: "Account" },
  ];

  return (
    <div
      className="max-w-sm space-y-1 p-3"
      style={{ background: "#fff", borderRadius: 18, border: `1px solid ${BORDER}` }}
    >
      {items.map((it) => {
        const on = active === it.id;
        return (
          <div key={it.id}>
            <button
              onClick={() => setActive(it.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-all"
              style={{
                borderRadius: 999,
                background: on ? INK : "transparent",
                color: on ? "#fff" : INK,
              }}
            >
              <span className="grid size-5 place-items-center opacity-70">
                <MenuIcon />
              </span>
              <span className="flex-1 text-sm font-medium">{it.label}</span>
              {it.badge && (
                <span
                  className="grid size-6 place-items-center text-xs font-semibold"
                  style={{
                    borderRadius: 999,
                    background: on ? "#fff" : INK,
                    color: on ? INK : "#fff",
                  }}
                >
                  {it.badge}
                </span>
              )}
              {it.plus && <span className="text-lg leading-none opacity-60">+</span>}
              {it.children && (
                <span className="text-lg leading-none opacity-60">{on ? "−" : "+"}</span>
              )}
            </button>

            {it.children && on && (
              <div className="relative ml-7 mt-1 space-y-1 pl-4">
                <span className="absolute left-0 top-1 bottom-3 w-px" style={{ background: BORDER }} />
                {it.children.map((c, i) => (
                  <button
                    key={c}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
                    style={{
                      borderRadius: 12,
                      background: i === 0 ? PANEL : "transparent",
                      color: i === 0 ? INK : MUTED,
                      fontWeight: i === 0 ? 500 : 400,
                    }}
                  >
                    <FolderIcon />
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================ BOARD C · SOFT NEUTRAL */

function BoardSoftNeutral() {
  const [active, setActive] = useState("browse");
  const groups = [
    {
      label: "Marketplace",
      items: [
        { id: "browse", label: "Browse companies" },
        { id: "map", label: "Map view" },
        { id: "saved", label: "Saved", badge: "2" },
      ],
    },
    {
      label: "Selling",
      items: [
        { id: "mine", label: "My listings" },
        { id: "advisors", label: "Find an advisor" },
      ],
    },
  ];

  return (
    <div
      className="max-w-xs space-y-6 p-4"
      style={{
        background: "linear-gradient(180deg,#FBFBFA,#F3F4F6)",
        borderRadius: 20,
        border: `1px solid ${BORDER}`,
      }}
    >
      {groups.map((g) => (
        <div key={g.label} className="space-y-1.5">
          <span className="px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            {g.label}
          </span>
          {g.items.map((it) => {
            const on = active === it.id;
            return (
              <button
                key={it.id}
                onClick={() => setActive(it.id)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-all"
                style={{
                  borderRadius: 12,
                  background: on ? "#fff" : "transparent",
                  boxShadow: on ? "0 1px 2px rgba(0,0,0,.05), 0 4px 10px rgba(0,0,0,.04)" : "none",
                  color: on ? INK : MUTED,
                }}
              >
                <span className="grid size-6 place-items-center" style={{ color: on ? INK : MUTED }}>
                  <GridIcon />
                </span>
                <span className="flex-1 text-sm font-medium">{it.label}</span>
                {it.badge && (
                  <span
                    className="grid size-5 place-items-center text-xs font-semibold text-white"
                    style={{ borderRadius: 999, background: INK }}
                  >
                    {it.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ================================================================ BOARD D · WARM GRADIENT */

function BoardWarmGradient() {
  const features = ["Verified listings", "Direct to owners", "Free to browse"];
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div
        className="flex flex-col justify-between gap-8 p-8"
        style={{
          borderRadius: 22,
          background: "linear-gradient(135deg,#FFF3EC 0%,#FFD9C4 45%,#FF6A3D 130%)",
        }}
      >
        <div>
          <h3 className="text-3xl font-semibold tracking-tight text-gray-900">
            Sell your company
          </h3>
          <p className="mt-2 max-w-xs text-sm text-[#7a4a33]">
            Reach buyers already searching the marketplace for businesses like yours.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="px-8 py-3.5 text-sm font-medium text-white transition-transform active:translate-y-px"
            style={{ borderRadius: 999, background: INK }}
          >
            List your company
          </button>
          <button
            className="px-8 py-3.5 text-sm font-medium transition-colors"
            style={{
              borderRadius: 999,
              background: "rgba(255,255,255,.7)",
              color: INK,
              backdropFilter: "blur(4px)",
            }}
          >
            How it works
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3">
        <span className="mb-1 text-xs uppercase tracking-wider text-gray-400">Feature pills</span>
        {features.map((f) => (
          <div
            key={f}
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderRadius: 999, background: CORAL_SOFT }}
          >
            <span
              className="grid size-7 place-items-center text-white"
              style={{ borderRadius: 999, background: CORAL }}
            >
              <CheckIcon />
            </span>
            <span className="text-sm font-medium" style={{ color: "#8a3f21" }}>
              {f}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================ BOARD E · GLOW FIELD */

function BoardGlowField() {
  return (
    <div className="max-w-2xl">
      <div className="relative" style={{ borderRadius: 20 }}>
        <div
          className="absolute -inset-[2px] opacity-80 blur-[6px]"
          style={{
            borderRadius: 22,
            background: "conic-gradient(from 180deg,#5B8DEF,#FF6A3D,#E89370,#5B8DEF)",
          }}
        />
        <div className="relative flex items-center gap-3 bg-white px-5 py-4" style={{ borderRadius: 20 }}>
          <SearchIcon color={MUTED} />
          <input
            placeholder="Search companies, industries or locations…"
            className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            className="grid size-10 place-items-center text-white transition-transform active:scale-95"
            style={{ borderRadius: 999, background: "linear-gradient(135deg,#5B8DEF,#2563EB)" }}
            aria-label="Search"
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Cafés in Sydney", "Tech under $2M", "Recently listed"].map((s) => (
          <button
            key={s}
            className="px-4 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100"
            style={{ borderRadius: 999, border: `1px solid ${BORDER}` }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================================================================ BOARD F · WARM NEUTRAL
   Soft Neutral's calm layout warmed with the gradient's coral. Active row lifts
   onto a card with a soft coral wash + gradient accent bar; primary is a gradient pill.
   ======================================================================== */

function BoardWarmNeutral() {
  const [active, setActive] = useState("browse");
  const [tab, setTab] = useState("overview");
  const groups = [
    {
      label: "Marketplace",
      items: [
        { id: "browse", label: "Browse companies" },
        { id: "map", label: "Map view" },
        { id: "saved", label: "Saved", badge: "4" },
      ],
    },
    {
      label: "Activity",
      items: [
        { id: "messages", label: "Messages", badge: "2" },
        { id: "offers", label: "Offers" },
      ],
    },
  ];
  const tabs = ["overview", "financials", "documents"];

  return (
    <div className="grid gap-9 lg:grid-cols-[300px_1fr]">
      <div
        className="flex flex-col gap-6 p-4"
        style={{
          background: "linear-gradient(180deg,#FFFFFF,#F3F4F6)",
          borderRadius: 20,
          border: `1px solid ${BORDER}`,
        }}
      >
        {groups.map((g) => (
          <div key={g.label} className="space-y-1.5">
            <span className="px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              {g.label}
            </span>
            {g.items.map((it) => {
              const on = active === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(it.id)}
                  className="relative flex w-full items-center gap-3 overflow-hidden px-3 py-2.5 text-left transition-all"
                  style={{
                    borderRadius: 12,
                    color: on ? INK : MUTED,
                    background: on
                      ? "linear-gradient(135deg,rgba(255,106,61,.16),rgba(255,255,255,0) 70%),#fff"
                      : "transparent",
                    boxShadow: on
                      ? "0 1px 2px rgba(0,0,0,.05), 0 6px 16px rgba(255,106,61,.14)"
                      : "none",
                  }}
                >
                  {on && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded"
                      style={{ background: "linear-gradient(180deg,#FF8A5B,#FF6A3D)" }}
                    />
                  )}
                  <span className="grid size-6 place-items-center" style={{ color: on ? CORAL : MUTED }}>
                    <GridIcon />
                  </span>
                  <span className="flex-1 text-sm font-medium">{it.label}</span>
                  {it.badge && (
                    <span
                      className="grid size-5 place-items-center text-xs font-semibold text-white"
                      style={{ borderRadius: 999, background: INK }}
                    >
                      {it.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-col justify-center gap-8">
        <Swatch label="Buttons · gradient / soft / quiet">
          <button
            className="px-7 py-3 text-sm font-medium text-white transition-transform active:translate-y-px"
            style={{
              borderRadius: 999,
              background: "linear-gradient(135deg,#FF8A5B,#FF6A3D)",
              boxShadow: "0 6px 16px rgba(255,106,61,.28)",
            }}
          >
            List a company
          </button>
          <button
            className="px-7 py-3 text-sm font-medium transition-transform active:translate-y-px"
            style={{
              borderRadius: 999,
              color: INK,
              background: "#fff",
              boxShadow: "0 1px 2px rgba(0,0,0,.05), 0 4px 12px rgba(0,0,0,.06)",
            }}
          >
            Save
          </button>
          <button
            className="px-7 py-3 text-sm font-medium"
            style={{ borderRadius: 999, color: MUTED, background: PANEL }}
          >
            Cancel
          </button>
        </Swatch>

        <Swatch label="Tabs · gradient pill">
          <div className="inline-flex gap-1 p-1" style={{ borderRadius: 999, background: PANEL }}>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-2 text-sm font-medium capitalize transition-all"
                style={{
                  borderRadius: 999,
                  color: tab === t ? "#fff" : MUTED,
                  background: tab === t ? "linear-gradient(135deg,#FF8A5B,#FF6A3D)" : "transparent",
                  boxShadow: tab === t ? "0 4px 12px rgba(255,106,61,.26)" : "none",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </Swatch>

        <Swatch label="Feature pills">
          {["Verified listings", "Direct to owners"].map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderRadius: 999, background: CORAL_SOFT }}
            >
              <span
                className="grid size-7 place-items-center text-white"
                style={{ borderRadius: 999, background: CORAL }}
              >
                <CheckIcon />
              </span>
              <span className="text-sm font-medium" style={{ color: "#8a3f21" }}>
                {f}
              </span>
            </div>
          ))}
        </Swatch>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- icons */

function SearchIcon({ color = "#9CA3AF" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" strokeLinecap="round" />
    </svg>
  );
}
function ArrowUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 8h16M4 12h16M4 16h10" strokeLinecap="round" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

/* ---------------------------------------------------------------- page */

export default function ButtonBoardsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-8 py-20 lg:px-12">
      <header className="mb-4">
        <p className="mb-4 text-sm uppercase tracking-wider text-gray-400">
          Development preview · design choices
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
          Button &amp; tab boards.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
          Six directions for the buttons, tabs, filter pills and search across Capital.com,
          each re-drawn from a reference shot. Everything is clickable but nothing is wired in —
          pick the boards you like and we&apos;ll promote those styles into the real components.
        </p>
      </header>

      <BoardShell
        index="A"
        title="Studio"
        reference="Styles panel"
        blurb="Segmented style controls with a coral accent and soft float. The fullest kit: a filled / outline / shadowed button trio, a segmented tab, a roundness picker, and matching rest / error inputs. Flip the accent chip to preview it in the current brand blue."
      >
        <BoardStudio />
      </BoardShell>

      <BoardShell
        index="B"
        title="Mono Menu"
        reference="Black & white folder menu"
        blurb="Pure ink-on-white. The active row is a solid black pill, counts sit in inverted badges, and expanding a row reveals nested children on a hairline connector. Best for the account / listings side nav."
      >
        <BoardMonoMenu />
      </BoardShell>

      <BoardShell
        index="C"
        title="Soft Neutral"
        reference="RevenueX sidebar"
        blurb="Warm, low-contrast sidebar where the selected item lifts onto a white card with a faint shadow rather than a hard fill. Grouped section labels keep long nav lists legible."
      >
        <BoardSoftNeutral />
      </BoardShell>

      <BoardShell
        index="D"
        title="Warm Gradient"
        reference="Boost your Online Presence"
        blurb="For marketing surfaces: an orange gradient panel with pill CTAs and soft coral feature chips. Keeps the primary action ink-black for contrast against the warm field."
      >
        <BoardWarmGradient />
      </BoardShell>

      <BoardShell
        index="E"
        title="Glow Field"
        reference="Meet AI Mode"
        blurb="A search field wrapped in a soft conic-gradient glow, with a gradient submit button and quick-search chips underneath. For the main marketplace search."
      >
        <BoardGlowField />
      </BoardShell>

      <BoardShell
        index="F"
        title="Warm Neutral"
        reference="Soft Neutral × Warm Gradient"
        blurb="The combination to build on: Soft Neutral's calm, grouped, low-contrast layout — warmed with the gradient's coral. The selected row lifts onto a card with a soft coral wash, a gradient accent bar and a coral icon. The primary button becomes a warm gradient pill; secondary stays quiet and neutral."
      >
        <BoardWarmNeutral />
      </BoardShell>
    </div>
  );
}
