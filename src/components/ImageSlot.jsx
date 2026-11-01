import React, { useEffect, useRef, useState } from 'react';

// Static port of Claude Design's <image-slot>: the image is sized from a
// cover/contain baseline times the view scale `s`, then panned by x/y
// (percent of the frame, clamped to the overflow) so crops match the design.
export default function ImageSlot({ src, fit = 'cover', view, radius = 0, transparent = false, alt = '' }) {
  const hostRef = useRef(null);
  const [frame, setFrame] = useState(null);
  const [natural, setNatural] = useState(null);

  useEffect(() => {
    const el = hostRef.current;
    const ro = new ResizeObserver(() => setFrame({ fw: el.clientWidth, fh: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const contain = fit === 'contain';
  let imgStyle = { width: '100%', height: '100%', left: '50%', top: '50%', objectFit: contain ? 'contain' : 'cover' };
  if (frame && natural && frame.fw && frame.fh) {
    const { fw, fh } = frame, { iw, ih } = natural;
    const s = Math.max(1, Math.min(5, view?.s ?? 1));
    const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
    const k = base * s;
    const mx = Math.max(0, (iw * k / fw - 1) * 50), my = Math.max(0, (ih * k / fh - 1) * 50);
    const x = Math.max(-mx, Math.min(mx, view?.x ?? 0)), y = Math.max(-my, Math.min(my, view?.y ?? 0));
    imgStyle = { width: iw * k / fw * 100 + '%', height: ih * k / fh * 100 + '%', left: 50 + x + '%', top: 50 + y + '%' };
  }

  return (
    <div ref={hostRef} style={{ display: 'block', position: 'relative', width: '100%', height: '100%', aspectRatio: '3/2' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: radius, background: transparent ? 'transparent' : 'rgba(127,127,127,.08)' }}>
        <img
          src={src}
          alt={alt}
          draggable={false}
          onLoad={e => setNatural({ iw: e.currentTarget.naturalWidth, ih: e.currentTarget.naturalHeight })}
          style={{ position: 'absolute', maxWidth: 'none', transform: 'translate(-50%,-50%)', userSelect: 'none', display: 'block', ...imgStyle }}
        />
      </div>
    </div>
  );
}
