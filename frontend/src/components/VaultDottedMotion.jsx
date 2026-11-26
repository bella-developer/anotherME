import PropTypes from 'prop-types';

/**
 * VaultDottedMotion
 * Renders bespoke tiny dotted motion graphics tailored to each sticky note's theme and mood.
 */
function VaultDottedMotion({ frameId }) {
  const renderScene = () => {
    switch (frameId) {
      case 'welcome': // MOMENTS — expanding hexagonal ripple around core dot
        return (
          <g className="vdm-spin-slow">
            <circle cx="12" cy="12" r="1.7" fill="#FFB469" />
            {[
              [12, 5.2, '0s'],
              [17.9, 8.6, '0.25s'],
              [17.9, 15.4, '0.5s'],
              [12, 18.8, '0.75s'],
              [6.1, 15.4, '1s'],
              [6.1, 8.6, '1.25s'],
            ].map(([cx, cy, delay], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="1.25"
                fill="#FF7A1A"
                className="vdm-pulse"
                style={{ animationDelay: delay }}
              />
            ))}
          </g>
        );

      case 'dark-confession': // CONFESSION — ascending ember dots lifting upward
        return (
          <g>
            <circle cx="8" cy="18.5" r="1.15" fill="#B42323" opacity="0.65" />
            <circle cx="12" cy="19" r="1.35" fill="#E02424" />
            <circle cx="16" cy="18.5" r="1.15" fill="#B42323" opacity="0.65" />
            {[
              [8.5, 14.5, '1.2', '#E02424', '0s'],
              [12, 13.5, '1.4', '#FF5A5A', '0.45s'],
              [15.5, 15, '1.1', '#E02424', '0.9s'],
              [10.5, 9.5, '1.0', '#FF7878', '1.35s'],
              [14, 8.5, '0.95', '#FF5A5A', '1.8s'],
            ].map(([cx, cy, r, fill, delay], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
                className="vdm-rise"
                style={{ animationDelay: delay }}
              />
            ))}
          </g>
        );

      case 'dark-understanding': // UNDERSTANDING — two mirrored dot arcs converging at center
        return (
          <g>
            <circle cx="12" cy="12" r="1.65" fill="#E7DED5" className="vdm-pulse" />
            <g className="vdm-converge-left">
              <circle cx="6.2" cy="8.2" r="1.15" fill="#E02424" />
              <circle cx="5.2" cy="12" r="1.3" fill="#FF5A5A" />
              <circle cx="6.2" cy="15.8" r="1.15" fill="#E02424" />
            </g>
            <g className="vdm-converge-right">
              <circle cx="17.8" cy="8.2" r="1.15" fill="#857BFF" />
              <circle cx="18.8" cy="12" r="1.3" fill="#A99EFF" />
              <circle cx="17.8" cy="15.8" r="1.15" fill="#857BFF" />
            </g>
          </g>
        );

      case 'fantasy-daydream': // IMAGINATION — drifting spiral constellation
        return (
          <g className="vdm-spin-reverse">
            <circle cx="12" cy="12" r="1.5" fill="#FFD27D" />
            {[
              [12, 6.2, 1.15, '#FF7A1A', '0s'],
              [16.2, 7.8, 0.95, '#FFB469', '0.3s'],
              [18, 12.2, 1.25, '#FF7A1A', '0.6s'],
              [15.4, 16.8, 1.0, '#FFD27D', '0.9s'],
              [10.2, 17.6, 1.2, '#FF7A1A', '1.2s'],
              [6.4, 14.5, 0.9, '#FFB469', '1.5s'],
              [6.8, 8.8, 1.1, '#FF7A1A', '1.8s'],
            ].map(([cx, cy, r, fill, delay], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
                className="vdm-twinkle"
                style={{ animationDelay: delay }}
              />
            ))}
          </g>
        );

      case 'fantasy-vibes': // VIBES — harmonic dotted wave columns
        return (
          <g>
            {[
              { x: 5.5, delay: '0s', color: '#FF7A1A' },
              { x: 9.8, delay: '0.22s', color: '#FFA559' },
              { x: 14.2, delay: '0.44s', color: '#FF7A1A' },
              { x: 18.5, delay: '0.66s', color: '#FFD27D' },
            ].map((col, idx) => (
              <g key={idx} className="vdm-wave" style={{ animationDelay: col.delay }}>
                <circle cx={col.x} cy="8.5" r="1.1" fill={col.color} opacity="0.6" />
                <circle cx={col.x} cy="12" r="1.25" fill={col.color} />
                <circle cx={col.x} cy="15.5" r="1.1" fill={col.color} opacity="0.6" />
              </g>
            ))}
          </g>
        );

      case 'philo-questioning': // QUESTIONING — dotted inquiry arc & oscillating pendulum dot
        return (
          <g>
            {[
              [8.4, 7.8, '0s', '#857BFF'],
              [10.8, 5.8, '0.2s', '#A99EFF'],
              [14.2, 6.0, '0.4s', '#857BFF'],
              [15.8, 8.6, '0.6s', '#A99EFF'],
              [13.6, 11.4, '0.8s', '#857BFF'],
              [12, 13.8, '1s', '#E02424'],
            ].map(([cx, cy, delay, fill], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="1.15"
                fill={fill}
                className="vdm-twinkle"
                style={{ animationDelay: delay }}
              />
            ))}
            <circle cx="12" cy="18.2" r="1.5" fill="#E02424" className="vdm-pendulum" />
          </g>
        );

      case 'philo-truth': // TRUTH — diamond north-star focus matrix
      default:
        return (
          <g>
            <circle cx="12" cy="12" r="1.65" fill="#F5EFE8" />
            <g className="vdm-focus-v">
              <circle cx="12" cy="5.2" r="1.25" fill="#FF7A1A" />
              <circle cx="12" cy="18.8" r="1.25" fill="#FF7A1A" />
            </g>
            <g className="vdm-focus-h">
              <circle cx="5.2" cy="12" r="1.25" fill="#FF7A1A" />
              <circle cx="18.8" cy="12" r="1.25" fill="#FF7A1A" />
            </g>
            {[
              [8.4, 8.4, '0s'],
              [15.6, 8.4, '0.35s'],
              [15.6, 15.6, '0.7s'],
              [8.4, 15.6, '1.05s'],
            ].map(([cx, cy, delay], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="0.95"
                fill="#FFB469"
                className="vdm-twinkle"
                style={{ animationDelay: delay }}
              />
            ))}
          </g>
        );
    }
  };

  return (
    <>
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        className="overflow-visible"
        aria-hidden="true"
      >
        {renderScene()}
      </svg>

      <style>{`
        .vdm-spin-slow,
        .vdm-spin-reverse,
        .vdm-pulse,
        .vdm-rise,
        .vdm-converge-left,
        .vdm-converge-right,
        .vdm-twinkle,
        .vdm-wave,
        .vdm-pendulum,
        .vdm-focus-v,
        .vdm-focus-h {
          transform-box: fill-box;
          transform-origin: center;
        }

        .vdm-spin-slow { animation: vdmSpin 14s linear infinite; }
        .vdm-spin-reverse { animation: vdmSpinReverse 18s linear infinite; }
        .vdm-pulse { animation: vdmPulse 2.4s ease-in-out infinite; }
        .vdm-rise { animation: vdmRise 2.6s ease-in-out infinite; }
        .vdm-converge-left { animation: vdmConvergeL 2.8s ease-in-out infinite; }
        .vdm-converge-right { animation: vdmConvergeR 2.8s ease-in-out infinite; }
        .vdm-twinkle { animation: vdmTwinkle 2.2s ease-in-out infinite; }
        .vdm-wave { animation: vdmWave 1.6s ease-in-out infinite; }
        .vdm-pendulum { animation: vdmPendulum 2.4s ease-in-out infinite; }
        .vdm-focus-v { animation: vdmFocusV 2.5s ease-in-out infinite; }
        .vdm-focus-h { animation: vdmFocusH 2.5s ease-in-out infinite; }

        @keyframes vdmSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes vdmSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes vdmPulse {
          0%, 100% { opacity: 0.45; transform: scale(0.82); }
          50% { opacity: 1; transform: scale(1.22); }
        }
        @keyframes vdmRise {
          0% { opacity: 0.15; transform: translateY(3px) scale(0.8); }
          50% { opacity: 1; transform: translateY(0px) scale(1.1); }
          100% { opacity: 0.15; transform: translateY(-4px) scale(0.75); }
        }
        @keyframes vdmConvergeL {
          0%, 100% { transform: translateX(0px); opacity: 0.7; }
          50% { transform: translateX(2.2px); opacity: 1; }
        }
        @keyframes vdmConvergeR {
          0%, 100% { transform: translateX(0px); opacity: 0.7; }
          50% { transform: translateX(-2.2px); opacity: 1; }
        }
        @keyframes vdmTwinkle {
          0%, 100% { opacity: 0.35; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes vdmWave {
          0%, 100% { transform: translateY(1.8px); opacity: 0.65; }
          50% { transform: translateY(-1.8px); opacity: 1; }
        }
        @keyframes vdmPendulum {
          0%, 100% { transform: translateX(-2.2px); opacity: 0.75; }
          50% { transform: translateX(2.2px); opacity: 1; }
        }
        @keyframes vdmFocusV {
          0%, 100% { transform: scaleY(1.12); opacity: 0.7; }
          50% { transform: scaleY(0.84); opacity: 1; }
        }
        @keyframes vdmFocusH {
          0%, 100% { transform: scaleX(1.12); opacity: 0.7; }
          50% { transform: scaleX(0.84); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .vdm-spin-slow,
          .vdm-spin-reverse,
          .vdm-pulse,
          .vdm-rise,
          .vdm-converge-left,
          .vdm-converge-right,
          .vdm-twinkle,
          .vdm-wave,
          .vdm-pendulum,
          .vdm-focus-v,
          .vdm-focus-h {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

VaultDottedMotion.propTypes = {
  frameId: PropTypes.string.isRequired,
};

export default VaultDottedMotion;
