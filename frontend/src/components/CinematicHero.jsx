import React, { useState } from "react";

/*
|--------------------------------------------------------------------------
| IMAGE DATA
|--------------------------------------------------------------------------
|
| Replace these paths with the actual images already used by your project.
|
| Each vault item owns:
|   - hero image
|   - thumbnail image
|   - title
|   - subtitle
|   - quote
|   - accent color
|   - sticky-note position
|   - sticky-note rotation
|
*/

const VAULT_ITEMS = [
  {
    id: "01",
    title: "Memory",
    subtitle: "What we remember.",
    hero: "/images/vault/memory.webp",
    thumbnail: "/images/vault/memory.webp",
    quote: (
      <>
        What remains is often hidden in the{" "}
        <Accent>fragments</Accent> we choose to remember.
      </>
    ),
    tone: "rose",
    note: "n1",
    rotation: "-3deg",
    icon: "brain",
  },

  {
    id: "02",
    title: "Confession",
    subtitle: "Things left unsaid.",
    hero: "/images/vault/confession.webp",
    thumbnail: "/images/vault/confession.webp",
    quote: (
      <>
        The <Accent>weight</Accent> we carry is lighter when shared in{" "}
        <Accent>whispers.</Accent>
      </>
    ),
    tone: "amber",
    note: "n2",
    rotation: "2.5deg",
    icon: "eye",
  },

  {
    id: "03",
    title: "Understanding",
    subtitle: "A shared darkness.",
    hero: "/images/vault/understanding.webp",
    thumbnail: "/images/vault/understanding.webp",
    quote: (
      <>
        To be understood is to find another who speaks the{" "}
        <Accent>language</Accent> of your silence.
      </>
    ),
    tone: "violet",
    note: "n3",
    rotation: "-2deg",
    icon: "diamond",
  },

  {
    id: "04",
    title: "Imagination",
    subtitle: "Where possibility begins.",
    hero: "/images/vault/imagination.webp",
    thumbnail: "/images/vault/imagination.webp",
    quote: (
      <>
        Every world begins as an{" "}
        <Accent>impossible thought.</Accent>
      </>
    ),
    tone: "olive",
    note: "n4",
    rotation: "2deg",
    icon: "star",
  },

  {
    id: "05",
    title: "Vibes",
    subtitle: "Feel what words cannot.",
    hero: "/images/vault/vibes.webp",
    thumbnail: "/images/vault/vibes.webp",
    quote: (
      <>
        Some things are understood long before they become{" "}
        <Accent>words.</Accent>
      </>
    ),
    tone: "ochre",
    note: "n5",
    rotation: "-1.5deg",
    icon: "wave",
  },

  {
    id: "06",
    title: "Questioning",
    subtitle: "Ask what others avoid.",
    hero: "/images/vault/questioning.webp",
    thumbnail: "/images/vault/questioning.webp",
    quote: (
      <>
        The right question can disturb a lifetime of{" "}
        <Accent>certainty.</Accent>
      </>
    ),
    tone: "clay",
    note: "n6",
    rotation: "-3.5deg",
    icon: "target",
  },

  {
    id: "07",
    title: "Truth",
    subtitle: "Where mystery begins.",
    hero: "/images/vault/truth.webp",
    thumbnail: "/images/vault/truth.webp",
    quote: (
      <>
        Truth is not found in certainty, but in the courage to remain{" "}
        <Accent>uncertain.</Accent>
      </>
    ),
    tone: "wine",
    note: "n7",
    rotation: "2deg",
    icon: "compass",
  },
];

/*
|--------------------------------------------------------------------------
| COLORS
|--------------------------------------------------------------------------
*/

