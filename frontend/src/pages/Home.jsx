

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import { usePageTitle } from '../hooks/usePageTitle';

const rooms = [
  {
    id: 'dark',
    name: 'DARK ROOM',
    tagline: 'Release. Witness. Discharge.',
    description: 'Where raw emotion finds its voice.',
    path: '/rooms/dark',
    video:
      'https://res.cloudinary.com/dbtm7etag/video/upload/v1790862087/d-room_p0skvw.mp4',
    glowColor: '#397982',
    glowRGB: '57, 121, 130',
    number: '01',
  },
  {
    id: 'fantasy',
    name: 'FANTASY ROOM',
    tagline: 'Create. Imagine. Inspire.',
    description: 'Where imagination roams free.',
    path: '/rooms/fantasy',
    video:
      'https://res.cloudinary.com/dbtm7etag/video/upload/v1790862085/f-room_njbnpx.mp4',
    glowColor: '#947044',
    glowRGB: '148, 112, 68',
    number: '02',
  },
  {
    id: 'philo',
    name: 'PHILO ROOM',
    tagline: 'Understand. Reflect. Inquire.',
    description: 'The question that stays.',
    path: '/rooms/philo',
    video:
      'https://res.cloudinary.com/dbtm7etag/video/upload/v1790862085/p-room_rj0tfq.mp4',
    glowColor: '#76517F',
    glowRGB: '118, 81, 127',
    number: '03',
  },
];

