import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PageTransition from '../components/PageTransition';
import { usePageTitle } from '../hooks/usePageTitle';

function Home() {
  usePageTitle('Home');
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const rooms = [
    {
      id: 'dark',
      name: 'Dark Room',
      label: 'I',
      tagline: 'The weight of feeling.',
      subtitle: ['Release.', 'Witness.', 'Discharge.'],
      description: 'Where raw emotion finds its voice. No performance. No filter. Just truth.',
      path: '/rooms/dark',
      // deep dark fog, grief, stillness
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735009/darkroom_mf0vxg.png',
      accent: 'rgba(180,140,120,0.15)',
      accentText: '#c4a882',
      glowColor: 'rgba(160,100,80,0.12)',
    },
    {
      id: 'climb',
      name: 'Climb Room',
      label: 'II',
      tagline: 'The hunger to rise.',
      subtitle: ['Build.', 'Sharpen.', 'Progress.'],
      description: 'Ideas sharpened against each other. Growth that demands something of you.',
      path: '/rooms/climb',
      // upward light beam / mountain summit
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735019/climbroom_camkye.png',
      accent: 'rgba(160,90,44,0.18)',
      accentText: '#c47a3a',
      glowColor: 'rgba(160,90,44,0.14)',
    },
    {
      id: 'philo',
      name: 'Philo Room',
      label: 'III',
      tagline: 'The question that stays.',
      subtitle: ['Understand.', 'Reflect.', 'Inquire.'],
      description: 'Thought as practice. Meaning as destination. Silence between the words.',
      path: '/rooms/philo',
      // ancient stone, cosmos, contemplation
      img: 'https://res.cloudinary.com/dbtm7etag/image/upload/v1782735026/philoroom_lazjzx.png',
      accent: 'rgba(200,180,240,0.12)',
      accentText: '#b8a8d4',
      glowColor: 'rgba(140,120,200,0.12)',
    },
  ];

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative z-10">

          {/* Header - more cinematic typography */}
          <div className="text-center mb-20">
            <p className="text-[10px] tracking-[0.25em] text-white/20 uppercase mb-6 font-light">Choose Your Room</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.15em] text-white/95 uppercase">
              Your Safe Space
            </h1>
          </div>

          {/* Room Cards - borderless, atmospheric */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => navigate(room.path)}
                onMouseEnter={() => setHovered(room.id)}
                onMouseLeave={() => setHovered(null)}
                className="group relative text-left overflow-hidden focus:outline-none bg-transparent border-none"
                style={{
                  height: '520px',
                  cursor: 'pointer',
                  transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  transform: hovered === room.id ? 'translateY(-8px)' : 'translateY(0)',
                }}
              >
                {/* Background photo */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('${room.img}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: hovered === room.id ? 'brightness(0.9) contrast(1.05)' : 'brightness(0.7) contrast(0.95)',
                    transform: hovered === room.id ? 'scale(1.05)' : 'scale(1.02)',
                    transition: 'filter 1s ease, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />

                {/* Atmospheric gradient — softer, more natural */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 40%, transparent 75%)`,
                  }}
                />

                {/* Subtle accent wash on hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-1000"
                  style={{
                    background: `radial-gradient(ellipse at 50% 85%, ${room.accent} 0%, transparent 70%)`,
                    opacity: hovered === room.id ? 0.8 : 0,
                  }}
                />

                {/* Roman numeral — subtle watermark */}
                <div
                  className="absolute top-6 right-7 font-light transition-all duration-700"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.35em',
                    color: hovered === room.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                    fontWeight: 300,
                  }}
                >
                  {room.label}
                </div>

                {/* Content — cinematic positioning */}
                <div className="absolute inset-x-0 bottom-0 px-9 pb-10">

                  {/* Tagline — appears smoothly */}
                  <div
                    className="transition-all duration-600 overflow-hidden"
                    style={{
                      maxHeight: hovered === room.id ? '32px' : '0',
                      opacity: hovered === room.id ? 1 : 0,
                      marginBottom: hovered === room.id ? '14px' : '0',
                    }}
                  >
                    <p style={{ 
                      fontSize: '9px', 
                      letterSpacing: '0.22em', 
                      color: room.accentText, 
                      textTransform: 'uppercase',
                      fontWeight: 400,
                    }}>
                      {room.tagline}
                    </p>
                  </div>

                  {/* Room name — better hierarchy */}
                  <h2
                    className="font-light uppercase mb-5 transition-all duration-500"
                    style={{
                      fontSize: '26px',
                      letterSpacing: '0.18em',
                      color: hovered === room.id ? '#ffffff' : 'rgba(255,255,255,0.88)',
                      fontWeight: 300,
                    }}
                  >
                    {room.name}
                  </h2>

                  {/* Subtitle verbs */}
                  <div className="flex gap-5 mb-6">
                    {room.subtitle.map((line, i) => (
                      <span
                        key={i}
                        className="transition-all duration-400"
                        style={{
                          fontSize: '9px',
                          letterSpacing: '0.15em',
                          color: hovered === room.id ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                          transitionDelay: `${i * 50}ms`,
                          fontWeight: 300,
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>

                  {/* Description — refined */}
                  <div
                    className="transition-all duration-600 overflow-hidden"
                    style={{
                      maxHeight: hovered === room.id ? '65px' : '0',
                      opacity: hovered === room.id ? 1 : 0,
                      marginBottom: hovered === room.id ? '22px' : '0',
                    }}
                  >
                    <p style={{ 
                      fontSize: '12px', 
                      lineHeight: '1.75', 
                      color: 'rgba(255,255,255,0.45)', 
                      letterSpacing: '0.02em',
                      fontWeight: 300,
                    }}>
                      {room.description}
                    </p>
                  </div>

                  {/* CTA — minimal, elegant */}
                  <div
                    className="flex items-center gap-3 transition-all duration-500"
                    style={{
                      paddingTop: '18px',
                      borderTop: `1px solid ${hovered === room.id ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '8px',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        color: hovered === room.id ? room.accentText : 'rgba(255,255,255,0.35)',
                        transition: 'color 0.5s ease',
                        fontWeight: 400,
                      }}
                    >
                      Enter
                    </span>
                    <span
                      className="transition-all duration-500"
                      style={{
                        color: hovered === room.id ? room.accentText : 'rgba(255,255,255,0.25)',
                        transform: hovered === room.id ? 'translateX(5px)' : 'translateX(0)',
                        fontSize: '11px',
                      }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Ambient footnote — more refined */}
          <p className="mt-20 text-[8px] tracking-[0.28em] text-white/12 uppercase font-light">
            No judgment &nbsp;·&nbsp; No performance &nbsp;·&nbsp; Just you
          </p>

        </div>
      </Layout>
    </PageTransition>
  );
}

export default Home;
