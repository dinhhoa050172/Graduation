import React, { useEffect, useState } from 'react';
import ImageSlot from './ImageSlot.jsx';
import { EVENT } from '../theme.js';

const BG = '#5A0A0E', DARK = '#3A0609', CREAM = '#F6EBDD', MUTED = '#EBD9CF', RED = '#C4161C';
const OSWALD = "'Oswald', sans-serif", SCRIPT = "'Dancing Script', cursive";

// Khung ảnh (s = zoom, x/y = dịch % khung) giữ nguyên như đã chỉnh trong Claude Design.
const IMG = import.meta.env.BASE_URL + 'images/';
const PHOTOS = {
  main: { src: IMG + 'anh-chinh.webp', view: { s: 1.0975013465468504, x: 4.875067327342519, y: 31.08666992121646 } },
  strip: [
    { src: IMG + 'anh-1.webp', view: { s: 1, x: 0, y: 60.98519376978173 } },
    { src: IMG + 'anh-2.webp', view: { s: 1, x: 0, y: 40.052418646909665 } },
    { src: IMG + 'anh-3.webp', view: { s: 1, x: 0, y: 25.483362560767166 } },
    { src: IMG + 'anh-4.webp', view: { s: 1, x: 0, y: 0 } },
  ],
  diploma: { src: IMG + 'hoa-cam-bang.png' },
};

const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(EVENT.place);

// Trên điện thoại, mở thẳng app Google Maps (Android) hoặc Google/Apple Maps (iOS).
function openMap(e) {
  const q = encodeURIComponent(EVENT.place);
  const ua = navigator.userAgent || '';
  const isAndroid = /Android/i.test(ua), isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!isAndroid && !isIOS) return;
  e.preventDefault();
  if (isAndroid) {
    location.href = 'intent://maps.google.com/maps?q=' + q + '#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url=' + encodeURIComponent(MAP_URL) + ';end';
    return;
  }
  let left = false;
  const onHide = () => { left = true; };
  document.addEventListener('visibilitychange', onHide, { once: true });
  location.href = 'comgooglemaps://?q=' + q;
  setTimeout(() => { document.removeEventListener('visibilitychange', onHide); if (!left && !document.hidden) location.href = 'https://maps.apple.com/?q=' + q; }, 1200);
}

function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const iv = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(iv); }, []);
  const diff = Math.max(0, target - now), pad = n => String(n).padStart(2, '0');
  return [
    [pad(Math.floor(diff / 864e5)), 'ngày'],
    [pad(Math.floor(diff / 36e5) % 24), 'giờ'],
    [pad(Math.floor(diff / 6e4) % 60), 'phút'],
    [pad(Math.floor(diff / 1e3) % 60), 'giây'],
  ];
}

function Marquee() {
  const items = [];
  for (let i = 0; i < 12; i++) {
    items.push(
      <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18, paddingRight: 18 }}>
        <span>GRADUATE</span><span style={{ color: '#E0262B', fontSize: 20 }}>✱</span>
      </span>
    );
  }
  return <div style={{ display: 'flex', whiteSpace: 'nowrap', fontFamily: OSWALD, fontWeight: 600, fontSize: 22, letterSpacing: '.04em', color: CREAM, animation: 'gm-marq 18s linear infinite' }}>{items}</div>;
}

const stitches = { position: 'absolute', left: 0, right: 0, pointerEvents: 'none', height: 9, background: 'repeating-linear-gradient(90deg, #E8DCCB 0 9px, transparent 9px 20px)', opacity: .85 };

