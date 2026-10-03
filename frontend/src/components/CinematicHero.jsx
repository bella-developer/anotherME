import React, { useMemo, useState } from "react";

/*
  Replace this with your actual hero image.
  Example:
  const HERO_IMAGE = "/images/vault/confession.webp";
*/

const HERO_IMAGE = "/images/vault/confession.webp";

const VAULT_ITEMS = [
  {
    id: "01",
    title: "Memory",
    icon: "brain",
    tone: "rose",
    position: "note-1",
    rotate: "-3deg",
  },
  {
    id: "02",
    title: "Confession",
    icon: "eye",
    tone: "amber",
    position: "note-2",
    rotate: "2.5deg",
  },
  {
    id: "03",
    title: "Understanding",
    icon: "diamond",
    tone: "violet",
    position: "note-3",
    rotate: "-2deg",
  },
  {
    id: "04",
    title: "Imagination",
    icon: "star",
    tone: "olive",
    position: "note-4",
    rotate: "2deg",
  },
  {
    id: "05",
    title: "Vibes",
    icon: "wave",
    tone: "ochre",
    position: "note-5",
    rotate: "-1.5deg",
  },
  {
    id: "06",
    title: "Questioning",
    icon: "target",
    tone: "clay",
    position: "note-6",
    rotate: "-3.5deg",
  },
  {
    id: "07",
    title: "Truth",
    icon: "compass",
    tone: "wine",
    position: "note-7",
    rotate: "2deg",
  },
];

const TONES = {
  rose: {
    border: "border-[#693c3b]",
    text: "text-[#d9aaa0]",
    pin: "bg-[#c95d68]",
    glow: "shadow-[0_0_20px_rgba(175,72,69,.12)]",
  },
  amber: {
    border: "border-[#72563b]",
    text: "text-[#d1ad7b]",
    pin: "bg-[#d29a55]",
    glow: "shadow-[0_0_20px_rgba(173,118,57,.10)]",
  },
  violet: {
    border: "border-[#4e465d]",
    text: "text-[#b6a4ce]",
    pin: "bg-[#9b78c5]",
    glow: "shadow-[0_0_20px_rgba(119,91,154,.10)]",
  },
  olive: {
    border: "border-[#4c5137]",
    text: "text-[#aeb18a]",
    pin: "bg-[#789b61]",
    glow: "shadow-[0_0_20px_rgba(91,111,59,.10)]",
  },
  ochre: {
    border: "border-[#65502d]",
    text: "text-[#c8a76b]",
    pin: "bg-[#c99539]",
    glow: "shadow-[0_0_20px_rgba(155,108,35,.10)]",
  },
  clay: {
    border: "border-[#5f4740]",
    text: "text-[#c9a399]",
    pin: "bg-[#bd7169]",
    glow: "shadow-[0_0_20px_rgba(145,75,69,.10)]",
  },
  wine: {
    border: "border-[#633738]",
    text: "text-[#d39b94]",
    pin: "bg-[#bd5960]",
    glow: "shadow-[0_0_20px_rgba(153,58,60,.12)]",
  },
};

function Icon({ type }) {
  const common =
    "h-[17px] w-[17px] fill-none stroke-current stroke-[1.2]";

  switch (type) {
    case "brain":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.5A3 3 0 0 0 4 11.3a3.2 3.2 0 0 0 2.2 3A3.5 3.5 0 0 0 9.5 19" />
          <path d="M14.5 4.5A3.5 3.5 0 0 1 18 8v.5a3 3 0 0 1 2 2.8 3.2 3.2 0 0 1-2.2 3 3.5 3.5 0 0 1-3.3 4.7" />
          <path d="M9.5 4.5v15M14.5 4.5v15M6 9h3.5M14.5 9H18M6.5 14h3M14.5 14h3" />
        </svg>
      );

    case "eye":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );

    case "diamond":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="m12 3 7 9-7 9-7-9 7-9Z" />
          <path d="m12 7 3.5 5-3.5 5-3.5-5L12 7Z" />
        </svg>
      );

    case "star":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="m12 3 1.8 5.4L19 10l-5.2 1.7L12 17l-1.8-5.3L5 10l5.2-1.6L12 3Z" />
          <path d="M19 16v5M16.5 18.5h5" />
        </svg>
      );

    case "wave":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M3 12h2.5l2-5 3.5 10 3.5-10 2 5H21" />
        </svg>
      );

    case "target":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M22 12h-3M12 22v-3M2 12h3" />
        </svg>
      );

    case "compass":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <circle cx="12" cy="12" r="8" />
          <path d="m15.5 8.5-2.2 5.2-4.8 2 2.2-5.2 4.8-2Z" />
        </svg>
      );

    default:
      return null;
  }
}