const TONES = {
  rose: {
    border: "#713f3d",
    text: "#d1a39a",
    pin: "#c65b66",
    background: "#211817",
  },

  amber: {
    border: "#72563b",
    text: "#c9a16e",
    pin: "#d09a52",
    background: "#211b16",
  },

  violet: {
    border: "#514660",
    text: "#b7a4cc",
    pin: "#9674c2",
    background: "#1c1920",
  },

  olive: {
    border: "#4b5138",
    text: "#a9ad83",
    pin: "#75945b",
    background: "#1c1e17",
  },

  ochre: {
    border: "#67512f",
    text: "#c5a263",
    pin: "#c89138",
    background: "#201b14",
  },

  clay: {
    border: "#624941",
    text: "#c79c91",
    pin: "#bd7168",
    background: "#211918",
  },

  wine: {
    border: "#67383a",
    text: "#d19a94",
    pin: "#c05860",
    background: "#211719",
  },
};

function Accent({ children }) {
  return (
    <em className="not-italic text-[#b7433f]">
      {children}
    </em>
  );
}

/*
|--------------------------------------------------------------------------
| ICONS
|--------------------------------------------------------------------------
*/

function VaultIcon({ type }) {
  const base =
    "h-[17px] w-[17px] fill-none stroke-current stroke-[1.15]";

  if (type === "brain") {
    return (
      <svg viewBox="0 0 24 24" className={base}>
        <path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v.5A3 3 0 0 0 4 11.3a3.2 3.2 0 0 0 2.2 3A3.5 3.5 0 0 0 9.5 19" />
        <path d="M14.5 4.5A3.5 3.5 0 0 1 18 8v.5a3 3 0 0 1 2 2.8 3.2 3.2 0 0 1-2.2 3 3.5 3.5 0 0 1-3.3 4.7" />
        <path d="M9.5 4.5v15M14.5 4.5v15M6 9h3.5M14.5 9H18M6.5 14h3M14.5 14h3" />
      </svg>
    );
  }

  if (type === "eye") {
    return (
      <svg viewBox="0 0 24 24" className={base}>
        <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }

  if (type === "diamond") {
    return (
      <svg viewBox="0 0 24 24" className={base}>
        <path d="m12 3 7 9-7 9-7-9 7-9Z" />
        <path d="m12 7 3.5 5-3.5 5-3.5-5L12 7Z" />
      </svg>
    );
  }

  if (type === "star") {
    return (
      <svg viewBox="0 0 24 24" className={base}>
        <path d="m12 3 1.8 5.4L19 10l-5.2 1.7L12 17l-1.8-5.3L5 10l5.2-1.6L12 3Z" />
        <path d="M19 16v5M16.5 18.5h5" />
      </svg>
    );
  }

  if (type === "wave") {
    return (
      <svg viewBox="0 0 24 24" className={base}>
        <path d="M3 12h2.5l2-5 3.5 10 3.5-10 2 5H21" />
      </svg>
    );
  }

  if (type === "target") {
    return (
      <svg viewBox="0 0 24 24" className={base}>
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M22 12h-3M12 22v-3M2 12h3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={base}>
      <circle cx="12" cy="12" r="8" />
      <path d="m15.5 8.5-2.2 5.2-4.8 2 2.2-5.2 4.8-2Z" />
    </svg>
  );
}

/*
|--------------------------------------------------------------------------
| STICKY NOTE
|--------------------------------------------------------------------------
*/

function StickyNote({
  item,
  active,
  onClick,
}) {
  const tone = TONES[item.tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${item.title}`}
      className={`
        vault-note
        ${item.note}
        group
        absolute
        z-10
        h-[84px]
        w-[146px]
        rounded-[5px]
        border
        text-left
        transition-all
        duration-500
        ease-out
        hover:z-50
        hover:-translate-y-[3px]
        hover:brightness-110
        active:scale-[.98]
        ${active ? "z-30 brightness-110" : ""}
      `}
      style={{
        "--note-border": tone.border,
        "--note-text": tone.text,
        "--note-pin": tone.pin,
        "--note-bg": tone.background,
        "--note-rotation": item.rotation,
      }}
    >
      {/* paper */}
      <span
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[5px]
          bg-[var(--note-bg)]
        "
      />

      {/* subtle technical grid */}
      <span
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[5px]
          opacity-[.075]
          [background-image:linear-gradient(rgba(255,255,255,.45)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.45)_1px,transparent_1px)]
          [background-size:7px_7px]
        "
      />

      {/* border */}
      <span
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[5px]
          border
          border-[var(--note-border)]
        "
      />

      {/* pin */}
      <span
        className="
          absolute
          -top-[6px]
          left-1/2
          z-20
          h-[9px]
          w-[9px]
          -translate-x-1/2
          rounded-full
          bg-[var(--note-pin)]
          shadow-[0_1px_4px_rgba(0,0,0,.8)]
          transition-transform
          duration-300
          group-hover:scale-125
        "
      />

      {/* content */}
      <span className="relative z-10 block h-full px-[14px] py-[12px]">
        <span className="flex items-start justify-between">
          <span className="font-mono text-[7px] tracking-[.25em] text-[#85786e]">
            {item.id}
          </span>

          <span className="text-[var(--note-text)] opacity-70">
            <VaultIcon type={item.icon} />
          </span>
        </span>

        <span
          className="
            mt-[11px]
            block
            truncate
            font-serif
            text-[17px]
            italic
            leading-none
            tracking-[-.015em]
            text-[var(--note-text)]
          "
        >
          {item.title}
        </span>

        <span
          className="
            absolute
            bottom-[9px]
            right-[10px]
            h-px
            w-[18px]
            bg-[var(--note-pin)]
            opacity-50
          "
        />
      </span>
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| STICKY BOARD
|--------------------------------------------------------------------------
*/

function StickyBoard({
  activeIndex,
  onSelect,
}) {
  return (
    <div
      className="
        sticky-board
        relative
        mx-auto
        h-[445px]
        w-full
        max-w-[410px]
      "
    >
      {VAULT_ITEMS.map((item, index) => (
        <StickyNote
          key={item.id}
          item={item}
          active={activeIndex === index}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| HERO
|--------------------------------------------------------------------------
*/

function Cinema({
  item,
}) {
  return (
    <section className="min-w-0">
      <div
        className="
          cinema
          relative
          aspect-[16/9]
          w-full
          overflow-hidden
          border
          border-white/[.13]
          bg-[#090909]
        "
      >
        <img
          key={item.hero}
          src={item.hero}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-center
          "
        />

        {/* cinematic grading */}
        <div
          className="
            absolute
            inset-0
            bg-black/[.28]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/[.38]
            via-transparent
            to-black/[.24]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/[.58]
            via-transparent
            to-black/[.25]
          "
        />

        {/* quote */}
        <div
          className="
            absolute
            inset-x-[8%]
            top-1/2
            -translate-y-1/2
            text-center
          "
        >
          <p
            className="
              mx-auto
              max-w-[760px]
              font-serif
              text-[15px]
              font-semibold
              leading-[1.9]
              tracking-[.16em]
              text-white
              sm:text-[17px]
              lg:text-[18px]
              xl:text-[19px]
            "
          >
            {item.quote}
          </p>
        </div>

        {/* quote marks */}
        <span
          className="
            absolute
            left-[5%]
            top-1/2
            -translate-y-1/2
            font-serif
            text-[50px]
            leading-none
            text-[#a43836]/70
          "
        >
          “
        </span>

        <span
          className="
            absolute
            right-[5%]
            top-1/2
            -translate-y-1/2
            font-serif
            text-[50px]
            leading-none
            text-[#a43836]/70
          "
        >
          ”
        </span>

        {/* image number */}
        <div
          className="
            absolute
            left-5
            top-5
            font-mono
            text-[7px]
            tracking-[.3em]
            text-white/40
          "
        >
          {item.id}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-4 pr-1">
        <span className="font-mono text-[7px] uppercase tracking-[.38em] text-white/35">
          Explore the vault
        </span>

        <span className="h-px w-[55px] bg-white/30" />

        <span className="font-mono text-[12px] text-white/45">
          →
        </span>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| THUMBNAIL RAIL
|--------------------------------------------------------------------------
*/

function ThumbnailRail({
  activeIndex,
  onSelect,
}) {
  return (
    <aside
      className="
        hidden
        lg:block
        self-stretch
        border-l
        border-white/[.09]
        pl-[12px]
      "
    >
      <div className="flex h-full flex-col gap-[8px]">
        {VAULT_ITEMS.map((item, index) => {
          const active = index === activeIndex;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`View ${item.title}`}
              className={`
                group
                relative
                aspect-[.73]
                w-[48px]
                shrink-0
                overflow-hidden
                border
                transition-all
                duration-300
                ${
                  active
                    ? "border-[#b23f3d] opacity-100"
                    : "border-white/[.09] opacity-45 hover:opacity-80"
                }
              `}
            >
              <img
                src={item.thumbnail}
                alt=""
                loading="lazy"
                decoding="async"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  grayscale-[.2]
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />

              <div className="absolute inset-0 bg-black/[.38]" />

              <span className="absolute left-[6px] top-[6px] font-mono text-[6px] tracking-[.1em] text-white/65">
                {item.id}
              </span>

              {active && (
                <span className="absolute bottom-[6px] left-1/2 h-px w-[18px] -translate-x-1/2 bg-[#c54845]" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

/*
|--------------------------------------------------------------------------
| MOBILE THUMBNAILS
|--------------------------------------------------------------------------
*/

function MobileThumbnails({
  activeIndex,
  onSelect,
}) {
  return (
    <div className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
      {VAULT_ITEMS.map((item, index) => {
        const active = index === activeIndex;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(index)}
            className={`
              relative
              h-[66px]
              w-[82px]
              shrink-0
              overflow-hidden
              border
              ${
                active
                  ? "border-[#b23f3d]"
                  : "border-white/[.1]"
              }
            `}
          >
            <img
              src={item.thumbnail}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <span className="absolute inset-0 bg-black/30" />

            <span className="absolute bottom-1 left-2 font-mono text-[6px] text-white/70">
              {item.id}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| VAULT META CARD
|--------------------------------------------------------------------------
*/

function VaultMetaCard({
  item,
}) {
  return (
    <div
      className="
        mx-auto
        mt-[-8px]
        w-[265px]
        rotate-[-1deg]
        border
        border-white/[.09]
        bg-[#090909]/90
        px-6
        py-5
      "
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[7px] uppercase tracking-[.28em] text-white/35">
          ESO — VAULT
        </span>

        <span className="font-mono text-[7px] text-white/35">
          {item.id}
        </span>
      </div>

      <h3 className="mt-5 font-serif text-[25px] text-[#ddd5cb]">
        {item.title}
      </h3>

      <p className="mt-2 font-mono text-[7px] uppercase tracking-[.25em] text-white/35">
        {item.subtitle}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| HEADER
|--------------------------------------------------------------------------
*/

function Header() {
  return (
    <header
      className="
        relative
        z-50
        h-[64px]
        border-b
        border-white/[.09]
        bg-[#050505]/95
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          max-w-[1500px]
          items-center
          px-6
          lg:px-10
        "
      >
        {/* logo */}
        <div className="flex w-1/3 items-center">
          <div className="font-sans text-[16px] font-medium tracking-[-.15em]">
            <span className="text-[#e5e2dd]">e</span>
            <span className="text-[#d34235]">s</span>
            <span className="text-[#e5e2dd]">o</span>
          </div>
        </div>

        {/* navigation */}
        <nav className="flex h-full w-1/3 items-center justify-center gap-12">
          <button
            type="button"
            className="
              relative
              h-full
              font-mono
              text-[10px]
              uppercase
              tracking-[.35em]
              text-white
            "
          >
            Explore

            <span
              className="
                absolute
                bottom-0
                left-0
                h-[2px]
                w-full
                bg-[#d63e3c]
              "
            />
          </button>

          <button
            type="button"
            className="
              font-mono
              text-[10px]
              uppercase
              tracking-[.35em]
              text-white/45
              transition-colors
              hover:text-white
            "
          >
            Community
          </button>
        </nav>

        {/* actions */}
        <div className="flex w-1/3 items-center justify-end gap-8">
          <button
            type="button"
            className="
              font-mono
              text-[10px]
              uppercase
              tracking-[.35em]
              text-white/60
              hover:text-white
            "
          >
            Sign In
          </button>

          <button
            type="button"
            className="
              h-[34px]
              w-[90px]
              bg-[#f0eee9]
              font-mono
              text-[10px]
              uppercase
              tracking-[.3em]
              text-[#101010]
              transition-transform
              hover:scale-[1.02]
            "
          >
            Join
          </button>
        </div>
      </div>
    </header>
  );
}

/*
|--------------------------------------------------------------------------
| MAIN PAGE
|--------------------------------------------------------------------------
*/

export default function CinematicHero() {
  const [activeIndex, setActiveIndex] = useState(1);

  const active = VAULT_ITEMS[activeIndex];

  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#050505]
        text-[#e7e0d7]
      "
    >
      <Header />

      {/* atmospheric background */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-10
          bg-[radial-gradient(circle_at_15%_35%,rgba(83,48,35,.08),transparent_27%),radial-gradient(circle_at_80%_55%,rgba(78,38,32,.06),transparent_32%)]
        "
      />

      <section
        className="
          mx-auto
          max-w-[1500px]
          px-5
          py-9
          lg:px-8
          xl:px-10
        "
      >
        {/*
        ==================================================================
        DESKTOP COMPOSITION

        LEFT              HERO                 RAIL
        ┌────────────┐    ┌──────────────┐    ┌───┐
        │ sticky 01 │    │              │    │01 │
        │ sticky 02 │    │              │    │02 │
        │ sticky 03 │    │    CINEMA    │    │03 │
        │ sticky 04 │    │              │    │04 │
        │ sticky 05 │    │              │    │05 │
        │ sticky 06 │    │              │    │06 │
        │ sticky 07 │    │              │    │07 │
        └────────────┘    └──────────────┘    └───┘
        ==================================================================
        */}

        <div
          className="
            grid
            items-center
            gap-x-6
            lg:grid-cols-[minmax(340px,380px)_minmax(520px,1fr)_62px]
            xl:grid-cols-[390px_minmax(620px,1fr)_62px]
            2xl:grid-cols-[410px_minmax(700px,1fr)_66px]
          "
        >
          {/* ============================================================
              LEFT
          ============================================================ */}

          <section className="relative min-w-0">
            <div className="mb-3">
              <p
                className="
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[.32em]
                  text-[#ddd4ca]
                "
              >
                Vault Index
              </p>

              <div className="mt-3 h-px w-[78px] bg-gradient-to-r from-[#8e3e38] to-transparent" />
            </div>

            <StickyBoard
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
            />

            <VaultMetaCard item={active} />
          </section>

          {/* ============================================================
              HERO AREA
          ============================================================ */}

          <section className="min-w-0">
            <Cinema item={active} />

            <MobileThumbnails
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
            />
          </section>

          {/* ============================================================
              THUMBNAILS
          ============================================================ */}

          <ThumbnailRail
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        </div>

        {/* ================================================================
            DESKTOP TITLE
        ================================================================ */}

        <div
          className="
            pointer-events-none
            absolute
            hidden
            lg:block
          "
          style={{
            /*
             * Deliberately positioned against the main content wrapper,
             * NOT against the viewport-level sticky cards.
             */
            left: "calc(50% - 470px)",
            top: "50%",
          }}
        >
          <div className="-translate-y-1/2">
            <span className="font-mono text-[7px] tracking-[.32em] text-white/30">
              {active.id}
            </span>

            <h1
              key={active.title}
              className="
                mt-4
                max-w-[390px]
                font-serif
                text-[50px]
                font-normal
                uppercase
                leading-[.9]
                tracking-[-.045em]
                text-[#e8e0d6]
                xl:text-[56px]
              "
            >
              {active.title}
            </h1>

            <div className="mt-5 h-px w-[62px] bg-[#963b36]" />

            <p className="mt-4 font-mono text-[8px] uppercase tracking-[.32em] text-white/40">
              {active.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          RESPONSIVE TITLE
      ================================================================ */}

      <section className="mx-auto max-w-[1500px] px-5 pb-10 lg:hidden">
        <div className="pt-5">
          <span className="font-mono text-[7px] tracking-[.32em] text-white/30">
            {active.id}
          </span>

          <h1 className="mt-3 font-serif text-[44px] uppercase leading-none tracking-[-.04em] text-[#e8e0d6]">
            {active.title}
          </h1>

          <div className="mt-4 h-px w-[55px] bg-[#963b36]" />

          <p className="mt-3 font-mono text-[8px] uppercase tracking-[.3em] text-white/40">
            {active.subtitle}
          </p>
        </div>
      </section>

      {/* ================================================================
          POSITIONING SYSTEM
      ================================================================ */}

      <style>{`
        /*
        ================================================================
        STICKY NOTE COORDINATE SYSTEM
        ================================================================

        IMPORTANT:

        These coordinates belong ONLY to .sticky-board.

        They are percentages of the board, NOT percentages of the
        browser viewport.

        This is what prevents the notes from flying outside the page.
        ================================================================
        */

        .vault-note {
          transform: rotate(var(--note-rotation));
          transform-origin: center center;
          border-color: var(--note-border);
        }

        /*
        -------------------------------
        ROW 1
        -------------------------------

             [01]          [02]
        */

        .n1 {
          left: 2%;
          top: 5%;
        }

        .n2 {
          left: 47%;
          top: 14%;
        }

        /*
        -------------------------------
        ROW 2
        -------------------------------

        [03]     [04]       [05]
        */

        .n3 {
          left: 0%;
          top: 36%;
        }

        .n4 {
          left: 34%;
          top: 41%;
        }

        .n5 {
          left: 68%;
          top: 37%;
        }

        /*
        -------------------------------
        ROW 3
        -------------------------------

             [06]       [07]
        */

        .n6 {
          left: 9%;
          top: 70%;
        }

        .n7 {
          left: 56%;
          top: 74%;
        }

        /*
        ================================================================
        PREVENT INTERNAL LAYOUT FROM ESCAPING
        ================================================================
        */

        .sticky-board {
          contain: layout paint;
        }

        /*
        ================================================================
        TABLET
        ================================================================
        */

        @media (max-width: 1279px) {
          .vault-note {
            width: 138px;
            height: 81px;
          }

          .n1 {
            left: 1%;
          }

          .n2 {
            left: 46%;
          }

          .n3 {
            left: 0%;
          }

          .n4 {
            left: 33%;
          }

          .n5 {
            left: 64%;
          }

          .n6 {
            left: 7%;
          }

          .n7 {
            left: 54%;
          }
        }

        /*
        ================================================================
        SMALL TABLET
        ================================================================
        */

        @media (max-width: 1100px) {
          .sticky-board {
            max-width: 375px;
          }

          .vault-note {
            width: 130px;
            height: 78px;
          }
        }

        /*
        ================================================================
        MOBILE
        ================================================================
        */

        @media (max-width: 1023px) {
          .sticky-board {
            height: 410px;
            max-width: 390px;
          }

          .vault-note {
            width: 138px;
            height: 80px;
          }

          .n1 {
            left: 0%;
            top: 4%;
          }

          .n2 {
            left: 48%;
            top: 10%;
          }

          .n3 {
            left: 2%;
            top: 37%;
          }

          .n4 {
            left: 35%;
            top: 42%;
          }

          .n5 {
            left: 66%;
            top: 36%;
          }

          .n6 {
            left: 8%;
            top: 72%;
          }

          .n7 {
            left: 55%;
            top: 76%;
          }
        }

        /*
        ================================================================
        SMALL PHONE
        ================================================================
        */

        @media (max-width: 480px) {
          .sticky-board {
            height: 365px;
            max-width: 350px;
          }

          .vault-note {
            width: 116px;
            height: 69px;
          }

          .n1 {
            left: 0%;
            top: 4%;
          }

          .n2 {
            left: 50%;
            top: 10%;
          }

          .n3 {
            left: 0%;
            top: 37%;
          }

          .n4 {
            left: 33%;
            top: 43%;
          }

          .n5 {
            left: 66%;
            top: 37%;
          }

          .n6 {
            left: 7%;
            top: 72%;
          }

          .n7 {
            left: 55%;
            top: 76%;
          }
        }
      `}</style>
    </main>
  );
}