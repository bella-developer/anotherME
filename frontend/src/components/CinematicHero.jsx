import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ============================================================
   DATA
   ============================================================ */

const FRAMES = [
  {
    id: "memory",
    no: "01",
    title: "Memory",
    heading: "MEMORY",
    tagline: "ROOMS OF MEMORY.",
    quote:
      "In the architecture of remembrance, we build who we become.",
    video:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786521558/fram1desktop_emb84g.mp4",
    mobile:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame1mobile_efrsvf.mp4",
    theme: "wine",
    icon: "brain",
  },
  {
    id: "confession",
    no: "02",
    title: "Confession",
    heading: "CONFESSION",
    tagline: "THINGS LEFT UNSAID.",
    quote:
      "The weight we carry is lighter when shared in whispers.",
    video:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786357230/frae2video_qmhpf7.mp4",
    mobile:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786521557/frame2mob_pgzsnn.mp4",
    theme: "coffee",
    icon: "eye",
  },
  {
    id: "understanding",
    no: "03",
    title: "Understanding",
    heading: "UNDERSTANDING",
    tagline: "A SHARED DARKNESS.",
    quote:
      "To be understood is to find another who speaks the language of your silence.",
    video:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786358832/frame3vid_1_hjyi09.mp4",
    mobile:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786521554/frame3mob_h9pzrp.mp4",
    theme: "violet",
    icon: "diamond",
  },
  {
    id: "imagination",
    no: "04",
    title: "Imagination",
    heading: "IMAGINATION",
    tagline: "BEYOND IMAGINATION.",
    quote:
      "Reality is merely the canvas; imagination paints what could be.",
    video:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame4videoo_hizhue.mp4",
    mobile:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame4mob_ox4nlo.mp4",
    theme: "moss",
    icon: "star",
  },
  {
    id: "vibes",
    no: "05",
    title: "Vibes",
    heading: "VIBES",
    tagline: "A SPACE FOR ANYTHING.",
    quote:
      "Between structure and chaos lies the frequency of authentic being.",
    video:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786361396/frame5v_wtvs09.mp4",
    mobile:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786521549/frame5mob_q1ynbk.mp4",
    theme: "ochre",
    icon: "wave",
  },
  {
    id: "questioning",
    no: "06",
    title: "Questioning",
    heading: "QUESTIONING",
    tagline: "QUESTIONS WITHOUT ANSWERS.",
    quote:
      "The mind that asks is forever more alive than one that accepts.",
    video:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786361397/frame6v_ijhpzm.mp4",
    mobile:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786521551/frame6mob_xjoxtz.mp4",
    theme: "rose",
    icon: "target",
  },
  {
    id: "truth",
    no: "07",
    title: "Truth",
    heading: "TRUTH",
    tagline: "WHERE MYSTERY BEGINS.",
    quote:
      "Truth is not found in certainty, but in the courage to remain uncertain.",
    video:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786361701/frame7vide_yp9dc4.mp4",
    mobile:
      "https://res.cloudinary.com/dbtm7etag/video/upload/v1786521556/frame7mob_ovz0to.mp4",
    theme: "crimson",
    icon: "compass",
  },
];

/* ============================================================
   DESIGN TOKENS
   ============================================================ */

const THEMES = {
  wine: {
    bg: "#281617",
    bg2: "#32191a",
    border: "#783437",
    accent: "#e35b66",
    text: "#c9a19b",
  },

  coffee: {
    bg: "#2b2119",
    bg2: "#35271d",
    border: "#76553c",
    accent: "#d8a25b",
    text: "#c8ae91",
  },

  violet: {
    bg: "#211c2b",
    bg2: "#292238",
    border: "#5d4a78",
    accent: "#9c79df",
    text: "#b9a8d0",
  },

  moss: {
    bg: "#20271b",
    bg2: "#29311e",
    border: "#53663a",
    accent: "#769b55",
    text: "#b1bd92",
  },

  ochre: {
    bg: "#2a2116",
    bg2: "#332616",
    border: "#79541e",
    accent: "#d79b28",
    text: "#c4a16a",
  },

  rose: {
    bg: "#29201d",
    bg2: "#342521",
    border: "#79504b",
    accent: "#df7b7b",
    text: "#c8a29b",
  },

  crimson: {
    bg: "#2b1718",
    bg2: "#361b1d",
    border: "#84383d",
    accent: "#e05259",
    text: "#c99b98",
  },
};