function StickyNote({ item, active, onClick }) {
  const tone = TONES[item.tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${item.title}`}
      className={`
        vault-note
        ${item.position}
        group
        absolute
        z-10
        h-[82px]
        w-[142px]
        cursor-pointer
        rounded-[5px]
        border
        ${tone.border}
        bg-[#211b18]/95
        text-left
        backdrop-blur-[2px]
        transition-all
        duration-500
        ease-out
        hover:z-30
        hover:-translate-y-1
        hover:brightness-110
        ${tone.glow}
        ${active ? "z-20 brightness-125" : ""}
      `}
      style={{ "--note-rotate": item.rotate }}
    >
      {/* pin */}
      <span
        className={`
          absolute
          -top-[6px]
          left-1/2
          h-[9px]
          w-[9px]
          -translate-x-1/2
          rounded-full
          ${tone.pin}
          shadow-[0_1px_4px_rgba(0,0,0,.7)]
          transition-transform
          duration-300
          group-hover:scale-125
        `}
      />

      {/* subtle paper grid */}
      <span
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[5px]
          opacity-[.07]
          [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)]
          [background-size:7px_7px]
        "
      />

      <span className="relative block h-full px-4 py-3">
        <span className="flex items-start justify-between">
          <span className="font-mono text-[8px] tracking-[.28em] text-[#87796d]">
            {item.id}
          </span>

          <span className={`${tone.text} opacity-70`}>
            <Icon type={item.icon} />
          </span>
        </span>

        <span
          className={`
            mt-3
            block
            font-serif
            text-[17px]
            italic
            leading-none
            tracking-[-.02em]
            ${tone.text}
          `}
        >
          {item.title}
        </span>

        <span
          className={`
            absolute
            bottom-[8px]
            right-[10px]
            h-px
            w-[18px]
            ${tone.pin}
            opacity-40
          `}
        />
      </span>
    </button>
  );
}

function SideRail({ activeIndex, onSelect }) {
  return (
    <aside className="hidden w-[66px] shrink-0 border-l border-white/[.08] pl-3 lg:block">
      <div className="flex flex-col gap-2">
        {VAULT_ITEMS.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(index)}
            aria-label={item.title}
            className={`
              group
              relative
              h-[73px]
              w-[48px]
              overflow-hidden
              border
              transition-all
              duration-300
              ${
                activeIndex === index
                  ? "border-[#a83d3b]"
                  : "border-white/[.08] opacity-45 hover:opacity-80"
              }
            `}
          >
            <span className="absolute inset-0 bg-[#171514]" />

            <span className="absolute left-1 top-2 font-mono text-[6px] text-white/50">
              {item.id}
            </span>

            <span
              className={`absolute bottom-2 left-1/2 h-px w-4 -translate-x-1/2 ${
                activeIndex === index ? "bg-[#c74848]" : "bg-white/20"
              }`}
            />
          </button>
        ))}
      </div>
    </aside>
  );
}

export default function CinematicHero() {
  const [activeIndex, setActiveIndex] = useState(1);

  const active = useMemo(
    () => VAULT_ITEMS[activeIndex],
    [activeIndex]
  );

  const title = {
    Memory: "WHAT WE REMEMBER.",
    Confession: "THINGS LEFT UNSAID.",
    Understanding: "A SHARED DARKNESS.",
    Imagination: "WHERE POSSIBILITY BEGINS.",
    Vibes: "FEEL WHAT WORDS CANNOT.",
    Questioning: "ASK WHAT OTHERS AVOID.",
    Truth: "WHERE MYSTERY BEGINS.",
  }[active.title];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-[#e7e0d7] selection:bg-[#9d3d3b]/40">
      {/* atmospheric background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          fixed
          inset-0
          -z-0
          opacity-40
          [background-image:radial-gradient(circle_at_20%_35%,rgba(104,60,40,.10),transparent_30%),radial-gradient(circle_at_70%_60%,rgba(80,40,35,.08),transparent_32%)]
        "
      />

      {/* HEADER */}
      <header className="relative z-50 h-[64px] border-b border-white/[.09] bg-[#050505]/95">
        <div className="mx-auto flex h-full max-w-[1500px] items-center px-6 lg:px-10">
          <div className="w-1/3">
            <div className="flex items-center gap-[2px] font-sans text-[15px] font-medium tracking-[-.12em]">
              <span className="text-[#dedede]">e</span>
              <span className="text-[#d83e31]">s</span>
              <span className="text-[#dedede]">o</span>
            </div>
          </div>

          <nav className="flex w-1/3 justify-center gap-12">
            <button className="relative py-6 font-mono text-[10px] uppercase tracking-[.35em] text-white/90">
              Explore
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#d73d3b]" />
            </button>

            <button className="py-6 font-mono text-[10px] uppercase tracking-[.35em] text-white/45 transition-colors hover:text-white/80">
              Community
            </button>
          </nav>

          <div className="flex w-1/3 items-center justify-end gap-8">
            <button className="font-mono text-[10px] uppercase tracking-[.35em] text-white/65 hover:text-white">
              Sign In
            </button>

            <button className="h-[34px] w-[90px] bg-[#f2f0ec] font-mono text-[10px] uppercase tracking-[.3em] text-[#111] transition-transform hover:scale-[1.02]">
              Join
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <section className="relative z-10 mx-auto max-w-[1500px] px-5 py-10 lg:px-10">
        <div
          className="
            grid
            items-center
            gap-x-6
            lg:grid-cols-[minmax(360px,430px)_minmax(0,1fr)_66px]
            xl:grid-cols-[450px_minmax(0,1fr)_66px]
          "
        >
          {/* LEFT CANVAS */}
          <section className="relative">
            <div className="mb-4">
              <p className="font-mono text-[10px] uppercase tracking-[.32em] text-[#ddd3c7]">
                Vault Index
              </p>

              <div className="mt-3 h-px w-[78px] bg-gradient-to-r from-[#8d3d35] to-transparent" />
            </div>

            {/*
              IMPORTANT:
              This is the actual coordinate system for the notes.
              The notes are NEVER positioned relative to the viewport.
            */}
            <div
              className="
                sticky-board
                relative
                mx-auto
                h-[455px]
                w-full
                max-w-[410px]
              "
            >
              {VAULT_ITEMS.map((item, index) => (
                <StickyNote
                  key={item.id}
                  item={item}
                  active={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>

            {/* small vault information card */}
            <div className="mx-auto mt-[-12px] w-[265px] rotate-[-1deg] border border-white/[.08] bg-[#090909]/80 px-6 py-5">
              <div className="flex justify-between font-mono text-[7px] uppercase tracking-[.25em] text-white/35">
                <span>ESO — VAULT</span>
                <span>{active.id}</span>
              </div>

              <h2 className="mt-5 font-serif text-[25px] text-[#ded6ca]">
                {active.title}
              </h2>

              <p className="mt-2 max-w-[190px] font-mono text-[7px] leading-4 tracking-[.18em] text-white/35">
                {title}
              </p>
            </div>
          </section>

          {/* CENTER / TITLE */}
          <section className="hidden min-w-0 self-center lg:block">
            <div className="relative pl-2">
              <span className="absolute -left-2 -top-5 font-serif text-[44px] leading-none text-[#7d2828]">
                “
              </span>

              <span className="font-mono text-[7px] tracking-[.35em] text-white/30">
                {active.id}
              </span>

              <h1 className="mt-4 max-w-[390px] overflow-hidden font-serif text-[52px] font-normal uppercase leading-[.92] tracking-[-.045em] text-[#e7e0d7] xl:text-[58px]">
                {active.title}
              </h1>

              <div className="mt-5 h-px w-[62px] bg-[#963b36]" />

              <p className="mt-4 font-mono text-[9px] uppercase tracking-[.3em] text-white/45">
                {title}
              </p>
            </div>
          </section>

          {/* HERO */}
          <section className="col-span-full mt-10 lg:col-span-1 lg:mt-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-white/[.12] bg-black">
              <img
                src={HERO_IMAGE}
                alt=""
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* cinematic overlays */}
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />

              <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                <div className="max-w-[650px]">
                  <p className="font-serif text-[16px] font-semibold leading-[1.9] tracking-[.16em] text-white sm:text-[18px] lg:text-[19px]">
                    {active.title === "Confession" ? (
                      <>
                        The <em className="text-[#b8403d]">weight</em> we carry
                        is lighter when shared in{" "}
                        <em className="text-[#b8403d]">whispers.</em>
                      </>
                    ) : (
                      <>
                        To be understood is to find another who speaks the{" "}
                        <em className="text-[#b8403d]">language</em> of your
                        silence.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <span className="absolute left-5 top-1/2 font-serif text-[48px] leading-none text-[#9d3535]/70">
                “
              </span>

              <span className="absolute right-5 top-1/2 font-serif text-[48px] leading-none text-[#9d3535]/70">
                ”
              </span>
            </div>

            <div className="mt-5 flex items-center justify-end gap-4 pr-2">
              <span className="font-mono text-[7px] uppercase tracking-[.38em] text-white/35">
                Explore the vault
              </span>
              <span className="h-px w-[55px] bg-white/30" />
              <span className="font-mono text-[11px] text-white/45">→</span>
            </div>
          </section>

          {/* RIGHT RAIL */}
          <SideRail
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        </div>
      </section>

      {/* DESKTOP NOTE POSITIONING */}
      <style>{`
        /*
          2 / 3 / 2 composition.

          Every coordinate belongs to .sticky-board.
          Nothing is positioned relative to the viewport.
        */

        .vault-note {
          transform: rotate(var(--note-rotate));
          transform-origin: center;
        }

        .note-1 {
          left: 2%;
          top: 6%;
        }

        .note-2 {
          left: 47%;
          top: 16%;
        }

        .note-3 {
          left: 5%;
          top: 37%;
        }

        .note-4 {
          left: 35%;
          top: 43%;
        }

        .note-5 {
          left: 67%;
          top: 39%;
        }

        .note-6 {
          left: 13%;
          top: 70%;
        }

        .note-7 {
          left: 58%;
          top: 74%;
        }

        /*
          Prevent accidental overflow caused by transforms
          while keeping the artistic overlap.
        */
        .sticky-board {
          contain: layout paint;
        }

        @media (max-width: 1279px) {
          .vault-note {
            width: 132px;
            height: 78px;
          }

          .note-1 { left: 3%; }
          .note-2 { left: 46%; }
          .note-3 { left: 4%; }
          .note-4 { left: 34%; }
          .note-5 { left: 64%; }
          .note-6 { left: 10%; }
          .note-7 { left: 55%; }
        }

        @media (max-width: 1023px) {
          .sticky-board {
            height: 400px;
            max-width: 390px;
          }
        }

        @media (max-width: 639px) {
          .sticky-board {
            height: 365px;
            max-width: 350px;
          }

          .vault-note {
            width: 118px;
            height: 70px;
          }

          .vault-note span {
            /* preserve compact typography */
          }

          .note-1 {
            left: 2%;
            top: 4%;
          }

          .note-2 {
            left: 52%;
            top: 11%;
          }

          .note-3 {
            left: 0;
            top: 37%;
          }

          .note-4 {
            left: 34%;
            top: 42%;
          }

          .note-5 {
            left: 67%;
            top: 37%;
          }

          .note-6 {
            left: 8%;
            top: 72%;
          }

          .note-7 {
            left: 56%;
            top: 76%;
          }
        }
      `}</style>
    </main>
  );
}