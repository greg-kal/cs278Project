// Timeline — hi-fi base styles + primitives
// Two visual systems share a single component set; the .v-warm and .v-mono
// theme classes on a wrapping element swap colors/type. Components are
// purely presentational; no state.

const TL_CSS = `
:root {
  --paper: #faf7f2;
  --ink: #1a1814;
  --ink-2: #2c2823;
  --muted: #8a8278;
  --hair: rgba(26,24,20,0.10);
  --hair-2: rgba(26,24,20,0.16);
  --card: #ffffff;
  --soft: #f3efe7;
  --accent: oklch(64% 0.14 38);
  --accent-soft: oklch(94% 0.04 50);
  --accent-ink: oklch(38% 0.10 38);
  --good: oklch(58% 0.13 150);
  --warn: oklch(72% 0.16 75);
}
.v-mono {
  --paper: #f5f5f3;
  --card: #ffffff;
  --ink: #0e0e0c;
  --ink-2: #1f1f1c;
  --muted: #7a7a76;
  --soft: #ececea;
  --accent: #0e0e0c;
  --accent-soft: #e8e6e1;
  --accent-ink: #0e0e0c;
  --hair: rgba(0,0,0,0.10);
  --hair-2: rgba(0,0,0,0.18);
}
.v-warm {}

.tl, .tl * { box-sizing: border-box; }
.tl {
  font-family: ui-sans-serif, -apple-system, "SF Pro Text", "Inter", system-ui, sans-serif;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01","cv11";
}
.tl-display { font-family: "Caveat", "Inter", system-ui, cursive; }
.tl-mono { font-family: ui-monospace, "JetBrains Mono", "SF Mono", Menlo, monospace; font-variant-numeric: tabular-nums; }

.tl-screen {
  background: var(--paper);
  width: 390px;
  height: 844px;
  position: relative;
  overflow: hidden;
  border-radius: 44px;
}
.tl-status {
  height: 50px;
  padding: 16px 28px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: -apple-system, "SF Pro Text", system-ui, sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: var(--ink);
}
.tl-status .right { display:flex; gap:6px; align-items:center; font-size: 13px; }

.tl-home { position:absolute; left:50%; bottom:8px; transform:translateX(-50%); width:134px; height:5px; border-radius:3px; background: var(--ink); opacity:.85; }

.tl-tabbar {
  position: absolute; left:0; right:0; bottom:0;
  height: 84px;
  background: color-mix(in oklab, var(--paper) 92%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--hair);
  display: flex; align-items: flex-start; justify-content: space-around;
  padding: 10px 18px 0;
}
.tl-tabbar > div { flex: 1; display:flex; flex-direction:column; align-items:center; gap:3px; padding-top: 4px; }
.tl-tabbar .lbl { font-size: 10px; letter-spacing: .02em; color: var(--muted); }
.tl-tabbar .active .lbl { color: var(--ink); }
.tl-tabbar svg { stroke: var(--muted); }
.tl-tabbar .active svg { stroke: var(--ink); }

.tl-fab {
  position: absolute; right: 18px; bottom: 100px;
  width: 56px; height: 56px; border-radius: 999px;
  background: var(--ink); color: var(--paper);
  display:flex; align-items:center; justify-content:center;
  box-shadow: 0 10px 24px rgba(20,16,12,0.22), 0 1px 0 rgba(255,255,255,0.05) inset;
  font-size: 28px; font-weight: 300; line-height: 1;
}

.tl-card {
  background: var(--card);
  border: 1px solid var(--hair);
  border-radius: 18px;
  box-shadow: 0 1px 0 rgba(20,16,12,.02), 0 8px 24px -16px rgba(20,16,12,.18);
}

.tl-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 10px; border-radius: 999px;
  border: 1px solid var(--hair-2); background: var(--card);
  font-size: 12px; color: var(--ink-2);
}
.tl-pill.is-on { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.tl-pill.accent { background: var(--accent-soft); color: var(--accent-ink); border-color: color-mix(in oklab, var(--accent) 25%, transparent); }

.tl-btn {
  height: 44px; padding: 0 18px; border-radius: 999px;
  border: 1px solid var(--hair-2); background: var(--card);
  font-weight: 600; font-size: 15px; color: var(--ink);
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
}
.tl-btn.primary { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.tl-btn.accent  { background: var(--accent); color: #fff; border-color: var(--accent); }
.tl-btn.ghost   { background: transparent; }

.tl-avatar {
  display: inline-flex; align-items:center; justify-content:center;
  border-radius: 999px;
  background: var(--soft);
  color: var(--ink-2);
  font-weight: 600;
  border: 1px solid var(--hair);
}
.tl-avatar.b1 { background: oklch(86% 0.06 50); color: oklch(35% 0.08 50); }
.tl-avatar.b2 { background: oklch(86% 0.05 145); color: oklch(33% 0.08 145); }
.tl-avatar.b3 { background: oklch(86% 0.05 230); color: oklch(33% 0.08 230); }
.tl-avatar.b4 { background: oklch(88% 0.05 320); color: oklch(35% 0.08 320); }
.tl-avatar.b5 { background: oklch(89% 0.04 90);  color: oklch(33% 0.08 90); }

.tl-stack { display:inline-flex; }
.tl-stack > * + * { margin-left: -8px; }

.tl-divider { height: 1px; background: var(--hair); }

.tl-tag { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }

.tl-input {
  background: var(--card); border:1px solid var(--hair-2); border-radius: 12px;
  padding: 12px 14px; font-size: 15px; color: var(--ink); width: 100%;
}
.tl-input::placeholder { color: var(--muted); }

.tl-segment {
  display:inline-flex; padding: 3px; border-radius: 999px; background: var(--soft); border:1px solid var(--hair);
}
.tl-segment > button {
  padding: 6px 12px; border-radius: 999px; font-size: 13px; font-weight: 600; color: var(--muted); background: transparent; border: 0;
}
.tl-segment > button.on { background: var(--card); color: var(--ink); box-shadow: 0 1px 2px rgba(0,0,0,.06); }

.tl-photo {
  border-radius: 14px; overflow: hidden; position: relative;
  background:
    repeating-linear-gradient(135deg, oklch(82% 0.04 60) 0 8px, oklch(78% 0.05 60) 8px 16px);
}
.tl-photo.green { background: repeating-linear-gradient(135deg, oklch(82% 0.05 150) 0 8px, oklch(78% 0.06 150) 8px 16px); }
.tl-photo.blue  { background: repeating-linear-gradient(135deg, oklch(82% 0.05 230) 0 8px, oklch(78% 0.06 230) 8px 16px); }
.tl-photo.warm  { background: repeating-linear-gradient(135deg, oklch(83% 0.06 40) 0 8px, oklch(78% 0.08 40) 8px 16px); }

.tl-checkbox {
  width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid var(--hair-2); background: var(--card); display:inline-flex; align-items:center; justify-content:center;
}
.tl-checkbox.on { background: var(--ink); border-color: var(--ink); color: var(--paper); }

.tl-icon { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }

.tl-rail-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--card); border: 2px solid var(--ink); flex: 0 0 10px; }
.tl-rail-dot.fill { background: var(--ink); }

.tl-bottomsheet {
  position: absolute; left:0; right:0; bottom:0;
  background: var(--paper);
  border-top-left-radius: 28px; border-top-right-radius: 28px;
  box-shadow: 0 -20px 60px -20px rgba(20,16,12,.35);
  padding: 8px 0 0;
}
.tl-grabber { width: 36px; height: 5px; border-radius: 3px; background: var(--hair-2); margin: 6px auto 12px; }

.tl-chip-row { display:flex; gap:8px; overflow:hidden; }

.scroll-hidden::-webkit-scrollbar { display:none; }
.scroll-hidden { scrollbar-width: none; }
`;