export default function LetterScreen({ onReplay }) {
  const countdown = useCountdown(EVENT.target);

  return (
    <div className="no-scrollbar" style={{ position: 'absolute', inset: 0, overflowY: 'auto', background: BG, color: CREAM, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: BG }}>
        <div style={{ height: 46, background: DARK, overflow: 'hidden', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 3 }}><Marquee /></div>

        <div style={{ position: 'relative', height: 440 }}>
          <div style={{ position: 'absolute', inset: 0 }}><ImageSlot {...PHOTOS.main} alt="Mai Nguyễn Đình Hòa" /></div>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(180deg, rgba(58,6,9,.18) 0%, rgba(90,10,14,0) 22%, rgba(90,10,14,0) 62%, ${BG} 100%)` }} />
          <div style={{ position: 'absolute', left: 20, top: 26, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pointerEvents: 'none' }}>
            <div style={{ padding: '6px 16px 4px', background: '#F4C6C6', color: DARK, fontFamily: OSWALD, fontWeight: 600, fontSize: 34, letterSpacing: '.04em', lineHeight: 1.1 }}>07 . 11 . 2026</div>
            <div style={{ margin: '16px 0 0 14px', fontFamily: SCRIPT, fontWeight: 700, fontSize: 46, lineHeight: 1, color: CREAM, transform: 'rotate(-8deg)', transformOrigin: '0 50%', textShadow: `2px 2px 0 ${DARK}, -1px -1px 0 ${DARK}, 1px -1px 0 ${DARK}, -1px 1px 0 ${DARK}` }}>Graduation Day</div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, margin: '-78px -40px 0', height: 150, transform: 'rotate(-5deg)', background: '#160606', boxShadow: '0 18px 30px -12px rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', boxSizing: 'border-box' }}>
          <div style={{ ...stitches, top: 7 }} />
          <div style={{ ...stitches, bottom: 7 }} />
          {PHOTOS.strip.map((p, i) => (
            <div key={i} style={{ flex: '0 0 108px', height: 104 }}><ImageSlot {...p} radius={4} alt={`Ảnh ${i + 1}`} /></div>
          ))}
        </div>

        <div style={{ position: 'relative', isolation: 'isolate', textShadow: '0 2px 8px rgba(30,0,3,.85)' }}>
          <div style={{ position: 'absolute', zIndex: -1, right: -26, top: -30, width: '58%', aspectRatio: '2/3', filter: 'drop-shadow(0 18px 30px rgba(20,0,2,.6))', WebkitMaskImage: 'linear-gradient(to bottom, #000 82%, transparent 100%)', maskImage: 'linear-gradient(to bottom, #000 82%, transparent 100%)' }}>
            <ImageSlot {...PHOTOS.diploma} fit="contain" transparent alt="Hòa cầm bằng tốt nghiệp" />
          </div>
          <div style={{ padding: '40px 24px 0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: SCRIPT, fontWeight: 700, fontSize: 64, lineHeight: 1, color: CREAM }}>Dear</div>
            <div style={{ margin: '2px 0 0 44px', maxWidth: '60%', fontFamily: SCRIPT, fontWeight: 700, fontSize: 36, lineHeight: 1.15, color: CREAM, textWrap: 'balance' }}>mọi người,</div>
            <svg width="200" height="18" viewBox="0 0 230 18" style={{ margin: '6px 0 0 4px', overflow: 'visible' }}>
              <path d="M2 12 C 60 4, 140 4, 228 10 M30 15 C 90 9, 150 10, 200 13" fill="none" stroke={CREAM} strokeWidth="1.6" strokeLinecap="round" opacity=".85" />
            </svg>
          </div>
          <div style={{ padding: '22px 24px 0', maxWidth: '62%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 16, lineHeight: 1.5, color: MUTED }}>Trân trọng kính mời bạn đến dự lễ tốt nghiệp của</div>
            <div style={{ fontFamily: OSWALD, fontWeight: 600, fontSize: 34, letterSpacing: '.02em', lineHeight: 1.15, textTransform: 'uppercase' }}>Mai Nguyễn Đình Hòa</div>
            <div style={{ fontSize: 16, lineHeight: 1.5, color: MUTED }}>Kỹ thuật phần mềm · Đại học FPT</div>
          </div>
          <div style={{ margin: '26px 24px 0', display: 'grid', gridTemplateColumns: 'auto 1.5px minmax(0,1fr)', gap: 16, alignItems: 'stretch', fontFamily: OSWALD, fontWeight: 500, textTransform: 'uppercase' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', textAlign: 'right' }}>
              <div style={{ fontSize: 22, lineHeight: 1.2 }}>Ngày 07.11.2026</div>
              <div style={{ fontSize: 30, lineHeight: 1.1 }}>12:30</div>
            </div>
            <div style={{ background: CREAM, opacity: .8 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 22, lineHeight: 1.2 }}>Tại: Trường Đại học FPT</div>
              <div style={{ fontSize: 17, lineHeight: 1.3, fontWeight: 400, textTransform: 'none', color: CREAM }}>Lô E2a-7, Đường D1, Khu Công nghệ cao, P. Tăng Nhơn Phú, TP. Hồ Chí Minh</div>
            </div>
          </div>
          <div style={{ padding: '26px 24px 30px', fontFamily: SCRIPT, fontWeight: 600, fontSize: 26, lineHeight: 1.35, textAlign: 'center', textWrap: 'balance' }}>Cảm ơn vì đã là một phần trong hành trình của mình. Mong ngày ấy có mọi người bên cạnh &lt;3</div>
        </div>

        <div style={{ margin: '30px 24px 0', padding: '16px 0', borderTop: '1px solid rgba(246,235,221,.35)', borderBottom: '1px solid rgba(246,235,221,.35)', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', textAlign: 'center' }}>
          {countdown.map(([value, label]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontFamily: OSWALD, fontWeight: 600, fontSize: 36, lineHeight: 1.1 }}>{value}</div>
              <div style={{ fontSize: 14, color: MUTED }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '28px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <a href={MAP_URL} target="_blank" rel="noopener" onClick={openMap} className="press-scale" style={{ minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${CREAM}`, borderRadius: 4, color: CREAM, textDecoration: 'none', fontFamily: OSWALD, fontSize: 17, fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase' }}>Xem bản đồ</a>
          </div>
        </div>

        <div style={{ padding: '26px 24px 0', fontSize: 16, color: MUTED }}>
          <a href="tel:0364034627" style={{ color: 'inherit', textDecoration: 'none' }}>Gọi mình nhaaa: 0364034627</a>
        </div>
        <button onClick={onReplay} style={{ margin: '10px 24px 0', alignSelf: 'flex-start', minHeight: 44, padding: 0, border: 'none', background: 'none', color: MUTED, fontFamily: 'inherit', fontSize: 14, textDecoration: 'underline', cursor: 'pointer' }}>Xem lại hiệu ứng mở thư</button>

        <div style={{ marginTop: 22, height: 56, background: RED, display: 'flex', alignItems: 'center', gap: 16, padding: '0 22px', fontFamily: OSWALD, fontWeight: 600, fontSize: 22, letterSpacing: '.06em' }}>
          <span>07 . 11</span><div style={{ flex: 1, height: 1.5, background: CREAM, opacity: .8 }} /><span>2026</span>
        </div>
      </div>
    </div>
  );
}
