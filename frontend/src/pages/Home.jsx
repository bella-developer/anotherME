

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
    tagline: 'Put it down.',
    description: 'Confessions, regrets, loneliness, difficult feelings.',
    path: '/rooms/dark',
    gif:
      'https://res.cloudinary.com/dbtm7etag/image/upload/v1792502428/converted_twbyo4.gif',
    glowColor: '#B44A4A',
    glowRGB: '180, 74, 74',
    number: '01',
  },
  {
    id: 'fantasy',
    name: 'FANTASY ROOM',
    tagline: 'Let your mind wander.',
    description: 'Daydreams, imaginary worlds, creative expression.',
    path: '/rooms/fantasy',
    gif:
      'https://res.cloudinary.com/dbtm7etag/image/upload/v1792502433/converted_1_ik5xbs.gif',
    glowColor: '#DB762E',
    glowRGB: '219, 118, 46',
    number: '02',
  },
  {
    id: 'philo',
    name: 'PHILO ROOM',
    tagline: 'Think freely.',
    description: 'Uncomfortable questions, unconventional beliefs.',
    path: '/rooms/philo',
    gif:
      'https://res.cloudinary.com/dbtm7etag/image/upload/v1792502429/converted_2_neetec.gif',
    glowColor: '#7771D9',
    glowRGB: '119, 113, 217',
    number: '03',
  },
];

function Home() {
  usePageTitle('Home');

  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const reduceMotion = useReducedMotion();

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
            <motion.h1
              id="eso-page-title"
              className="eso-title font-mono"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              your safe space
            </motion.h1>
            <motion.p
              className="text-xs sm:text-sm text-[#928B91] font-mono tracking-wide mt-2"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              for thoughts that don't fit anywhere
            </motion.p>
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

                  <span className="eso-room__scene">
                    <img
                      src={room.gif}
                      alt={room.name}
                      className="eso-room__video"
                      loading="lazy"
                      decoding="async"
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      aria-hidden="true"
                    />
                    <span className="eso-room__scene-shade" aria-hidden="true" />
                  </span>
                </button>

                <div className="eso-room__copy">
                  <div className="eso-room__name-row">
                    <h2>{room.name}</h2>
                  </div>
                  <button
                    type="button"
                    className="eso-enter"
                    onClick={() => navigate(room.path)}
                    onMouseEnter={() => setHovered(room.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <span>Enter room</span>
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
            <p>This is your space. Take your time.</p>
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
            z-index: 2;
            border: 1px solid rgba(var(--room-rgb), .35);
            pointer-events: none;
            transition: box-shadow .55s ease, border-color .55s ease;
          }

          .eso-room__scene {
            position: absolute;
            inset: 0;
            z-index: 1;
            display: block;
            overflow: hidden;
            background: #080909;
            box-shadow: inset 0 0 40px #000;
          }

          .eso-room__video {
            position: absolute;
            inset: 0;
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            filter: brightness(.68) contrast(1.08) saturate(.75);
            transform: scale(1.01);
            transition: filter .8s ease, transform 1.1s cubic-bezier(.2,.7,.2,1);
          }

          .eso-room__scene-shade {
            position: absolute;
            inset: 0;
            background:
              linear-gradient(180deg, rgba(0,0,0,.15), transparent 40%, rgba(0,0,0,.45)),
              linear-gradient(90deg, rgba(0,0,0,.2), transparent 15%, transparent 85%, rgba(0,0,0,.2));
            box-shadow: inset 0 0 30px rgba(0,0,0,.7);
            pointer-events: none;
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

          .eso-enter {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-top: 1rem;
            padding: .45rem .75rem;
            border: 0;
            border-bottom: 1px solid transparent;
            color: rgba(255,255,255,.58);
            background: transparent;
            font: 600 .61rem/1.4 var(--font-body, ui-sans-serif, sans-serif);
            letter-spacing: .28em;
            text-transform: uppercase;
            cursor: pointer;
            transition: color .35s ease, border-bottom-color .35s ease;
          }

          .eso-enter:hover,
          .eso-enter:focus-visible,
          .eso-room.is-hovered .eso-enter {
            color: var(--room-glow);
            border-bottom-color: rgba(var(--room-rgb), .48);
            outline: none;
          }

          .eso-footer {
            display: flex;
            align-items: center;
            justify-content: center;
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
          }

          @media (max-width: 640px) {
            .eso-home {
              min-height: calc(100vh - 4rem);
              padding: 2.25rem 1.15rem 2rem;
            }
            .eso-hero { margin-bottom: 2rem; }
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
            .eso-enter {
              transition: none !important;
            }
          }
        `}</style>
      </Layout>
    </PageTransition>
  );
}

export default Home;