function Home() {
  usePageTitle('Home');

  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [time, setTime] = useState(() => new Date());
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        <main className="eso-home">
          <div className="eso-starfield" aria-hidden="true">
            <span className="eso-star eso-star--one" />
            <span className="eso-star eso-star--two" />
            <span className="eso-star eso-star--three" />
            <span className="eso-star eso-star--four" />
            <span className="eso-star eso-star--five" />
            <span className="eso-star eso-star--six" />
            <span className="eso-star eso-star--seven" />
            <span className="eso-star eso-star--eight" />
            <span className="eso-star eso-star--nine" />
            <span className="eso-star eso-star--ten" />
          </div>

          <section className="eso-hero" aria-labelledby="eso-page-title">
            <motion.div
              className="eso-greeting"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              {getGreeting()}
            </motion.div>

            <motion.p
              className="eso-eyebrow"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              Choose your room
            </motion.p>

            <motion.h1
              id="eso-page-title"
              className="eso-title"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Your Safe Space
            </motion.h1>

            <motion.div
              className="eso-title-rule"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.7 }}
              aria-hidden="true"
            />
          </section>

          <section className="eso-rooms" aria-label="Choose a room">
            {rooms.map((room, index) => (
              <motion.article
                key={room.id}
                className={`eso-room eso-room--${room.id} ${
                  hovered === room.id ? 'is-hovered' : ''
                }`}
                style={{
                  '--room-glow': room.glowColor,
                  '--room-rgb': room.glowRGB,
                  '--room-index': index,
                }}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.85,
                  delay: reduceMotion ? 0 : 0.55 + index * 0.16,
                }}
                onMouseEnter={() => setHovered(room.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  type="button"
                  className="eso-room__portal"
                  onClick={() => navigate(room.path)}
                  onFocus={() => setHovered(room.id)}
                  onBlur={() => setHovered(null)}
                  aria-label={`Enter ${room.name.toLowerCase()}`}
                >
                  <span className="eso-room__outer-frame" aria-hidden="true" />
                  <span className="eso-room__frame-shadow" aria-hidden="true" />
                  <span className="eso-room__inner-frame" aria-hidden="true" />

                  <span className="eso-room__scene">
                    <video
                      className="eso-room__video"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    >
                      <source src={room.video} type="video/mp4" />
                    </video>
                    <span className="eso-room__scene-shade" aria-hidden="true" />
                    <span className="eso-room__scanline" aria-hidden="true" />
                    <span className="eso-room__corner eso-room__corner--tl" aria-hidden="true" />
                    <span className="eso-room__corner eso-room__corner--tr" aria-hidden="true" />
                    <span className="eso-room__corner eso-room__corner--bl" aria-hidden="true" />
                    <span className="eso-room__corner eso-room__corner--br" aria-hidden="true" />
                    <span className="eso-room__index">{room.number}</span>
                    <span className="eso-room__open-mark" aria-hidden="true">↗</span>
                  </span>
                </button>

                <div className="eso-room__copy">
                  <div className="eso-room__name-row">
                    <span className="eso-room__dash" aria-hidden="true" />
                    <h2>{room.name}</h2>
                    <span className="eso-room__dash" aria-hidden="true" />
                  </div>
                  <p className="eso-room__tagline">{room.tagline}</p>
                  <p className="eso-room__description">{room.description}</p>
                  <button
                    type="button"
                    className="eso-enter"
                    onClick={() => navigate(room.path)}
                    onMouseEnter={() => setHovered(room.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <span>Enter room</span>
                    <span className="eso-enter__arrow" aria-hidden="true">⟶</span>
                  </button>
                </div>
              </motion.article>
            ))}
          </section>

          <motion.footer
            className="eso-footer"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <span className="eso-footer__line" aria-hidden="true" />
            <p>This is your space. Take your time.</p>
            <span className="eso-footer__line" aria-hidden="true" />
          </motion.footer>
        </main>

        <style>{`
          .eso-home {
            --eso-white: #f4f0eb;
            position: relative;
            isolation: isolate;
            min-height: calc(100vh - 4rem);
            overflow: hidden;
            padding: clamp(1.25rem, 3.4vh, 2.5rem) clamp(1rem, 3vw, 3rem) 1.5rem;
            color: var(--eso-white);
            background: transparent;
          }

          .eso-starfield {
            position: absolute;
            inset: 0;
            z-index: -1;
            overflow: hidden;
            pointer-events: none;
            opacity: .42;
            background-image:
              radial-gradient(1px 1px at 7% 14%, rgba(255,255,255,.85) 50%, transparent 100%),
              radial-gradient(1px 1px at 17% 67%, rgba(255,255,255,.7) 50%, transparent 100%),
              radial-gradient(1px 1px at 31% 9%, rgba(255,255,255,.8) 50%, transparent 100%),
              radial-gradient(1px 1px at 46% 24%, rgba(255,255,255,.65) 50%, transparent 100%),
              radial-gradient(1px 1px at 57% 11%, rgba(255,255,255,.8) 50%, transparent 100%),
              radial-gradient(1px 1px at 74% 18%, rgba(255,255,255,.7) 50%, transparent 100%),
              radial-gradient(1px 1px at 89% 41%, rgba(255,255,255,.8) 50%, transparent 100%),
              radial-gradient(1px 1px at 94% 79%, rgba(255,255,255,.65) 50%, transparent 100%),
              radial-gradient(1px 1px at 12% 91%, rgba(255,255,255,.6) 50%, transparent 100%),
              radial-gradient(1px 1px at 65% 83%, rgba(255,255,255,.75) 50%, transparent 100%);
          }

          .eso-star {
            position: absolute;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            background: #c7c9d1;
            box-shadow: 0 0 5px 1px rgba(180, 185, 205, .15);
          }
          .eso-star--one { left: 4%; top: 30%; }
          .eso-star--two { left: 29%; top: 16%; }
          .eso-star--three { left: 40%; top: 49%; }
          .eso-star--four { left: 63%; top: 13%; }
          .eso-star--five { left: 82%; top: 7%; }
          .eso-star--six { left: 94%; top: 31%; }
          .eso-star--seven { left: 18%; top: 80%; }
          .eso-star--eight { left: 52%; top: 88%; }
          .eso-star--nine { left: 75%; top: 73%; }
          .eso-star--ten { left: 97%; top: 91%; }

          .eso-hero {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin: 0 auto clamp(1.4rem, 3vh, 2.25rem);
          }

          .eso-greeting {
            margin-bottom: .8rem;
            padding: .42rem .8rem .4rem;
            border: 1px solid rgba(105, 112, 161, .25);
            border-radius: 999px;
            color: rgba(255,255,255,.9);
            background: rgba(45, 48, 76, .52);
            box-shadow: inset 0 1px rgba(255,255,255,.06);
            font: 600 .62rem/1.1 var(--font-body, ui-sans-serif, sans-serif);
            letter-spacing: .32em;
            text-transform: uppercase;
          }

          .eso-eyebrow {
            margin: 0 0 .55rem;
            color: rgba(245, 242, 239, .77);
            font: 500 clamp(.58rem, .8vw, .7rem)/1.4 var(--font-body, ui-sans-serif, sans-serif);
            letter-spacing: .48em;
            text-transform: uppercase;
          }

          .eso-title {
            margin: 0;
            padding-left: .12em;
            color: #fbf8f4;
            font-family: var(--font-body, ui-sans-serif, sans-serif);
            font-size: clamp(2.5rem, 4.2vw, 4.5rem);
            font-weight: 200;
            line-height: 1.08;
            letter-spacing: .12em;
            text-shadow: 0 2px 24px rgba(255,255,255,.045);
          }

          .eso-title-rule {
            width: clamp(3rem, 8vw, 6.5rem);
            height: 1px;
            margin-top: .85rem;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
            transform-origin: center;
          }

          .eso-rooms {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: clamp(1rem, 2.7vw, 2.7rem);
            width: min(100%, 1280px);
            margin: 0 auto;
            align-items: start;
          }

          .eso-room {
            min-width: 0;
            --room-glow: #fff;
            --room-rgb: 255,255,255;
          }

          .eso-room__portal {
            position: relative;
            display: block;
            width: 100%;
            aspect-ratio: 1.42 / 1;
            padding: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            cursor: pointer;
            isolation: isolate;
            -webkit-tap-highlight-color: transparent;
            outline: none;
          }

          .eso-room__outer-frame {
            position: absolute;
            inset: 0;
            z-index: 0;
            border: 1px solid rgba(var(--room-rgb), .48);
            background: linear-gradient(135deg, rgba(var(--room-rgb), .055), transparent 20%, transparent 80%, rgba(var(--room-rgb), .05));
            box-shadow:
              0 0 0 1px rgba(var(--room-rgb), .07),
              0 0 18px rgba(var(--room-rgb), .075),
              inset 0 0 18px rgba(var(--room-rgb), .07);
            transition: box-shadow .55s ease, border-color .55s ease, inset .55s ease;
          }

          .eso-room__frame-shadow {
            position: absolute;
            inset: 8px;
            z-index: 1;
            border: 1px solid rgba(var(--room-rgb), .24);
            box-shadow: inset 0 0 22px rgba(0,0,0,.8);
            pointer-events: none;
            transition: inset .55s cubic-bezier(.2,.75,.2,1), border-color .55s ease;
          }

          .eso-room__inner-frame {
            position: absolute;
            inset: 14px;
            z-index: 2;
            border: 1px solid rgba(var(--room-rgb), .24);
            pointer-events: none;
            transition: inset .55s cubic-bezier(.2,.75,.2,1), border-color .55s ease;
          }

          .eso-room__scene {
            position: absolute;
            inset: 15px;
            z-index: 1;
            display: block;
            overflow: hidden;
            background: #080909;
            box-shadow: inset 0 0 50px #000;
          }

          .eso-room__video {
            position: absolute;
            inset: 0;
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            filter: brightness(.62) contrast(1.08) saturate(.72);
            transform: scale(1.025);
            transition: filter .8s ease, transform 1.1s cubic-bezier(.2,.7,.2,1);
          }

          .eso-room__scene-shade {
            position: absolute;
            inset: 0;
            background:
              linear-gradient(180deg, rgba(0,0,0,.18), transparent 35%, rgba(0,0,0,.42)),
              linear-gradient(90deg, rgba(0,0,0,.22), transparent 18%, transparent 82%, rgba(0,0,0,.22));
            box-shadow: inset 0 0 35px rgba(0,0,0,.7);
            pointer-events: none;
          }

          .eso-room__scanline {
            position: absolute;
            inset: 0;
            opacity: .1;
            background: repeating-linear-gradient(180deg, transparent 0, transparent 3px, rgba(255,255,255,.045) 4px);
            mix-blend-mode: screen;
            pointer-events: none;
          }

          .eso-room__corner {
            position: absolute;
            width: 17px;
            height: 17px;
            opacity: .55;
            border-color: var(--room-glow);
            border-style: solid;
            filter: drop-shadow(0 0 3px rgba(var(--room-rgb), .35));
            transition: width .55s ease, height .55s ease, opacity .55s ease;
          }
          .eso-room__corner--tl { top: 8px; left: 8px; border-width: 1px 0 0 1px; }
          .eso-room__corner--tr { top: 8px; right: 8px; border-width: 1px 1px 0 0; }
          .eso-room__corner--bl { bottom: 8px; left: 8px; border-width: 0 0 1px 1px; }
          .eso-room__corner--br { bottom: 8px; right: 8px; border-width: 0 1px 1px 0; }

          .eso-room__index {
            position: absolute;
            top: 1rem;
            left: 1rem;
            color: rgba(255,255,255,.58);
            font: 500 .58rem/1 var(--font-body, ui-sans-serif, sans-serif);
            letter-spacing: .2em;
            text-shadow: 0 1px 8px #000;
          }

          .eso-room__open-mark {
            position: absolute;
            right: 1rem;
            bottom: .8rem;
            color: var(--room-glow);
            font-size: 1.15rem;
            opacity: 0;
            transform: translate(-4px, 4px);
            transition: opacity .45s ease, transform .45s ease;
            text-shadow: 0 0 8px rgba(var(--room-rgb), .35);
          }

          .eso-room__portal:hover .eso-room__outer-frame,
          .eso-room.is-hovered .eso-room__outer-frame,
          .eso-room__portal:focus-visible .eso-room__outer-frame {
            border-color: var(--room-glow);
            box-shadow:
              0 0 0 1px rgba(var(--room-rgb), .24),
              0 0 24px rgba(var(--room-rgb), .16),
              0 0 48px rgba(var(--room-rgb), .055),
              inset 0 0 20px rgba(var(--room-rgb), .09);
          }

          .eso-room__portal:hover .eso-room__frame-shadow,
          .eso-room.is-hovered .eso-room__frame-shadow { inset: 5px; border-color: rgba(var(--room-rgb), .55); }

          .eso-room__portal:hover .eso-room__inner-frame,
          .eso-room.is-hovered .eso-room__inner-frame { inset: 11px; border-color: rgba(var(--room-rgb), .58); }

          .eso-room__portal:hover .eso-room__video,
          .eso-room.is-hovered .eso-room__video,
          .eso-room__portal:focus-visible .eso-room__video {
            filter: brightness(.78) contrast(1.1) saturate(.86);
            transform: scale(1.075);
          }

          .eso-room__portal:hover .eso-room__open-mark,
          .eso-room.is-hovered .eso-room__open-mark,
          .eso-room__portal:focus-visible .eso-room__open-mark {
            opacity: 1;
            transform: translate(0, 0);
          }

          .eso-room__portal:focus-visible {
            outline: 1px solid var(--room-glow);
            outline-offset: 7px;
          }

          .eso-room__copy {
            position: relative;
            text-align: center;
            padding: clamp(1.25rem, 2.1vw, 2rem) .35rem 0;
          }

          .eso-room__name-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: clamp(.45rem, 1vw, 1rem);
          }

          .eso-room__name-row h2 {
            margin: 0;
            color: #f6f2ed;
            font-family: var(--font-display, Georgia, 'Times New Roman', serif);
            font-size: clamp(.78rem, 1.15vw, 1.08rem);
            font-weight: 300;
            letter-spacing: .24em;
            line-height: 1.5;
            white-space: nowrap;
            transition: color .4s ease, text-shadow .4s ease;
          }

          .eso-room.is-hovered .eso-room__name-row h2 {
            color: var(--room-glow);
            text-shadow: 0 0 14px rgba(var(--room-rgb), .13);
          }

          .eso-room__dash {
            width: clamp(.65rem, 1.5vw, 1.5rem);
            height: 1px;
            flex: 0 0 auto;
            background: rgba(var(--room-rgb), .58);
            opacity: .75;
          }

          .eso-room__tagline {
            margin: .8rem 0 0;
            color: rgba(244, 240, 235, .82);
            font: 500 clamp(.53rem, .68vw, .64rem)/1.7 var(--font-body, ui-sans-serif, sans-serif);
            letter-spacing: .2em;
          }

          .eso-room__description {
            margin: .35rem 0 0;
            color: rgba(225, 225, 230, .48);
            font: 400 clamp(.58rem, .68vw, .68rem)/1.6 var(--font-body, ui-sans-serif, sans-serif);
            letter-spacing: .045em;
          }

          .eso-enter {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: .75rem;
            margin-top: 1.15rem;
            padding: .45rem .25rem;
            border: 0;
            border-bottom: 1px solid transparent;
            color: rgba(255,255,255,.58);
            background: transparent;
            font: 600 .61rem/1.4 var(--font-body, ui-sans-serif, sans-serif);
            letter-spacing: .28em;
            text-transform: uppercase;
            cursor: pointer;
            transition: color .35s ease, border-color .35s ease;
          }

          .eso-enter:hover,
          .eso-enter:focus-visible,
          .eso-room.is-hovered .eso-enter {
            color: var(--room-glow);
            border-bottom-color: rgba(var(--room-rgb), .48);
            outline: none;
          }

          .eso-enter__arrow {
            display: inline-block;
            font-size: 1rem;
            letter-spacing: 0;
            transition: transform .35s ease;
          }
          .eso-enter:hover .eso-enter__arrow,
          .eso-room.is-hovered .eso-enter__arrow { transform: translateX(4px); }

          .eso-footer {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: clamp(.75rem, 2vw, 1.5rem);
            width: min(100%, 520px);
            margin: clamp(2.5rem, 6vh, 4.5rem) auto 0;
          }

          .eso-footer p {
            margin: 0;
            color: rgba(239, 235, 230, .54);
            font: 500 .62rem/1.5 var(--font-body, ui-sans-serif, sans-serif);
            letter-spacing: .22em;
            text-align: center;
            white-space: nowrap;
          }

          .eso-footer__line {
            width: clamp(1.25rem, 5vw, 4rem);
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,.22));
          }
          .eso-footer__line:last-child { transform: rotate(180deg); }

          @media (min-width: 1500px) {
            .eso-home { padding-top: 3vh; }
            .eso-hero { margin-bottom: 3vh; }
            .eso-room__portal { aspect-ratio: 1.48 / 1; }
          }

          @media (max-width: 900px) {
            .eso-home { padding-top: 1.75rem; }
            .eso-hero { margin-bottom: 1.8rem; }
            .eso-rooms { gap: 1.1rem; }
            .eso-room__scene { inset: 11px; }
            .eso-room__frame-shadow { inset: 6px; }
            .eso-room__inner-frame { inset: 10px; }
            .eso-room__name-row h2 { letter-spacing: .16em; }
            .eso-room__dash { display: none; }
            .eso-room__tagline { letter-spacing: .1em; }
          }

          @media (max-width: 640px) {
            .eso-home {
              min-height: calc(100vh - 4rem);
              padding: 2.25rem 1.15rem 2rem;
            }
            .eso-hero { margin-bottom: 2rem; }
            .eso-greeting { margin-bottom: 1rem; font-size: .56rem; }
            .eso-eyebrow { letter-spacing: .3em; }
            .eso-title {
              max-width: 100%;
              font-size: clamp(2.15rem, 9vw, 3.2rem);
              letter-spacing: .045em;
            }
            .eso-rooms {
              grid-template-columns: minmax(0, 1fr);
              width: min(100%, 520px);
              gap: 2.4rem;
            }
            .eso-room__portal { aspect-ratio: 1.5 / 1; }
            .eso-room__scene { inset: 13px; }
            .eso-room__frame-shadow { inset: 7px; }
            .eso-room__inner-frame { inset: 11px; }
            .eso-room__copy { padding-top: 1.15rem; }
            .eso-room__name-row h2 { font-size: 1.08rem; letter-spacing: .22em; }
            .eso-room__dash { display: block; width: 1rem; }
            .eso-room__tagline { margin-top: .45rem; font-size: .66rem; }
            .eso-room__description { font-size: .72rem; }
            .eso-enter { margin-top: .65rem; }
            .eso-footer { margin-top: 2.8rem; }
            .eso-footer p { font-size: .55rem; letter-spacing: .12em; }
          }

          @media (prefers-reduced-motion: reduce) {
            .eso-room__outer-frame,
            .eso-room__frame-shadow,
            .eso-room__inner-frame,
            .eso-room__video,
            .eso-room__corner,
            .eso-room__open-mark,
            .eso-enter,
            .eso-enter__arrow {
              transition: none !important;
            }
          }
        `}</style>
      </Layout>
    </PageTransition>
  );
}

export default Home;