if (typeof document !== 'undefined' && !document.getElementById('tl-styles')) {
  const s = document.createElement('style');
  s.id = 'tl-styles';
  s.textContent = TL_CSS;
  document.head.appendChild(s);
}

// ───────────────────── Primitives ─────────────────────
function StatusBar({ light }) {
  return (
    <div className="tl-status" style={ light ? { color:'#fff' } : null }>
      <span>9:41</span>
      <span className="right">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none"><path d="M1 6 L4 9 L17 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4" y="5" width="3" height="6" rx="1"/><rect x="8" y="3" width="3" height="8" rx="1"/><rect x="12" y="0" width="3" height="11" rx="1"/></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor"/><rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor"/><rect x="23" y="3.5" width="2" height="5" rx="1" fill="currentColor"/></svg>
      </span>
    </div>
  );
}

function Avatar({ ch, size = 32, tone = 'b1' }) {
  return (
    <span className={`tl-avatar ${tone}`} style={{ width:size, height:size, fontSize:Math.round(size*0.42) }}>{ch}</span>
  );
}

function AvatarStack({ items, size = 24, more }) {
  return (
    <span className="tl-stack" style={{ alignItems:'center' }}>
      {items.map((it, i) => <Avatar key={i} ch={it.ch} tone={it.tone} size={size} />)}
      {more ? <span className="tl-avatar" style={{ width:size, height:size, fontSize:Math.round(size*0.36), background:'var(--soft)' }}>+{more}</span> : null}
    </span>
  );
}

