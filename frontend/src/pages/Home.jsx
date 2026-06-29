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
      img: 'https://images.pexels.com/photos/1647220/pexels-photo-1647220.jpeg?auto=compress&cs=tinysrgb&w=800',
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
      img: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=800',
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
      img: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=800',
      accent: 'rgba(200,180,240,0.12)',
      accentText: '#b8a8d4',
      glowColor: 'rgba(140,120,200,0.12)',
    },
  ];

  return (
    <PageTransition>
      <Layout leftSidebar={null} rightSidebar={null}>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative z-10">

          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-[9px] tracking-[0.35em] text-white/25 uppercase mb-4">Choose Your Room</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.28em] text-white uppercase">
              Your Safe Space.
            </h1>
          </div>

          {/* Room Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => navigate(room.path)}
                onMouseEnter={() => setHovered(room.id)}
                onMouseLeave={() => setHovered(null)}
                className="group relative text-left overflow-hidden focus:outline-none"
                style={{
                  height: '480px',
                  borderRadius: '2px',
                  boxShadow: hovered === room.id
                    ? `0 0 0 1px rgba(255,255,255,0.15), 0 20px 60px rgba(0,0,0,0.8), 0 0 40px ${room.glowColor}`
                    : '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.6)',
                  transition: 'box-shadow 0.6s ease, transform 0.5s ease',
                  transform: hovered === room.id ? 'translateY(-6px)' : 'translateY(0)',
                }}
              >
                {/* Background photo */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('${room.img}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: hovered === room.id ? 'brightness(0.28) saturate(0.6)' : 'brightness(0.18) saturate(0.4)',
                    transform: hovered === room.id ? 'scale(1.06)' : 'scale(1)',
                    transition: 'filter 0.8s ease, transform 0.8s ease',
                  }}
                />

                {/* Atmospheric gradient — heavier at bottom */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.1) 100%)`,
                  }}
                />

                {/* Accent color wash on hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(ellipse at 50% 80%, ${room.accent} 0%, transparent 65%)`,
                    opacity: hovered === room.id ? 1 : 0,
                  }}
                />

                {/* Roman numeral — top right, large watermark */}
                <div
                  className="absolute top-5 right-6 font-light transition-all duration-500"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.3em',
                    color: hovered === room.id ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {room.label}
                </div>

                {/* Thin accent line — left edge, grows on hover */}
                <div
                  className="absolute left-0 top-0 w-px transition-all duration-700"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${room.accentText}, transparent)`,
                    height: hovered === room.id ? '100%' : '30%',
                    top: hovered === room.id ? '0%' : '35%',
                    opacity: hovered === room.id ? 0.6 : 0.2,
                  }}
                />

                {/* Content — pinned to bottom */}
                <div className="absolute inset-x-0 bottom-0 p-8">

                  {/* Tagline — appears on hover */}
                  <div
                    className="transition-all duration-500 overflow-hidden"
                    style={{
                      maxHeight: hovered === room.id ? '30px' : '0',
                      opacity: hovered === room.id ? 1 : 0,
                      marginBottom: hovered === room.id ? '12px' : '0',
                    }}
                  >
                    <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: room.accentText, textTransform: 'uppercase' }}>
                      {room.tagline}
                    </p>
                  </div>

                  {/* Room name */}
                  <h2
                    className="font-light uppercase mb-4 transition-colors duration-400"
                    style={{
                      fontSize: '22px',
                      letterSpacing: '0.2em',
                      color: hovered === room.id ? '#ffffff' : 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {room.name}
                  </h2>

                  {/* Subtitle verbs */}
                  <div className="flex gap-4 mb-5">
                    {room.subtitle.map((line, i) => (
                      <span
                        key={i}
                        className="transition-all duration-300"
                        style={{
                          fontSize: '10px',
                          letterSpacing: '0.12em',
                          color: hovered === room.id ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)',
                          transitionDelay: `${i * 40}ms`,
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>

                  {/* Description — slides in on hover */}
                  <div
                    className="transition-all duration-500 overflow-hidden"
                    style={{
                      maxHeight: hovered === room.id ? '60px' : '0',
                      opacity: hovered === room.id ? 1 : 0,
                      marginBottom: hovered === room.id ? '20px' : '0',
                    }}
                  >
                    <p style={{ fontSize: '11px', lineHeight: '1.7', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
                      {room.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div
                    className="flex items-center gap-3 transition-all duration-400"
                    style={{
                      paddingTop: '16px',
                      borderTop: `1px solid ${hovered === room.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '9px',
                        letterSpacing: '0.28em',
                        textTransform: 'uppercase',
                        color: hovered === room.id ? room.accentText : 'rgba(255,255,255,0.3)',
                        transition: 'color 0.4s ease',
                      }}
                    >
                      Step Inside
                    </span>
                    <span
                      className="transition-all duration-400"
                      style={{
                        color: hovered === room.id ? room.accentText : 'rgba(255,255,255,0.2)',
                        transform: hovered === room.id ? 'translateX(4px)' : 'translateX(0)',
                        fontSize: '12px',
                      }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Ambient footnote */}
          <p className="mt-14 text-[9px] tracking-[0.3em] text-white/15 uppercase">
            No judgment &nbsp;·&nbsp; No performance &nbsp;·&nbsp; Just you
          </p>

        </div>
      </Layout>
    </PageTransition>
  );
}

export default Home;
