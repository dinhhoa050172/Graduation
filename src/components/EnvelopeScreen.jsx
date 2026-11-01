import React from 'react';
import { NOISE_BG } from '../theme.js';

const GOLD_TEXT = 'linear-gradient(180deg, #F8E7B0 0%, #E2BC62 45%, #B88A2E 100%)';
const PRESS_MS = 900;

function makeParticles() {
  let seed = 5;
  const r = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const kids = [];
  for (let i = 0; i < 16; i++) {
    const s = 1.5 + r() * 2, d = 10 + r() * 8;
    kids.push(
      <span key={i} style={{
        position: 'absolute', left: r() * 100 + '%', top: 20 + r() * 75 + '%', width: s, height: s, borderRadius: '50%',
        background: i % 3 ? '#E9C46A' : '#F8E7B0', boxShadow: `0 0 6px ${i % 3 ? '#C9972E' : '#F8E7B0'}`, '--o': (.25 + r() * .35).toFixed(2),
        animation: `tp-drift ${d}s linear ${-r() * d}s infinite`,
      }} />
    );
  }
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>{kids}</div>;
}

// Phong thư: nhấn giữ con dấu → vòng sáng chạy → nắp mở → thư trồi lên → chạm thư để mở thiệp.
export default class EnvelopeScreen extends React.Component {
  state = { phase: 'idle', letterUp: false, letterReady: false };
  rootRef = React.createRef(); envRef = React.createRef(); sealRef = React.createRef(); ringRef = React.createRef();
  tx = 0; ty = 0; cx = 0; cy = 0; cs = 1; p = 0; tm = [];
  particles = makeParticles();