/* ============================================================
   NOTE GEOMETRY
   ------------------------------------------------------------
   This is intentionally NOT a grid.

   Desktop:
   01             02

       03    04       05

          06       07

   Each card owns its own x/y/rotation.
   ============================================================ */

const NOTE_POSITIONS = [
  {
    left: 0,
    top: 34,
    width: 153,
    height: 91,
    rotate: -4,
  },
  {
    left: 151,
    top: 81,
    width: 151,
    height: 91,
    rotate: 3,
  },
  {
    left: -24,
    top: 173,
    width: 150,
    height: 90,
    rotate: -3,
  },
  {
    left: 109,
    top: 201,
    width: 145,
    height: 88,
    rotate: 4,
  },
  {
    left: 235,
    top: 174,
    width: 122,
    height: 76,
    rotate: 2,
  },
  {
    left: 8,
    top: 314,
    width: 151,
    height: 89,
    rotate: -5,
  },
  {
    left: 193,
    top: 333,
    width: 151,
    height: 89,
    rotate: 3,
  },
];

/* ============================================================
   ICONS
   ============================================================ */

function NoteIcon({ type }) {
  const common = {
    width: 27,
    height: 27,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.15,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (type) {
    case "brain":
      return (
        <svg {...common}>
          <path d="M12 5.5a5 5 0 0 0-4.4 7.4A5 5 0 0 0 9 22.4a5 5 0 0 0 7 3.1V6.7a5 5 0 0 0-4-1.2Z" />
          <path d="M20 5.5a5 5 0 0 1 4.4 7.4A5 5 0 0 1 23 22.4a5 5 0 0 1-7 3.1V6.7a5 5 0 0 1 4-1.2Z" />
          <path d="M11 10.5h2M19 10.5h2M10 16h4M18 16h4M13 21h2M17 21h2" />
        </svg>
      );

    case "eye":
      return (
        <svg {...common}>
          <path d="M3.5 16s4.6-7 12.5-7 12.5 7 12.5 7-4.6 7-12.5 7S3.5 16 3.5 16Z" />
          <circle cx="16" cy="16" r="3.2" />
        </svg>
      );

    case "diamond":
      return (
        <svg {...common}>
          <path d="m16 3 10 13-10 13L6 16 16 3Z" />
          <path d="m16 8 5.5 8-5.5 8-5.5-8L16 8Z" />
        </svg>
      );

    case "star":
      return (
        <svg {...common}>
          <path d="m16 3 2.7 8.3H27l-6.7 5.1 2.5 8.4-6.8-5-6.8 5 2.5-8.4L5 11.3h8.3L16 3Z" />
        </svg>
      );

    case "wave":
      return (
        <svg {...common}>
          <path d="M3 16h4l2-7 4 14 3-16 3 11 2-6h8" />
        </svg>
      );

    case "target":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="11" />
          <circle cx="16" cy="16" r="6" />
          <circle cx="16" cy="16" r="1.5" />
        </svg>
      );

    case "compass":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="11" />
          <path d="m21.5 10.5-3.2 7.8-7.8 3.2 3.2-7.8 7.8-3.2Z" />
          <path d="M16 3v4M29 16h-4M16 29v-4M3 16h4" />
        </svg>
      );

    default:
      return null;
  }
}

/* ============================================================
   DIGITAL PIN
   ============================================================ */

function Pin({ color }) {
  return (
    <span
      className="
        absolute
        -top-[6px]
        left-1/2
        z-30
        h-[11px]
        w-[11px]
        -translate-x-1/2
        rounded-full
      "
      style={{
        background: `
          radial-gradient(
            circle at 35% 30%,
            #fff7,
            ${color} 34%,
            ${color} 65%,
            #000 100%
          )
        `,
        boxShadow: `
          0 2px 3px rgba(0,0,0,.75),
          0 0 8px ${color}55
        `,
      }}
    />
  );
}

/* ============================================================
   STICKY NOTE
   ============================================================ */