const Icon = {
  star: (filled) => (
    <svg className="tl-icon" viewBox="0 0 24 24" fill={filled?'currentColor':'none'}><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8-4.3-4.1 5.9-.9L12 3.5z"/></svg>
  ),
  plus: <svg className="tl-icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  back: <svg className="tl-icon" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>,
  more: <svg className="tl-icon" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></svg>,
  filter: <svg className="tl-icon" viewBox="0 0 24 24"><path d="M3 5h18M6 12h12M10 19h4"/></svg>,
  search: <svg className="tl-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>,
  pin: <svg className="tl-icon" viewBox="0 0 24 24"><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>,
  clock: <svg className="tl-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  comment: <svg className="tl-icon" viewBox="0 0 24 24"><path d="M21 12a8 8 0 11-3.2-6.4L21 5l-1 3.4A7.96 7.96 0 0121 12z"/></svg>,
  send: <svg className="tl-icon" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  close: <svg className="tl-icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6l-12 12"/></svg>,
  check: <svg className="tl-icon" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L20 7"/></svg>,
  feed: <svg className="tl-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="11" width="18" height="9" rx="1.5"/></svg>,
  people: <svg className="tl-icon" viewBox="0 0 24 24"><circle cx="9" cy="9" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><circle cx="17" cy="8" r="2.5"/><path d="M16 13.5c2.5 0 4.5 1.5 5.5 4"/></svg>,
  bell: <svg className="tl-icon" viewBox="0 0 24 24"><path d="M6 9a6 6 0 1112 0c0 5 2 7 2 7H4s2-2 2-7z"/><path d="M10 20a2 2 0 004 0"/></svg>,
  me: <svg className="tl-icon" viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.5"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>,
};

function TabBar({ active = 0 }) {
  const tabs = [
    { lbl:'Feed', i: Icon.feed },
    { lbl:'Friends', i: Icon.people },
    { lbl:'', i: null },
    { lbl:'Activity', i: Icon.bell },
    { lbl:'You', i: Icon.me },
  ];
  return (
    <div className="tl-tabbar">
      {tabs.map((t, i) => (
        <div key={i} className={i===active?'active':''}>
          {t.i ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', height:24 }}>{t.i}</span> : <span style={{height:24}}/>}
          <span className="lbl">{t.lbl}</span>
        </div>
      ))}
    </div>
  );
}

function Fab() {
  return <button className="tl-fab" aria-label="add">{Icon.plus}</button>;
}

// Export to window for use across files
Object.assign(window, {
  StatusBar, Avatar, AvatarStack, Icon, TabBar, Fab,
});
