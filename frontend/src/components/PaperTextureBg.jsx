/**
 * PaperTextureBg — Architectural plaster texture as SVG
 * All layers baked into a single performant SVG
 * No pure whites or blacks - compressed contrast range
 */

export default function PaperTextureBg() {
  return (
    <>
      <div
        aria-hidden="true"
        className="paper-texture-bg"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1000 1000'%3E%3Cdefs%3E%3Cfilter id='paperTexture'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' seed='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.08'/%3E%3C/feComponentTransfer%3E%3CfeGaussianBlur stdDeviation='0.4'/%3E%3C/filter%3E%3Cfilter id='filmGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' seed='7'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.025'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3CradialGradient id='softLight' cx='50%25' cy='30%25' r='60%25'%3E%3Cstop offset='0%25' style='stop-color:%23E9E5DD;stop-opacity:0.12'/%3E%3Cstop offset='100%25' style='stop-color:%23D7D2CA;stop-opacity:0'/%3E%3C/radialGradient%3E%3ClinearGradient id='diagonalShadow' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23B9B2A8;stop-opacity:0'/%3E%3Cstop offset='30%25' style='stop-color:%23B9B2A8;stop-opacity:0.15'/%3E%3Cstop offset='60%25' style='stop-color:%23A49D94;stop-opacity:0.08'/%3E%3Cstop offset='100%25' style='stop-color:%23D7D2CA;stop-opacity:0'/%3E%3C/linearGradient%3E%3CradialGradient id='colorClouds1' cx='20%25' cy='30%25' r='45%25'%3E%3Cstop offset='0%25' style='stop-color:%23DDD7CF;stop-opacity:0.06'/%3E%3Cstop offset='100%25' style='stop-color:%23D7D2CA;stop-opacity:0'/%3E%3C/radialGradient%3E%3CradialGradient id='colorClouds2' cx='80%25' cy='70%25' r='40%25'%3E%3Cstop offset='0%25' style='stop-color:%23CFC9C0;stop-opacity:0.05'/%3E%3Cstop offset='100%25' style='stop-color:%23D7D2CA;stop-opacity:0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23D7D2CA'/%3E%3Crect width='100%25' height='100%25' fill='url(%23colorClouds1)'/%3E%3Crect width='100%25' height='100%25' fill='url(%23colorClouds2)'/%3E%3Crect width='100%25' height='100%25' filter='url(%23paperTexture)' opacity='0.12'/%3E%3Crect width='100%25' height='100%25' filter='url(%23filmGrain)' opacity='1'/%3E%3Crect width='100%25' height='100%25' fill='url(%23softLight)'/%3E%3Crect width='100%25' height='100%25' fill='url(%23diagonalShadow)'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </>
  );
}