function VaultNote({
  frame,
  index,
  active,
  onSelect,
}) {
  const theme = THEMES[frame.theme];
  const pos = NOTE_POSITIONS[index];

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      className="
        absolute
        block
        cursor-pointer
        text-left
        outline-none
        transition-[z-index]
        duration-300
      "
      style={{
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        width: `${pos.width}px`,
        height: `${pos.height}px`,
        zIndex: active ? 50 : 10 + index,
      }}
    >
      <div
        className="
          group
          relative
          h-full
          w-full
          overflow-visible
          rounded-[3px]
          border
          transition-all
          duration-500
          ease-out
          hover:-translate-y-1
          focus-visible:ring-1
        "
        style={{
          transform: `rotate(${pos.rotate}deg)`,
          background: `
            linear-gradient(
              135deg,
              ${theme.bg2},
              ${theme.bg}
            )
          `,
          borderColor: active
            ? `${theme.accent}cc`
            : `${theme.border}b8`,
          boxShadow: active
            ? `
              0 16px 28px rgba(0,0,0,.60),
              0 0 0 1px ${theme.accent}20,
              0 0 25px ${theme.accent}16
            `
            : `
              0 10px 20px rgba(0,0,0,.52),
              0 2px 4px rgba(0,0,0,.55)
            `,
        }}
      >
        {/* digital grain */}
        <span
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.10]
          "
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 20% 30%,
                rgba(255,255,255,.25) 0 0.5px,
                transparent 0.7px
              )
            `,
            backgroundSize: "5px 5px",
          }}
        />

        {/* upper light */}
        <span
          className="
            pointer-events-none
            absolute
            left-0
            right-0
            top-0
            h-px
          "
          style={{
            background: `linear-gradient(
              90deg,
              transparent,
              ${theme.accent}66,
              transparent
            )`,
          }}
        />

        {/* pin */}
        <Pin color={theme.accent} />

        {/* card content */}
        <div className="relative h-full px-[14px] py-[12px]">
          <div className="flex items-start justify-between">
            <span
              className="
                font-mono
                text-[8px]
                tracking-[0.24em]
              "
              style={{
                color: `${theme.text}b0`,
              }}
            >
              {frame.no}
            </span>

            <span
              className="
                -mt-1
                opacity-80
              "
              style={{
                color: `${theme.text}aa`,
              }}
            >
              <NoteIcon type={frame.icon} />
            </span>
          </div>

          <div
            className="
              absolute
              bottom-[16px]
              left-[14px]
              right-[9px]
              font-serif
              text-[18px]
              italic
              leading-none
              tracking-[-0.015em]
            "
            style={{
              color: active ? "#ddd2c2" : theme.text,
            }}
          >
            {frame.title}
          </div>

          {/* tiny artifact line */}
          <span
            className="
              absolute
              bottom-[8px]
              right-[10px]
              h-px
              w-[17px]
            "
            style={{
              backgroundColor: `${theme.accent}80`,
            }}
          />
        </div>

        {/* active edge */}
        {active && (
          <span
            className="
              absolute
              bottom-0
              left-0
              top-0
              w-[2px]
            "
            style={{
              backgroundColor: theme.accent,
            }}
          />
        )}
      </div>
    </button>
  );
}

/* ============================================================
   NOTE WALL
   ============================================================ */

function VaultIndex({
  activeIndex,
  onSelect,
}) {
  return (
    <div className="relative h-[450px] w-[355px]">
      {/* wall guide / atmospheric traces */}

      <span
        className="
          pointer-events-none
          absolute
          left-[8px]
          top-[35px]
          h-[365px]
          w-px
          bg-white/[0.025]
        "
      />

      <span
        className="
          pointer-events-none
          absolute
          left-[1px]
          top-0
          h-px
          w-[78px]
          bg-[#9b6951]/60
        "
      />

      {FRAMES.map((frame, index) => (
        <VaultNote
          key={frame.id}
          frame={frame}
          index={index}
          active={index === activeIndex}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

/* ============================================================
   VIDEO
   ============================================================ */

function CinematicVideo({ frame }) {
  return (
    <div
      className="
        relative
        h-full
        w-full
        overflow-hidden
        bg-black
      "
    >
      <video
        key={frame.id}
        autoPlay
        muted
        loop
        playsInline
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          contrast-[1.08]
          brightness-[0.72]
          saturate-[0.78]
        "
      >
        <source
          src={frame.video}
          type="video/mp4"
        />
      </video>

      {/* cinematic vignette */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,.58)_100%)]
        "
      />

      {/* left darkness */}
      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          w-[30%]
          bg-gradient-to-r
          from-black/40
          to-transparent
        "
      />

      {/* subtle top darkness */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-[22%]
          bg-gradient-to-b
          from-black/40
          to-transparent
        "
      />

      {/* quote */}
      <div
        className="
          absolute
          inset-0
          z-10
          flex
          items-center
          justify-center
          px-10
          sm:px-16
        "
      >
        <p
          className="
            max-w-[760px]
            text-center
            font-serif
            text-[15px]
            font-bold
            leading-[1.8]
            tracking-[0.075em]
            text-white
            drop-shadow-[0_3px_12px_rgba(0,0,0,.95)]
            sm:text-[18px]
            lg:text-[19px]
          "
        >
          {renderQuote(frame.quote)}
        </p>
      </div>

      {/* border */}
      <div className="absolute inset-0 border border-white/[0.11]" />
    </div>
  );
}

/* ============================================================
   QUOTE
   ============================================================ */

function renderQuote(quote) {
  const words = [
    "weight",
    "whispers",
    "architecture",
    "become",
    "language",
    "silence",
    "canvas",
    "paints",
    "frequency",
    "authentic",
    "alive",
    "accepts",
    "courage",
    "uncertain",
  ];

  const pattern = new RegExp(
    `(${words.join("|")})`,
    "gi"
  );

  return quote.split(pattern).map((part, i) => {
    const highlighted = words.some(
      (word) => word.toLowerCase() === part.toLowerCase()
    );

    return highlighted ? (
      <span
        key={i}
        className="text-[#bd3b40]"
      >
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>
        {part}
      </React.Fragment>
    );
  });
}

/* ============================================================
   FILM STRIP
   ============================================================ */

function FilmStrip({
  activeIndex,
  onSelect,
}) {
  return (
    <div
      className="
        relative
        flex
        h-[548px]
        w-[91px]
        flex-col
        gap-[7px]
        border-l
        border-white/[0.09]
        pl-[12px]
      "
    >
      {FRAMES.map((frame, index) => {
        const active = index === activeIndex;

        return (
          <button
            key={frame.id}
            type="button"
            onClick={() => onSelect(index)}
            className="
              group
              relative
              min-h-0
              flex-1
              overflow-hidden
              border
              text-left
              outline-none
              transition-all
              duration-500
            "
            style={{
              borderColor: active
                ? "#a42c31"
                : "rgba(255,255,255,.035)",
            }}
          >
            <video
              src={frame.video}
              muted
              loop
              autoPlay
              playsInline
              className={`
                absolute
                inset-0
                h-full
                w-full
                object-cover
                grayscale
                transition-all
                duration-700
                ${
                  active
                    ? "scale-100 opacity-75"
                    : "scale-[1.12] opacity-[0.22] group-hover:opacity-50"
                }
              `}
            />

            <div className="absolute inset-0 bg-black/35" />

            {/* frame number */}
            <span
              className="
                absolute
                right-[7px]
                top-[7px]
                z-10
                font-mono
                text-[7px]
              "
              style={{
                color: active
                  ? "#ddd4c8"
                  : "rgba(255,255,255,.35)",
              }}
            >
              {frame.no}
            </span>

            {/* sprocket holes */}
            <div
              className="
                absolute
                bottom-[5px]
                left-[5px]
                top-[5px]
                z-10
                flex
                flex-col
                justify-between
              "
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="
                    h-[4px]
                    w-[4px]
                    rounded-full
                    bg-white/30
                  "
                />
              ))}
            </div>

            {active && (
              <span
                className="
                  absolute
                  bottom-[8px]
                  left-[12px]
                  z-20
                  h-[2px]
                  w-[20px]
                  bg-[#b7373c]
                "
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   VAULT CARD
   ============================================================ */

function VaultCard({
  frame,
  onEnter,
}) {
  return (
    <button
      type="button"
      onClick={onEnter}
      className="
        group
        relative
        h-[128px]
        w-[265px]
        rotate-[-2deg]
        overflow-hidden
        border
        border-white/[0.10]
        bg-[#090909]
        p-[27px]
        text-left
        transition-all
        duration-500
        hover:rotate-0
        hover:border-white/[0.18]
      "
    >
      {/* paper lines */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-20
        "
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 6px,rgba(255,255,255,.018) 7px)",
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span
            className="
              font-mono
              text-[8px]
              tracking-[0.22em]
              text-[#756d64]
            "
          >
            ESO — VAULT
          </span>

          <span className="font-mono text-[8px] text-[#4d4741]">
            {frame.no}
          </span>
        </div>

        <div
          className="
            mt-[17px]
            font-serif
            text-[23px]
            leading-none
            text-[#c9c3b9]
          "
        >
          {frame.heading}
        </div>

        <div
          className="
            mt-[10px]
            font-mono
            text-[7px]
            uppercase
            tracking-[0.16em]
            text-[#625b54]
          "
        >
          {frame.tagline}
        </div>
      </div>
    </button>
  );
}

/* ============================================================
   MAIN
   ============================================================ */

export default function CinematicVault() {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(1);

  const activeFrame = useMemo(
    () => FRAMES[activeIndex],
    [activeIndex]
  );

  /* ------------------------------------------------------------
     keyboard
     ------------------------------------------------------------ */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === FRAMES.length - 1
            ? 0
            : current + 1
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === 0
            ? FRAMES.length - 1
            : current - 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-[#030303]
        text-[#e6e2da]
      "
    >
      {/* ==========================================================
          GLOBAL WALL
          ========================================================== */}

      <div className="fixed inset-0 -z-10 bg-[#030303]" />

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-10
          opacity-[0.035]
        "
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.55) .45px, transparent .55px)",
          backgroundSize: "4px 4px",
        }}
      />

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          -z-10
          bg-[radial-gradient(circle_at_42%_48%,rgba(115,68,42,.075),transparent_34%)]
        "
      />

      {/* ==========================================================
          HEADER
          ========================================================== */}

      <header
        className="
          h-[69px]
          border-b
          border-white/[0.09]
          bg-[#030303]/95
        "
      >
        <div
          className="
            mx-auto
            flex
            h-full
            max-w-[1740px]
            items-center
            justify-between
            px-6
            lg:px-0
          "
        >
          {/* logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              font-sans
              text-[20px]
              font-light
              tracking-[-0.12em]
              text-white
            "
          >
            e<span className="text-[#c42c30]">s</span>o
          </button>

          {/* navigation */}
          <nav
            className="
              absolute
              left-1/2
              hidden
              -translate-x-1/2
              items-center
              gap-[64px]
              md:flex
            "
          >
            <button
              className="
                relative
                py-7
                font-mono
                text-[11px]
                uppercase
                tracking-[0.22em]
                text-white
              "
            >
              Explore

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  mx-auto
                  h-[2px]
                  w-[80px]
                  bg-[#d7353a]
                "
              />
            </button>

            <button
              className="
                py-7
                font-mono
                text-[11px]
                uppercase
                tracking-[0.22em]
                text-[#76716c]
                transition-colors
                hover:text-white
              "
            >
              Community
            </button>
          </nav>

          {/* right */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("/login")}
              className="
                hidden
                font-mono
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-[#aaa49c]
                sm:block
              "
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/register")}
              className="
                h-[38px]
                w-[105px]
                bg-[#f2f1ee]
                font-mono
                text-[10px]
                uppercase
                tracking-[0.24em]
                text-[#171615]
                transition-all
                hover:bg-white
              "
            >
              Join
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================================
          DESKTOP STAGE
          ========================================================== */}

      <section
        className="
          mx-auto
          hidden
          min-h-[calc(100vh-69px)]
          max-w-[1740px]
          grid-cols-[355px_300px_minmax(650px,1fr)_91px]
          gap-0
          px-0
          lg:grid
        "
      >
        {/* ========================================================
            LEFT — NOTE WALL
            ======================================================== */}

        <aside className="relative pt-[63px]">
          <div
            className="
              mb-[17px]
              font-mono
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.26em]
              text-[#d3cec5]
            "
          >
            VAULT INDEX
          </div>

          <div
            className="
              mb-[-1px]
              h-px
              w-[78px]
              bg-[#9a403e]/60
            "
          />

          <VaultIndex
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        </aside>

        {/* ========================================================
            CENTER — TITLE
            ======================================================== */}

        <section
          className="
            relative
            flex
            items-center
            pb-[50px]
          "
        >
          <div className="w-full pr-[20px]">
            <span
              className="
                mb-[27px]
                block
                font-mono
                text-[8px]
                tracking-[0.20em]
                text-[#625d56]
              "
            >
              {activeFrame.no}
            </span>

            <h1
              key={activeFrame.id}
              className="
                max-w-[295px]
                whitespace-nowrap
                font-serif
                text-[45px]
                font-normal
                leading-none
                tracking-[-0.045em]
                text-[#e8e5df]
              "
            >
              {activeFrame.heading}
            </h1>

            <div
              className="
                mt-[19px]
                h-px
                w-[61px]
                bg-[#a92d32]
              "
            />

            <p
              className="
                mt-[17px]
                font-mono
                text-[9px]
                uppercase
                tracking-[0.22em]
                text-[#7b746d]
              "
            >
              {activeFrame.tagline}
            </p>
          </div>
        </section>

        {/* ========================================================
            RIGHT — CINEMA
            ======================================================== */}

        <section className="relative flex items-center">
          <div
            className="
              h-[547px]
              w-full
              overflow-hidden
              border
              border-white/[0.10]
            "
          >
            <CinematicVideo frame={activeFrame} />
          </div>

          {/* explore */}
          <button
            onClick={() => navigate("/login")}
            className="
              absolute
              bottom-[3px]
              left-1/2
              flex
              -translate-x-1/2
              translate-y-full
              items-center
              gap-[22px]
              whitespace-nowrap
            "
          >
            <span
              className="
                font-mono
                text-[8px]
                uppercase
                tracking-[0.30em]
                text-[#777069]
              "
            >
              Explore the Vault
            </span>

            <span
              className="
                relative
                block
                h-px
                w-[76px]
                bg-[#69625b]
              "
            >
              <span
                className="
                  absolute
                  right-0
                  top-1/2
                  -translate-y-1/2
                  translate-x-[1px]
                  text-[13px]
                  text-[#8b837b]
                "
              >
                →
              </span>
            </span>
          </button>
        </section>

        {/* ========================================================
            FILM STRIP
            ======================================================== */}

        <aside className="flex items-center pl-[17px]">
          <FilmStrip
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        </aside>

        {/* ========================================================
            VAULT CARD
            ======================================================== */}

        <div
          className="
            absolute
            bottom-[23px]
            left-[53px]
          "
        >
          <VaultCard
            frame={activeFrame}
            onEnter={() => navigate("/login")}
          />
        </div>
      </section>

      {/* ==========================================================
          MOBILE / TABLET
          ========================================================== */}

      <section
        className="
          block
          px-5
          pb-10
          pt-10
          lg:hidden
        "
      >
        {/* mobile index */}

        <div className="mb-8">
          <div
            className="
              mb-3
              font-mono
              text-[9px]
              uppercase
              tracking-[0.25em]
              text-[#bbb4aa]
            "
          >
            VAULT INDEX
          </div>

          <div className="h-px w-[65px] bg-[#9a403e]/70" />
        </div>

        <div className="mx-auto h-[415px] max-w-[355px]">
          <VaultIndex
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
          />
        </div>

        {/* title */}

        <div className="mb-8 mt-5">
          <span className="font-mono text-[8px] tracking-[.2em] text-[#625d56]">
            {activeFrame.no}
          </span>

          <h1 className="mt-3 font-serif text-[38px] leading-none tracking-[-.04em]">
            {activeFrame.heading}
          </h1>

          <div className="mt-4 h-px w-[55px] bg-[#a92d32]" />

          <p className="mt-4 font-mono text-[8px] uppercase tracking-[.2em] text-[#746e67]">
            {activeFrame.tagline}
          </p>
        </div>

        {/* video */}

        <div className="aspect-[16/10] overflow-hidden border border-white/10">
          <CinematicVideo frame={activeFrame} />
        </div>

        {/* mobile film strip */}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {FRAMES.map((frame, index) => (
            <button
              key={frame.id}
              onClick={() => setActiveIndex(index)}
              className={`
                relative
                h-[70px]
                min-w-[62px]
                overflow-hidden
                border
                ${
                  activeIndex === index
                    ? "border-[#a42c31]"
                    : "border-white/[0.07]"
                }
              `}
            >
              <video
                src={frame.mobile}
                muted
                loop
                autoPlay
                playsInline
                className={`
                  h-full
                  w-full
                  object-cover
                  grayscale
                  ${
                    activeIndex === index
                      ? "opacity-70"
                      : "opacity-30"
                  }
                `}
              />

              <span className="absolute right-1 top-1 font-mono text-[6px] text-white/60">
                {frame.no}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <VaultCard
            frame={activeFrame}
            onEnter={() => navigate("/login")}
          />
        </div>

        <button
          onClick={() => navigate("/login")}
          className="
            mt-10
            flex
            items-center
            gap-5
            font-mono
            text-[8px]
            uppercase
            tracking-[0.28em]
            text-[#777069]
          "
        >
          Explore the Vault

          <span className="h-px w-[55px] bg-[#69625b]" />
        </button>
      </section>
    </main>
  );
}