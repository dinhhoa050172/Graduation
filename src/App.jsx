import React, { useEffect, useRef, useState } from 'react';
import EnvelopeScreen from './components/EnvelopeScreen.jsx';
import LetterScreen from './components/LetterScreen.jsx';

// stage: 'env' (phong thư) → 'cross' (crossfade 700ms) → 'letter' (thiệp)
export default function App() {
  const [stage, setStage] = useState('env');
  const [on, setOn] = useState(false);
  const [envKey, setEnvKey] = useState(0);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const opened = () => {
    if (stage !== 'env') return;
    setStage('cross'); setOn(false);
    timers.current.push(setTimeout(() => setOn(true), 40));
    timers.current.push(setTimeout(() => setStage('letter'), 700));
  };
  const replay = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setEnvKey(k => k + 1);
    setStage('env'); setOn(false);
  };

  const cross = stage === 'cross', letterIn = stage === 'letter' || on;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0D1117', overflow: 'hidden' }}>
      {stage !== 'letter' && (
        <div style={{ position: 'absolute', inset: 0, opacity: cross && on ? 0 : 1, pointerEvents: cross ? 'none' : 'auto', transition: 'opacity 500ms ease-out' }}>
          <EnvelopeScreen key={envKey} onOpened={opened} />
        </div>
      )}
      {stage !== 'env' && (
        <div style={{ position: 'absolute', inset: 0, opacity: letterIn ? 1 : 0, transform: letterIn ? 'translateY(0) scale(1)' : 'translateY(24px) scale(.98)', transition: 'opacity 600ms ease-out, transform 600ms cubic-bezier(.16,1,.3,1)' }}>
          <LetterScreen onReplay={replay} />
        </div>
      )}
    </div>
  );
}