  componentDidMount() {
    const loop = ts => { this.frame(ts); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    this.gyro = e => {
      if (e.gamma == null) return;
      this.ty = Math.max(-8, Math.min(8, e.gamma / 30 * 8));
      this.tx = Math.max(-8, Math.min(8, -(e.beta - 45) / 30 * 8));
    };
    window.addEventListener('deviceorientation', this.gyro);
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('deviceorientation', this.gyro);
    this.tm.forEach(clearTimeout);
  }
  at(ms, fn) { this.tm.push(setTimeout(fn, ms)); }

  frame(ts) {
    const env = this.envRef.current; if (!env) return;
    const ph = this.state.phase;
    if (ph === 'press') {
      this.p = Math.min(1, (ts - this.t0) / PRESS_MS);
      if (this.p >= 1 && !this.granting) { this.granting = true; this.grant(); }
    }
    this.cx += (this.tx - this.cx) * .08; this.cy += (this.ty - this.cy) * .08;
    this.cs += ((ph === 'press' ? .975 : 1) - this.cs) * .15;
    const fl = ph === 'idle' ? -2 - 2 * Math.sin(ts / 3000 * Math.PI * 2) : 0;
    env.style.transform = `translateY(${fl.toFixed(2)}px) rotateX(${(8 + this.cx).toFixed(2)}deg) rotateY(${this.cy.toFixed(2)}deg) scale(${this.cs.toFixed(4)})`;
    if (this.ringRef.current) this.ringRef.current.style.strokeDashoffset = 314.16 * (1 - this.p);
    const ok = ph === 'granted' || ph === 'open';
    if (this.sealRef.current) {
      this.sealRef.current.style.filter = `brightness(${1 + this.p * .45}) drop-shadow(0 0 ${4 + this.p * 14}px ${ok ? 'rgba(242,203,122,.75)' : `rgba(240,200,110,${.25 + this.p * .5})`})`;
    }
  }

  press = () => {
    if (this.state.phase !== 'idle') return;
    try { if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) DeviceOrientationEvent.requestPermission().catch(() => {}); } catch (e) {}
    this.t0 = performance.now(); this.granting = false;
    this.setState({ phase: 'press' });
  };
  grant() {
    this.setState({ phase: 'granted' });
    this.at(500, () => this.setState({ phase: 'open' }));
    this.at(1000, () => this.setState({ letterUp: true }));
    this.at(2000, () => this.setState({ letterReady: true }));
  }
  onMove = e => {
    if (e.pointerType === 'touch' && this.state.phase !== 'idle') return;
    const r = this.rootRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width * 2 - 1, ny = (e.clientY - r.top) / r.height * 2 - 1;
    this.ty = Math.max(-1, Math.min(1, nx)) * 8; this.tx = -Math.max(-1, Math.min(1, ny)) * 8;
  };
  onLeave = () => { this.tx = 0; this.ty = 0; };
  stop = e => e.stopPropagation();
  tapLetter = e => { e.stopPropagation(); if (this.state.letterUp) this.props.onOpened?.(); };
  onKey = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.press(); } };

  render() {
    const { phase, letterUp, letterReady } = this.state;
    const open = phase === 'open', headOp = letterUp ? 0 : 1;

    return (
      <div ref={this.rootRef} onPointerMove={this.onMove} onPointerLeave={this.onLeave} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'radial-gradient(ellipse 90% 70% at 50% 42%, #6A1220 0%, #4E0B16 50%, #2B050B 100%)', fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#F3E6CF' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: NOISE_BG, backgroundSize: '160px 160px', mixBlendMode: 'screen', opacity: .9 }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,.05) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(0,0,0,.05) 0 2px, transparent 2px 6px)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 140px rgba(15,0,3,.75)' }} />
        {this.particles}

        <div className="no-scrollbar" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'safe center', overflowY: 'auto', padding: '80px 0 40px', boxSizing: 'border-box' }}>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', opacity: headOp, transition: 'opacity 400ms ease-out' }}>
            <svg width="46" height="46" viewBox="0 0 24 24" style={{ marginBottom: 6, filter: 'drop-shadow(0 3px 6px rgba(15,0,3,.6))' }}>
              <defs>
                <linearGradient id="capg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#F8E7B0" /><stop offset=".55" stopColor="#D9AF55" /><stop offset="1" stopColor="#A97A24" />
                </linearGradient>
              </defs>
              <path fill="url(#capg)" d="M12 3 23 8.5 12 14 1 8.5Z" />
              <path fill="url(#capg)" d="M5.5 11.3v4.2c0 1.8 2.9 3.2 6.5 3.2s6.5-1.4 6.5-3.2v-4.2L12 14.6Z" />
              <rect fill="url(#capg)" x="20.4" y="9" width="1.2" height="5.6" />
              <circle fill="url(#capg)" cx="21" cy="15.6" r="1.4" />
            </svg>
            <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 54, lineHeight: 1.15, padding: '0 10px', background: GOLD_TEXT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 2px 3px rgba(15,0,3,.55))' }}>You're Invited!</div>
            <div style={{ marginTop: 10, fontStyle: 'italic', fontWeight: 500, fontSize: 20, color: '#E9D3A8', letterSpacing: '.02em' }}>celebrating</div>
            <div style={{ marginTop: 4, fontWeight: 600, fontSize: 25, letterSpacing: '.16em', color: '#F3E6CF' }}>MAI NGUYỄN ĐÌNH HÒA</div>
          </div>

          <div role="button" tabIndex={0} aria-label="Mở thư mời" onPointerDown={this.press} onKeyDown={this.onKey} style={{ flexShrink: 0, marginTop: 26, padding: '24px 30px', perspective: 900, touchAction: 'none', cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent' }}>
            <div ref={this.envRef} style={{ position: 'relative', width: 300, height: 200, willChange: 'transform' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: 'linear-gradient(170deg, #7A1626, #5A0E1A)', boxShadow: 'inset 0 1px 0 rgba(255,210,200,.12), 0 3px 6px rgba(15,0,3,.5), 0 18px 34px rgba(15,0,3,.5), 0 46px 80px -20px rgba(10,0,2,.85)' }} />

              <div onPointerDown={this.stop} onClick={this.tapLetter} style={{ position: 'absolute', left: 14, right: 14, top: 10, height: 180, zIndex: 1, borderRadius: 4, backgroundColor: '#F7EEDC', backgroundImage: NOISE_BG, boxShadow: '0 14px 30px -10px rgba(15,0,3,.6)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', pointerEvents: letterUp ? 'auto' : 'none', opacity: open ? 1 : 0, transform: letterUp ? 'translateY(-168px)' : 'translateY(0)', transition: 'transform 1000ms cubic-bezier(.16,1,.3,1), opacity 200ms ease-out' }}>
                <div style={{ position: 'absolute', inset: 7, border: '1px solid #C9A04A', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: 10, border: '.5px solid rgba(201,160,74,.6)', pointerEvents: 'none' }} />
                <div style={{ padding: '15px 18px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, color: '#4A0C16' }}>
                  <div style={{ fontStyle: 'italic', fontSize: 17, lineHeight: 1.2, color: '#7A5520' }}>Trân trọng kính mời</div>
                  <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 34, lineHeight: 1.1, color: '#7A1626' }}>bạn</div>
                  <div style={{ fontSize: 16, lineHeight: 1.3, color: '#4A0C16' }}>đến dự lễ tốt nghiệp của <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Mai Nguyễn Đình Hòa</span></div>
                  <div style={{ marginTop: 5, fontWeight: 700, fontSize: 15, lineHeight: 1.2, letterSpacing: '.12em', color: '#8A6420' }}>12:30 · 07.11.2026</div>
                  <div style={{ marginTop: 5, fontWeight: 600, fontSize: 15, lineHeight: 1.2, letterSpacing: '.06em', color: '#7A1626', opacity: letterReady ? 1 : 0, transition: 'opacity 300ms ease-out' }}>Chạm vào thư để xem chi tiết ›</div>
                </div>
              </div>

              <div style={{ position: 'absolute', inset: 0, zIndex: 2, borderRadius: 8, clipPath: 'polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)', background: 'linear-gradient(180deg, #6C1221, #560D19)' }} />
              <div style={{ position: 'absolute', inset: 0, zIndex: 2, borderRadius: 8, clipPath: 'polygon(0 0, 50% 54%, 0 100%)', background: 'linear-gradient(100deg, #7E1828, #66101E)' }} />
              <div style={{ position: 'absolute', inset: 0, zIndex: 2, borderRadius: 8, clipPath: 'polygon(100% 0, 50% 54%, 100% 100%)', background: 'linear-gradient(260deg, #7E1828, #66101E)' }} />
              <div style={{ position: 'absolute', inset: 0, zIndex: letterUp ? 0 : 3, transformOrigin: '50% 0', transform: open ? 'perspective(800px) rotateX(180deg)' : 'perspective(800px) rotateX(0deg)', transition: 'transform 700ms cubic-bezier(.4,0,.2,1)' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '8px 8px 0 0', clipPath: 'polygon(0 0, 100% 0, 50% 56%)', background: 'linear-gradient(180deg, #8A1B2D, #6A1121)' }} />
              </div>

              <svg width="74" height="74" viewBox="0 0 112 112" style={{ position: 'absolute', left: 113, top: 75, zIndex: 7, overflow: 'visible', pointerEvents: 'none', opacity: phase === 'press' || phase === 'granted' ? 1 : 0, transition: 'opacity 200ms ease-out', filter: 'drop-shadow(0 0 4px rgba(240,200,110,.8))' }}>
                <circle cx="56" cy="56" r="50" style={{ fill: 'none', stroke: 'rgba(248,231,176,.22)', strokeWidth: 3 }} />
                <circle ref={this.ringRef} cx="56" cy="56" r="50" transform="rotate(-90 56 56)" style={{ fill: 'none', stroke: '#F2D27E', strokeWidth: 3.5, strokeLinecap: 'round', strokeDasharray: 314.16, strokeDashoffset: 314.16 }} />
              </svg>
              <div ref={this.sealRef} style={{ position: 'absolute', left: 126, top: 88, width: 48, height: 48, zIndex: 6, opacity: open ? 0 : 1, transition: 'opacity 300ms ease-out' }}>
                <span style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'rgba(233,196,106,.45)', filter: 'blur(12px)', animation: 'tp-breathe 2.4s ease-in-out infinite', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: -3, borderRadius: '47% 53% 50% 50% / 52% 48% 54% 46%', background: 'radial-gradient(circle at 36% 30%, #F9E6A6, #DDB457 40%, #A97A24 78%, #7D5612 100%)', boxShadow: '0 3px 6px rgba(15,0,3,.55), inset 0 -2px 4px rgba(90,55,10,.5), inset 0 2px 3px rgba(255,245,210,.6)' }} />
                <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', background: 'radial-gradient(circle at 60% 65%, #E9C46A, #C99A3C 70%)', boxShadow: 'inset 1px 1px 2px rgba(90,55,10,.55), inset -1px -1px 2px rgba(255,245,210,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 24, lineHeight: 1, color: '#8A5E14', textShadow: '1px 1px 0 rgba(255,240,200,.6)' }}>H</div>
                </div>
              </div>
            </div>
          </div>

          <button onPointerDown={this.press} style={{ flexShrink: 0, marginTop: 20, minHeight: 48, padding: '0 20px', border: 'none', cursor: 'pointer', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 17, letterSpacing: '.24em', background: GOLD_TEXT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', opacity: headOp, transition: 'opacity 400ms ease-out' }}>CLICK TO OPEN INVITE</button>
        </div>
      </div>
    );
  }
}
