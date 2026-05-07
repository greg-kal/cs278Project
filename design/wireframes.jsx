// Timeline Events App — Sketchy Wireframes
// Low-fi exploration of the social events timeline app described in the brief.
// Each section explores a single problem; each artboard is a distinct take.

const W = 320;     // phone screen width
const H = 640;     // phone screen height
const FW = 360;    // artboard frame width (with bezel padding)
const FH = 700;    // artboard frame height

// ─────────────────────────────────────────────────────────
// Tiny primitives
// ─────────────────────────────────────────────────────────
const Status = () => (
  <div className="wf-status">
    <span>9:41</span>
    <span>● ●●● ▮</span>
  </div>
);

const Sq = ({ w = 8, h = 8, style }) => (
  <span style={{ display:'inline-block', width:w, height:h, border:'1.5px solid #1a1a1a', borderRadius:2, background:'#fff', ...style }} />
);

const Ln = ({ w = '100%', style }) => (
  <div style={{ height:1.5, background:'#1a1a1a', width:w, opacity:.85, ...style }} />
);

// fake "text line" placeholder
const TL = ({ w = '100%', h = 8, style }) => (
  <div style={{ height:h, width:w, background:'#1a1a1a', opacity:.18, borderRadius:2, ...style }} />
);

const Av = ({ ch = 'A', size = 26 }) => (
  <span className="wf-avatar" style={{ width:size, height:size, fontSize:size*.5 }}>{ch}</span>
);

const Stack = ({ chs = ['A','B','C'] }) => (
  <span style={{ display:'inline-flex' }}>
    {chs.map((c,i) => (
      <span key={i} style={{ marginLeft: i? -8 : 0, zIndex: chs.length - i }}>
        <Av ch={c} size={22} />
      </span>
    ))}
  </span>
);

// hand-drawn arrow annotation
const Annot = ({ x, y, w = 140, children, dir = 'left' }) => (
  <div className="wf-ann" style={{ left:x, top:y, width:w }}>
    <div>{children}</div>
  </div>
);

// ─────────────────────────────────────────────────────────
// Phone shell — minimal sketchy frame (lighter than ios_frame
// because we want 'wireframe' feel not real device).
// ─────────────────────────────────────────────────────────
const Phone = ({ children, label, sub }) => (
  <div style={{ position:'relative', width:FW, height:FH }}>
    <div className="wf wf-screen" style={{ position:'absolute', left:20, top:30, width:W, height:H, padding:0 }}>
      <Status />
      {children}
    </div>
    {label && (
      <div style={{ position:'absolute', left:0, right:0, top:0, fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'#8a8378', textTransform:'uppercase', letterSpacing:'.08em' }}>
        {label}
      </div>
    )}
    {sub && (
      <div style={{ position:'absolute', left:0, right:0, bottom:0, fontFamily:'Caveat, cursive', fontSize:18, color:'#c96442', lineHeight:1.1, textAlign:'left', whiteSpace:'pre-line' }}>
        {sub}
      </div>
    )}
  </div>
);

const BottomNav = ({ active = 0 }) => {
  const icons = ['◰','★','＋','◉','◯'];
  return (
    <div className="wf-bottomnav">
      {icons.map((c,i) => (
        <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
          <div style={{ fontFamily:'Caveat, cursive', fontSize:22, fontWeight: i===active?700:400, opacity: i===active?1:.55 }}>{c}</div>
          <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:8, opacity: i===active?1:.55 }}>{['feed','faves','add','you','me'][i]}</div>
        </div>
      ))}
    </div>
  );
};

// ═════════════════════════════════════════════════════════
// SECTION 1 — TIMELINE / FEED VIEWS
// ═════════════════════════════════════════════════════════

// A · Vertical day-stacked timeline (canonical)
function FeedA() {
  return (
    <Phone label="A · Day-stacked vertical">
      <div style={{ padding:'10px 14px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:'Caveat, cursive', fontSize:26, fontWeight:700 }}>timeline</div>
        <div style={{ display:'flex', gap:6 }}>
          <span className="wf-pill">all ▾</span>
          <Sq w={22} h={22} />
        </div>
      </div>
      <div style={{ padding:'4px 14px 0', display:'flex', gap:6, overflow:'hidden' }}>
        {['TUE','WED','THU','FRI','SAT','SUN','MON'].map((d,i) => (
          <div key={i} style={{ flex:'0 0 34px', textAlign:'center', padding:'4px 0', borderRadius:6, border: i===1?'1.5px solid #1a1a1a':'1.5px solid transparent', background: i===1?'#fde68a':'transparent' }}>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9 }}>{d}</div>
            <div style={{ fontFamily:'Caveat, cursive', fontSize:18, fontWeight:600 }}>{4+i}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:'10px 14px 70px', position:'relative' }}>
        {/* Day header */}
        <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:6 }}>
          <div style={{ fontFamily:'Caveat, cursive', fontSize:22, fontWeight:700 }}>today</div>
          <div className="wf-tag">wed apr 30</div>
        </div>

        {/* event 1 */}
        <div className="wf-box" style={{ padding:10, marginBottom:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
            <div style={{ fontFamily:'Caveat, cursive', fontSize:20, fontWeight:600 }}>pickup soccer</div>
            <div className="wf-mono" style={{ fontSize:11 }}>5:30p</div>
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <Av ch="M" size={22} /><div style={{ fontFamily:'Kalam', fontSize:12 }}>maya · roble field</div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, alignItems:'center' }}>
            <Stack chs={['J','K','L','+']} />
            <span className="wf-pill">join</span>
          </div>
        </div>

        {/* event 2 */}
        <div className="wf-box" style={{ padding:10, marginBottom:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div style={{ fontFamily:'Caveat, cursive', fontSize:20, fontWeight:600 }}>dinner @ arrillaga</div>
            <div className="wf-mono" style={{ fontSize:11 }}>6:30p</div>
          </div>
          <div style={{ fontFamily:'Kalam', fontSize:12 }}>greg · open invite</div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, alignItems:'center' }}>
            <Stack chs={['A','B','C','D','+']} />
            <span className="wf-pill">join</span>
          </div>
        </div>

        {/* event 3 */}
        <div className="wf-box" style={{ padding:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div style={{ fontFamily:'Caveat, cursive', fontSize:20, fontWeight:600 }}>movie night</div>
            <div className="wf-mono" style={{ fontSize:11 }}>9:00p</div>
          </div>
          <div style={{ fontFamily:'Kalam', fontSize:12 }}>nat · suites lounge</div>
        </div>

        <div style={{ display:'flex', alignItems:'baseline', gap:8, margin:'14px 0 6px' }}>
          <div style={{ fontFamily:'Caveat, cursive', fontSize:22, fontWeight:700 }}>tomorrow</div>
          <div className="wf-tag">thu may 1</div>
        </div>
        <div className="wf-box" style={{ padding:10 }}>
          <div style={{ fontFamily:'Caveat, cursive', fontSize:20, fontWeight:600 }}>gym @ arc</div>
          <div className="wf-mono" style={{ fontSize:11 }}>7am</div>
        </div>
      </div>

      <div className="wf-fab">+</div>
      <BottomNav active={0} />
    </Phone>
  );
}

// B · Horizontal scroll timeline (one column per day, 15 days)
function FeedB() {
  return (
    <Phone label="B · Horizontal 15-day rail">
      <div style={{ padding:'10px 14px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:'Caveat, cursive', fontSize:26, fontWeight:700 }}>next 15 days</div>
          <Sq w={22} h={22} />
        </div>
        <div style={{ fontFamily:'Kalam', fontSize:12, color:'#8a8378' }}>swipe →</div>
      </div>

      <div style={{ display:'flex', gap:8, overflow:'hidden', padding:'10px 14px 70px', height: H - 90 }}>
        {[
          { d:'WED 30', items:[{t:'5:30p', n:'soccer'}, {t:'6:30p', n:'dinner'}, {t:'9p', n:'movie'}] },
          { d:'THU 1',  items:[{t:'7a', n:'gym'}, {t:'8p', n:'study'}] },
          { d:'FRI 2',  items:[{t:'6p', n:'BBQ'}, {t:'10p', n:'kappa'}] },
          { d:'SAT 3',  items:[{t:'12p', n:'brunch'}, {t:'7p', n:'concert'}] },
        ].map((col, i) => (
          <div key={i} style={{ flex:'0 0 92px', display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:10, textAlign:'center', borderBottom:'1.5px solid #1a1a1a', paddingBottom:4 }}>
              {col.d}
            </div>
            {col.items.map((e,j) => (
              <div key={j} className="wf-box" style={{ padding:6 }}>
                <div className="wf-mono" style={{ fontSize:9 }}>{e.t}</div>
                <div style={{ fontFamily:'Caveat, cursive', fontSize:16, fontWeight:600, lineHeight:1 }}>{e.n}</div>
                <div style={{ marginTop:4 }}><Stack chs={['A','B','+']} /></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="wf-fab">+</div>
      <BottomNav active={0} />
    </Phone>
  );
}

// C · Time-of-day spine (events placed by clock position)
function FeedC() {
  return (
    <Phone label="C · Time-of-day spine">
      <div style={{ padding:'10px 14px 0', display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <div style={{ fontFamily:'Caveat, cursive', fontSize:26, fontWeight:700 }}>wed 30</div>
        <div className="wf-tag">today</div>
      </div>

      <div style={{ position:'relative', padding:'8px 14px 70px', height: H - 60 }}>
        <div style={{ position:'absolute', left:50, top:8, bottom:70, borderLeft:'2px dotted #1a1a1a' }} />
        {[
          { t:'8a',  e:'coffee w/ sam', joined:1, color:'#fff' },
          { t:'12p', e:'lunch — open', joined:5 },
          { t:'4p',  e:'climbing gym', joined:3 },
          { t:'6p',  e:'dinner @ arrillaga', joined:8, hl:true },
          { t:'9p',  e:'movie night', joined:2 },
        ].map((row,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, position:'relative' }}>
            <div className="wf-mono" style={{ width:32, textAlign:'right', fontSize:11 }}>{row.t}</div>
            <div style={{ width:10, height:10, borderRadius:'50%', background: row.hl?'#1a1a1a':'#fff', border:'1.5px solid #1a1a1a', flex:'0 0 10px', position:'relative', zIndex:1 }} />
            <div className="wf-box" style={{ flex:1, padding:8, background: row.hl?'#fde68a':'#fff' }}>
              <div style={{ fontFamily:'Caveat, cursive', fontSize:18, fontWeight:600, lineHeight:1 }}>{row.e}</div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                <Stack chs={['A','B','C']} />
                <div className="wf-tag">{row.joined} going</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="wf-fab">+</div>
      <BottomNav active={0} />
    </Phone>
  );
}

// D · Friend-row timeline (rows = people, columns = time)
function FeedD() {
  return (
    <Phone label="D · Friends-as-rows view">
      <div style={{ padding:'10px 14px 0' }}>
        <div style={{ fontFamily:'Caveat, cursive', fontSize:24, fontWeight:700 }}>who's doing what</div>
        <div className="wf-tag">today · wed 30</div>
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', gap:18, padding:'8px 14px 0', fontFamily:'JetBrains Mono, monospace', fontSize:9 }}>
        <span>morn</span><span>aft</span><span>eve</span><span>nite</span>
      </div>
      <div style={{ padding:'4px 10px 70px' }}>
        {[
          { n:'maya', fav:1, blobs:[{c:1,t:'soccer 5:30'}, {c:2,t:'dinner 7'}] },
          { n:'greg', fav:1, blobs:[{c:2,t:'dinner 6:30'}, {c:3,t:'movie 9p'}] },
          { n:'nat',  fav:0, blobs:[{c:0,t:'run 7a'}, {c:3,t:'lounge'}] },
          { n:'sam',  fav:1, blobs:[{c:1,t:'study 2p'}] },
          { n:'kim',  fav:0, blobs:[{c:2,t:'BBQ 6'}] },
          { n:'theo', fav:0, blobs:[{c:0,t:'gym 8a'}, {c:3,t:'kappa'}] },
        ].map((row,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 0', borderBottom:'1px dotted #1a1a1a' }}>
            <div style={{ width:62, display:'flex', alignItems:'center', gap:4 }}>
              {row.fav ? <span className="wf-star">★</span> : <span style={{ width:10, display:'inline-block' }}/>}
              <Av ch={row.n[0].toUpperCase()} size={20} />
              <span style={{ fontFamily:'Kalam', fontSize:12 }}>{row.n}</span>
            </div>
            <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:3, position:'relative' }}>
              {[0,1,2,3].map(col => {
                const b = row.blobs.find(x => x.c === col);
                return (
                  <div key={col} style={{ height:22, border:'1px dashed rgba(0,0,0,.15)', borderRadius:4, padding:'1px 4px', display:'flex', alignItems:'center', background: b?'#fff':'transparent' }}>
                    {b && <span style={{ fontFamily:'Kalam', fontSize:10, whiteSpace:'nowrap', overflow:'hidden' }}>{b.t}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="wf-fab">+</div>
      <BottomNav active={0} />
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════
// SECTION 2 — EVENT DETAIL CARD
// ═════════════════════════════════════════════════════════

function DetailA() {
  return (
    <Phone label="A · Classic detail">
      <div style={{ padding:'10px 14px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontFamily:'Caveat',fontSize:20 }}>← back</span>
          <span style={{ fontFamily:'Caveat',fontSize:20 }}>···</span>
        </div>
      </div>
      <div style={{ padding:'8px 14px' }}>
        <div className="wf-img" style={{ height:120, marginBottom:10 }} />
        <div style={{ fontFamily:'Caveat, cursive', fontSize:28, fontWeight:700, lineHeight:1 }}>dinner @ arrillaga</div>
        <div className="wf-mono" style={{ fontSize:11, marginTop:4 }}>WED 30 · 6:30PM – 8PM</div>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8 }}>
          <Av ch="G" size={22} />
          <span style={{ fontFamily:'Kalam', fontSize:13 }}>greg posted · open invite</span>
        </div>

        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          <button className="wf-btn wf-btn-primary" style={{ flex:1 }}>i'm in</button>
          <button className="wf-btn" style={{ flex:1 }}>maybe</button>
        </div>

        <div style={{ marginTop:14 }}>
          <div className="wf-tag">8 going</div>
          <div style={{ display:'flex', gap:6, marginTop:6, flexWrap:'wrap' }}>
            {['M','J','K','L','A','B','C','+'].map((c,i) => <Av key={i} ch={c} size={26} />)}
          </div>
        </div>

        <div style={{ marginTop:14 }}>
          <div className="wf-tag">comments</div>
          <div style={{ marginTop:6, display:'flex', gap:6, alignItems:'flex-start' }}>
            <Av ch="J" size={22} />
            <div className="wf-soft" style={{ padding:'6px 8px', flex:1 }}>
              <div style={{ fontFamily:'Kalam', fontSize:12, fontWeight:700 }}>jess</div>
              <TL w="80%" /><TL w="60%" style={{ marginTop:3 }} />
            </div>
          </div>
          <div style={{ marginTop:6, display:'flex', gap:6, alignItems:'flex-start' }}>
            <Av ch="K" size={22} />
            <div className="wf-soft" style={{ padding:'6px 8px', flex:1 }}>
              <TL w="70%" />
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function DetailB() {
  return (
    <Phone label="B · Photo-first detail" sub={"photo hero,\nrsvp + comments\ncollapsed below"}>
      <div className="wf-img" style={{ height:240, borderRadius:0, borderLeft:0, borderRight:0, borderTop:0 }} />
      <div style={{ padding:'10px 14px' }}>
        <div className="wf-mono" style={{ fontSize:10 }}>WED 6:30P · ARRILLAGA</div>
        <div style={{ fontFamily:'Caveat, cursive', fontSize:30, fontWeight:700, lineHeight:.95 }}>dinner</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Av ch="G" size={22} />
            <span style={{ fontFamily:'Kalam', fontSize:13 }}>by greg</span>
          </div>
          <Stack chs={['A','B','C','D','+']} />
        </div>
        <div style={{ marginTop:10, display:'flex', gap:6 }}>
          <button className="wf-btn wf-btn-primary" style={{ flex:2 }}>join · 8 going</button>
          <button className="wf-btn">★</button>
        </div>
        <div style={{ marginTop:14 }}>
          <TL w="90%" /><TL w="70%" style={{ marginTop:4 }} /><TL w="80%" style={{ marginTop:4 }} />
        </div>
        <div className="wf-divider" style={{ margin:'14px 0' }} />
        <div style={{ display:'flex', gap:6 }}>
          <Av ch="J" size={22} />
          <div className="wf-soft" style={{ padding:'5px 8px', flex:1 }}><TL w="60%" /></div>
        </div>
        <div style={{ display:'flex', gap:6, marginTop:6 }}>
          <Av ch="K" size={22} />
          <div className="wf-soft" style={{ padding:'5px 8px', flex:1 }}><TL w="80%" /></div>
        </div>
      </div>
    </Phone>
  );
}

function DetailC() {
  return (
    <Phone label="C · Sticky-note style">
      <div style={{ padding:'14px' }}>
        <div style={{ fontFamily:'Caveat',fontSize:18 }}>← all events</div>
        <div className="wf-soft" style={{ background:'#fde68a', padding:14, marginTop:10, transform:'rotate(-1deg)', boxShadow:'4px 4px 0 #1a1a1a' }}>
          <div className="wf-mono" style={{ fontSize:10 }}>WED 30 · 6:30P</div>
          <div style={{ fontFamily:'Caveat',fontSize:32, fontWeight:700, lineHeight:1 }}>dinner @ arrillaga</div>
          <div style={{ fontFamily:'Kalam', fontSize:13, marginTop:4 }}>open · come thru</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10 }}>
            <Av ch="G" size={22} /><span style={{ fontFamily:'Kalam', fontSize:12 }}>greg</span>
          </div>
        </div>

        <div style={{ display:'flex', gap:8, marginTop:14 }}>
          <button className="wf-btn wf-btn-primary" style={{ flex:1 }}>i'm in (8)</button>
          <button className="wf-btn" style={{ flex:1 }}>nope</button>
        </div>

        <div className="wf-tag" style={{ marginTop:16 }}>going</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:6 }}>
          {['M','J','K','L','A','B','C','+'].map((c,i)=> <Av key={i} ch={c} size={24} />)}
        </div>

        <div className="wf-tag" style={{ marginTop:14 }}>2 comments</div>
        <div className="wf-soft" style={{ padding:8, marginTop:6 }}>
          <div style={{ fontFamily:'Kalam', fontSize:12, fontWeight:700 }}>jess</div>
          <TL w="80%" /><TL w="50%" style={{ marginTop:3 }} />
        </div>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════
// SECTION 3 — ADD EVENT FLOW + SMART SUGGESTIONS
// ═════════════════════════════════════════════════════════

// A · One-tap suggestion sheet (the "claude code style" picker)
function AddA() {
  return (
    <Phone label="A · Suggest 4 options">
      <div style={{ padding:'10px 14px' }}>
        <div style={{ fontFamily:'Caveat',fontSize:18 }}>← cancel</div>
      </div>
      <div style={{ padding:'10px 18px' }}>
        <div style={{ fontFamily:'Caveat, cursive', fontSize:28, fontWeight:700, lineHeight:1.05 }}>
          what are you doing?
        </div>
        <div className="wf-tag" style={{ marginTop:4 }}>pick one. tap to post.</div>

        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:18 }}>
          {[
            { n:'gym',     t:'usual · 7pm @ arc',      hint:'you do this most tue/thu' },
            { n:'dinner',  t:'open invite · 6:30pm',   hint:'top suggestion' },
            { n:'study',   t:'2hrs · green library',   hint:'recent' },
            { n:'brunch',  t:'sat 11am · coupa',       hint:'tomorrow' },
          ].map((s,i) => (
            <div key={i} className="wf-box" style={{ padding:10, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', border:'1.5px solid #1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'JetBrains Mono, monospace', fontSize:11, fontWeight:700 }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'Caveat',fontSize:22, fontWeight:600, lineHeight:1 }}>{s.n}</div>
                <div className="wf-mono" style={{ fontSize:10, marginTop:2 }}>{s.t}</div>
              </div>
              <div style={{ fontFamily:'Caveat', fontSize:18, color:'#c96442' }}>→</div>
            </div>
          ))}
          <div className="wf-dashed" style={{ padding:10, textAlign:'center', fontFamily:'Caveat',fontSize:18 }}>+ something else…</div>
        </div>
      </div>
    </Phone>
  );
}

// B · Manual-fill new-event form (fallback)
function AddB() {
  return (
    <Phone label="B · Manual create">
      <div style={{ padding:'10px 14px', display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontFamily:'Caveat',fontSize:18 }}>← cancel</span>
        <span style={{ fontFamily:'Caveat',fontSize:18, color:'#c96442' }}>post</span>
      </div>
      <div style={{ padding:'10px 16px' }}>
        <div className="wf-tag">what</div>
        <div style={{ fontFamily:'Caveat',fontSize:30, fontWeight:600, borderBottom:'1.5px solid #1a1a1a', padding:'2px 0' }}>dinner|</div>

        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:8 }}>
          {['🍽 dinner','🏋 gym','📚 study','🌅 brunch','🎬 movie','🍻 kappa'].map((c,i) => (
            <span key={i} className="wf-pill">{c}</span>
          ))}
        </div>

        <div style={{ marginTop:14 }}>
          <div className="wf-tag">when</div>
          <div style={{ display:'flex', gap:6, marginTop:6 }}>
            <span className="wf-pill" style={{ background:'#fde68a' }}>today 6:30p</span>
            <span className="wf-pill">tomorrow</span>
            <span className="wf-pill">pick…</span>
          </div>
        </div>

        <div style={{ marginTop:14 }}>
          <div className="wf-tag">how long? (optional)</div>
          <div style={{ display:'flex', gap:6, marginTop:6 }}>
            {['30m','1h','2h','open'].map((c,i) => (
              <span key={i} className="wf-pill" style={{ background: i===3?'#fde68a':'#fff' }}>{c}</span>
            ))}
          </div>
        </div>

        <div style={{ marginTop:14 }}>
          <div className="wf-tag">who can join?</div>
          <div style={{ display:'flex', gap:6, marginTop:6 }}>
            <span className="wf-pill" style={{ background:'#fde68a' }}>● open · everyone</span>
            <span className="wf-pill">○ favorites</span>
            <span className="wf-pill">○ pick people</span>
          </div>
        </div>

        <div style={{ marginTop:14 }}>
          <div className="wf-tag">where (optional)</div>
          <div className="wf-dashed" style={{ padding:10, marginTop:6, fontFamily:'Kalam',fontSize:13, color:'#8a8378' }}>+ location</div>
        </div>
      </div>
    </Phone>
  );
}

// C · One-line "smart input" (type a line, app parses)
function AddC() {
  return (
    <Phone label="C · Smart one-liner">
      <div style={{ padding:'10px 14px' }}>
        <span style={{ fontFamily:'Caveat',fontSize:18 }}>← cancel</span>
      </div>
      <div style={{ padding:'30px 18px 0' }}>
        <div style={{ fontFamily:'Caveat',fontSize:24, fontWeight:700, lineHeight:1 }}>just type it</div>
        <div className="wf-soft" style={{ padding:14, marginTop:14, fontFamily:'Caveat',fontSize:24, fontWeight:600 }}>
          dinner at 6:30 arrillaga|
        </div>
        <div className="wf-tag" style={{ marginTop:10 }}>parsed →</div>
        <div className="wf-box" style={{ padding:10, marginTop:6 }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:'Kalam', fontSize:12 }}>title</span>
            <span style={{ fontFamily:'Caveat', fontSize:18, fontWeight:600 }}>dinner</span>
          </div>
          <Ln style={{ margin:'5px 0' }} />
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:'Kalam', fontSize:12 }}>when</span>
            <span style={{ fontFamily:'JetBrains Mono', fontSize:12 }}>WED 6:30PM</span>
          </div>
          <Ln style={{ margin:'5px 0' }} />
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:'Kalam', fontSize:12 }}>where</span>
            <span style={{ fontFamily:'Kalam', fontSize:12 }}>arrillaga</span>
          </div>
          <Ln style={{ margin:'5px 0' }} />
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontFamily:'Kalam', fontSize:12 }}>open invite?</span>
            <span style={{ fontFamily:'Caveat', fontSize:18, fontWeight:600 }}>yes</span>
          </div>
        </div>
        <button className="wf-btn wf-btn-primary" style={{ width:'100%', marginTop:16 }}>post →</button>
        <div style={{ fontFamily:'Caveat', fontSize:16, color:'#8a8378', textAlign:'center', marginTop:6 }}>
          tweak any field by tapping it
        </div>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════
// SECTION 4 — DAILY PROMPT (open-app moment)
// ═════════════════════════════════════════════════════════

function PromptA() {
  return (
    <Phone label="A · Once-a-day modal">
      <div style={{ filter:'blur(.5px)', opacity:.4 }}>
        <FeedAGhost />
      </div>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.18)' }} />
      <div className="wf-box" style={{ position:'absolute', left:18, right:18, top:120, padding:16, boxShadow:'4px 4px 0 #1a1a1a' }}>
        <div className="wf-tag">good morning, alex</div>
        <div style={{ fontFamily:'Caveat',fontSize:26, fontWeight:700, lineHeight:1.05, marginTop:4 }}>
          what are you up to today?
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:14 }}>
          {[
            { n:'gym', t:'7pm — usual'},
            { n:'dinner', t:'6:30 — open invite'},
            { n:'study', t:'2-4 green library'},
            { n:'something else…', t:'' },
          ].map((s,i) => (
            <div key={i} className={i===3?'wf-dashed':'wf-box'} style={{ padding:'8px 10px', display:'flex', alignItems:'center', gap:10 }}>
              <div className="wf-mono" style={{ fontSize:11, opacity:.6, width:14 }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'Caveat', fontSize:20, fontWeight:600, lineHeight:1 }}>{s.n}</div>
                {s.t && <div className="wf-mono" style={{ fontSize:10 }}>{s.t}</div>}
              </div>
              <div style={{ fontFamily:'Caveat', fontSize:18, color:'#c96442' }}>→</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily:'Caveat', fontSize:16, color:'#8a8378', textAlign:'center', marginTop:10 }}>
          skip · ask me later
        </div>
      </div>
    </Phone>
  );
}

// faded-feed background helper (cheap clone)
function FeedAGhost() {
  return (
    <div style={{ padding:'10px 14px 0' }}>
      <div style={{ fontFamily:'Caveat',fontSize:26, fontWeight:700 }}>timeline</div>
      <div className="wf-box" style={{ padding:10, marginTop:8 }}>
        <TL /><TL w="60%" style={{ marginTop:6 }} />
      </div>
      <div className="wf-box" style={{ padding:10, marginTop:8 }}>
        <TL /><TL w="60%" style={{ marginTop:6 }} />
      </div>
      <div className="wf-box" style={{ padding:10, marginTop:8 }}>
        <TL /><TL w="60%" style={{ marginTop:6 }} />
      </div>
    </div>
  );
}

function PromptB() {
  return (
    <Phone label="B · Inline 'are you doing this?'" sub={"prompt sits at\ntop of feed"}>
      <div style={{ padding:'10px 14px 0' }}>
        <div style={{ fontFamily:'Caveat',fontSize:26, fontWeight:700 }}>timeline</div>
      </div>
      <div className="wf-soft" style={{ margin:'10px 14px', padding:12, background:'#fde68a' }}>
        <div className="wf-tag">smart pick · 9:42am</div>
        <div style={{ fontFamily:'Caveat',fontSize:22, fontWeight:700, lineHeight:1.05, marginTop:2 }}>
          gym at 7pm? you usually go thursdays.
        </div>
        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          <button className="wf-btn wf-btn-primary" style={{ flex:1 }}>yes, post it</button>
          <button className="wf-btn">no</button>
          <button className="wf-btn">edit</button>
        </div>
      </div>
      <div style={{ padding:'0 14px' }}>
        <div className="wf-tag">today</div>
        <div className="wf-box" style={{ padding:10, marginTop:6 }}>
          <div style={{ fontFamily:'Caveat',fontSize:20, fontWeight:600 }}>dinner @ arrillaga</div>
          <div className="wf-mono" style={{ fontSize:10 }}>6:30P · GREG</div>
          <Stack chs={['A','B','+']} />
        </div>
        <div className="wf-box" style={{ padding:10, marginTop:8 }}>
          <div style={{ fontFamily:'Caveat',fontSize:20, fontWeight:600 }}>movie night</div>
          <div className="wf-mono" style={{ fontSize:10 }}>9P · NAT</div>
        </div>
      </div>
      <div className="wf-fab">+</div>
      <BottomNav active={0} />
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════
// SECTION 5 — FAVORITES / FRIEND FILTERING
// ═════════════════════════════════════════════════════════

function FavA() {
  return (
    <Phone label="A · Toggle favorites filter" sub={"top toggle\nflips feed"}>
      <div style={{ padding:'10px 14px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:'Caveat',fontSize:26, fontWeight:700 }}>timeline</div>
          <div style={{ display:'flex', gap:0, border:'1.5px solid #1a1a1a', borderRadius:999, padding:2 }}>
            <span style={{ padding:'3px 10px', borderRadius:999, background:'#1a1a1a', color:'#fff', fontFamily:'Caveat', fontSize:14, fontWeight:600 }}>★ favs</span>
            <span style={{ padding:'3px 10px', fontFamily:'Caveat', fontSize:14 }}>everyone</span>
          </div>
        </div>
      </div>
      <div style={{ padding:'10px 14px 70px' }}>
        <div className="wf-tag">today · favorites only (3)</div>
        {[
          { n:'maya', e:'soccer', t:'5:30p' },
          { n:'greg', e:'dinner @ arrillaga', t:'6:30p' },
          { n:'sam', e:'late study', t:'10p' },
        ].map((x,i) => (
          <div key={i} className="wf-box" style={{ padding:10, marginTop:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <div style={{ fontFamily:'Caveat',fontSize:20, fontWeight:600 }}>{x.e}</div>
              <div className="wf-mono" style={{ fontSize:11 }}>{x.t}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span className="wf-star">★</span>
              <Av ch={x.n[0].toUpperCase()} size={20} />
              <span style={{ fontFamily:'Kalam', fontSize:12 }}>{x.n}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="wf-fab">+</div>
      <BottomNav active={0} />
    </Phone>
  );
}

function FavB() {
  return (
    <Phone label="B · Favorites manager">
      <div style={{ padding:'10px 14px' }}>
        <span style={{ fontFamily:'Caveat',fontSize:18 }}>← back</span>
        <div style={{ fontFamily:'Caveat',fontSize:26, fontWeight:700, marginTop:6 }}>your favorites</div>
        <div className="wf-tag">tap a ★ to toggle</div>
      </div>

      <div className="wf-soft" style={{ margin:'4px 14px', padding:'8px 10px', display:'flex', alignItems:'center', gap:8 }}>
        <span className="wf-mono" style={{ fontSize:12 }}>🔎</span>
        <span style={{ fontFamily:'Kalam', fontSize:13, color:'#8a8378' }}>search friends…</span>
      </div>

      <div style={{ padding:'8px 14px 70px' }}>
        <div className="wf-tag">favorites · 4</div>
        {[
          { n:'maya', s:'@maya', f:1 },
          { n:'greg', s:'@gregw', f:1 },
          { n:'sam',  s:'@sammie', f:1 },
          { n:'jess', s:'@jess', f:1 },
        ].map((x,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', borderBottom:'1px dotted #1a1a1a' }}>
            <Av ch={x.n[0].toUpperCase()} size={28} />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'Caveat',fontSize:18, fontWeight:600, lineHeight:1 }}>{x.n}</div>
              <div className="wf-mono" style={{ fontSize:10 }}>{x.s}</div>
            </div>
            <span style={{ fontSize:22, color:'#c96442' }}>★</span>
          </div>
        ))}
        <div className="wf-tag" style={{ marginTop:10 }}>everyone else</div>
        {['nat','kim','theo','riley'].map((n,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', borderBottom:'1px dotted #1a1a1a' }}>
            <Av ch={n[0].toUpperCase()} size={28} />
            <div style={{ flex:1, fontFamily:'Caveat', fontSize:18 }}>{n}</div>
            <span style={{ fontSize:22, opacity:.3 }}>☆</span>
          </div>
        ))}
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════
// SECTION 6 — OVERLAP HANDLING
// ═════════════════════════════════════════════════════════

function OverlapA() {
  return (
    <Phone label="A · Stacked back-to-back">
      <div style={{ padding:'10px 14px 0' }}>
        <div style={{ fontFamily:'Caveat',fontSize:24, fontWeight:700 }}>wed 30 · 6–8pm</div>
        <div className="wf-tag">2 events overlap. shown by start time.</div>
      </div>
      <div style={{ padding:'10px 14px 0' }}>
        <div className="wf-box" style={{ padding:10, marginBottom:8, background:'#fde68a' }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div style={{ fontFamily:'Caveat',fontSize:20, fontWeight:600 }}>dinner</div>
            <div className="wf-mono" style={{ fontSize:11 }}>6:30 – 8</div>
          </div>
          <div className="wf-mono" style={{ fontSize:10 }}>GREG · 8 GOING</div>
        </div>
        <div className="wf-box" style={{ padding:10, marginBottom:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div style={{ fontFamily:'Caveat',fontSize:20, fontWeight:600 }}>study sesh</div>
            <div className="wf-mono" style={{ fontSize:11 }}>7 – 9</div>
          </div>
          <div className="wf-mono" style={{ fontSize:10 }}>SAM · 3 GOING</div>
          <div className="wf-note" style={{ marginTop:4 }}>↖ overlaps dinner by 1h</div>
        </div>
        <div className="wf-box" style={{ padding:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div style={{ fontFamily:'Caveat',fontSize:20, fontWeight:600 }}>movie</div>
            <div className="wf-mono" style={{ fontSize:11 }}>9</div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function OverlapB() {
  return (
    <Phone label="B · Side-by-side overlap">
      <div style={{ padding:'10px 14px 0' }}>
        <div style={{ fontFamily:'Caveat',fontSize:24, fontWeight:700 }}>wed 30</div>
        <div className="wf-tag">overlapping events sit side-by-side</div>
      </div>
      <div style={{ position:'relative', padding:'10px 14px 0', height:H-90 }}>
        <div style={{ position:'absolute', left:46, top:14, bottom:14, borderLeft:'2px dotted #1a1a1a' }} />
        {[
          { t:'5p',  rows:[{ x:0, w:1, n:'soccer', tt:'5:30-7' }] },
          { t:'6p',  rows:[{ x:0, w:.5, n:'dinner', tt:'6:30-8', hl:1 }, { x:.5, w:.5, n:'study', tt:'7-9' }] },
          { t:'9p',  rows:[{ x:0, w:1, n:'movie', tt:'9-11' }] },
        ].map((row,i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, position:'relative', marginBottom:14 }}>
            <div className="wf-mono" style={{ width:30, textAlign:'right', fontSize:11, paddingTop:3 }}>{row.t}</div>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#fff', border:'1.5px solid #1a1a1a', marginTop:4, position:'relative', zIndex:1 }} />
            <div style={{ flex:1, position:'relative', height: row.rows.length>1 ? 56 : 50 }}>
              {row.rows.map((r,j) => (
                <div key={j} className="wf-box" style={{ position:'absolute', left:`${r.x*100}%`, width:`calc(${r.w*100}% - 4px)`, padding:6, background: r.hl?'#fde68a':'#fff' }}>
                  <div style={{ fontFamily:'Caveat',fontSize:16, fontWeight:600, lineHeight:1 }}>{r.n}</div>
                  <div className="wf-mono" style={{ fontSize:9 }}>{r.tt}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Phone>
  );
}

function OverlapC() {
  return (
    <Phone label="C · 'Pick one' conflict prompt" sub={"when YOU rsvp\nto a conflict"}>
      <div style={{ padding:'10px 14px 0' }}>
        <div style={{ fontFamily:'Caveat',fontSize:24, fontWeight:700 }}>conflict</div>
        <div className="wf-tag">you rsvp'd to dinner. study overlaps.</div>
      </div>
      <div style={{ padding:'14px' }}>
        <div className="wf-soft" style={{ padding:12, background:'#fde68a' }}>
          <div className="wf-tag">already going</div>
          <div style={{ fontFamily:'Caveat', fontSize:24, fontWeight:700 }}>dinner @ arrillaga</div>
          <div className="wf-mono" style={{ fontSize:10 }}>WED 6:30 – 8 · GREG</div>
        </div>
        <div style={{ textAlign:'center', fontFamily:'Caveat', fontSize:18, color:'#c96442', margin:'8px 0' }}>↕ overlap by ~1h</div>
        <div className="wf-box" style={{ padding:12 }}>
          <div className="wf-tag">trying to join</div>
          <div style={{ fontFamily:'Caveat', fontSize:24, fontWeight:700 }}>study sesh</div>
          <div className="wf-mono" style={{ fontSize:10 }}>WED 7 – 9 · SAM</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:14 }}>
          <button className="wf-btn">join both — i'll figure it out</button>
          <button className="wf-btn wf-btn-primary">swap → join study, drop dinner</button>
          <button className="wf-btn">cancel</button>
        </div>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════
// SECTION 7 — PROFILE / "what they're going to"
// ═════════════════════════════════════════════════════════

function ProfileA() {
  return (
    <Phone label="A · Friend profile">
      <div style={{ padding:'10px 14px' }}>
        <span style={{ fontFamily:'Caveat',fontSize:18 }}>← back</span>
      </div>
      <div style={{ padding:'10px 14px', display:'flex', flexDirection:'column', alignItems:'center' }}>
        <Av ch="G" size={64} />
        <div style={{ fontFamily:'Caveat', fontSize:28, fontWeight:700, marginTop:6 }}>greg</div>
        <div className="wf-mono" style={{ fontSize:10 }}>@gregw</div>
        <button className="wf-btn" style={{ marginTop:8 }}>★ favorite</button>
      </div>

      <div style={{ padding:'10px 14px' }}>
        <div className="wf-tag">going to (in your feed)</div>
        <div className="wf-box" style={{ padding:10, marginTop:6 }}>
          <div style={{ fontFamily:'Caveat',fontSize:18, fontWeight:600 }}>dinner @ arrillaga</div>
          <div className="wf-mono" style={{ fontSize:10 }}>WED 6:30P · HE POSTED</div>
        </div>
        <div className="wf-box" style={{ padding:10, marginTop:6 }}>
          <div style={{ fontFamily:'Caveat',fontSize:18, fontWeight:600 }}>movie night</div>
          <div className="wf-mono" style={{ fontSize:10 }}>WED 9P · BY NAT</div>
        </div>
        <div className="wf-tag" style={{ marginTop:10 }}>1 hidden — not in your feed</div>
        <div className="wf-dashed" style={{ padding:8, marginTop:6, fontFamily:'Kalam', fontSize:12, color:'#8a8378' }}>
          private — only people who follow max can see
        </div>
      </div>
    </Phone>
  );
}

// ═════════════════════════════════════════════════════════
// LANDING / TITLE artboard
// ═════════════════════════════════════════════════════════
function Title() {
  return (
    <div style={{ width: 540, height: 360, padding:30, fontFamily:'Caveat, cursive' }}>
      <div className="wf-tag" style={{ fontSize:11 }}>cs278 · low-fi exploration</div>
      <div style={{ fontSize:64, fontWeight:700, lineHeight:.95, marginTop:8 }}>
        timeline.
      </div>
      <div style={{ fontFamily:'Kalam', fontSize:16, marginTop:12, lineHeight:1.4, maxWidth:420 }}>
        a social events app where friends post open-invite plans on a horizontal day-rail (today → +15d). see who's doing what, RSVP, comment, and favorite people to filter the feed.
      </div>
      <div className="wf-tag" style={{ marginTop:18, fontSize:11 }}>what these wireframes explore</div>
      <ul style={{ fontFamily:'Kalam', fontSize:14, lineHeight:1.4, paddingLeft:18, marginTop:6 }}>
        <li>4 takes on the timeline / feed shape</li>
        <li>3 takes on the event detail card</li>
        <li>3 ways to add an event (incl. claude-style suggestion picker)</li>
        <li>2 daily-prompt patterns (modal vs. inline)</li>
        <li>2 favorites/filtering treatments</li>
        <li>3 ways to handle overlapping events</li>
        <li>profile · "what they're going to" (feed-scoped)</li>
      </ul>
      <div style={{ position:'absolute', right:30, bottom:24, fontFamily:'Caveat', fontSize:18, color:'#c96442' }}>
        scroll, drag artboards, click ⤢ to focus →
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════
// CANVAS
// ═════════════════════════════════════════════════════════
function App() {
  return (
    <DesignCanvas>
      <DCSection id="intro" title="Timeline — wireframes" subtitle="low-fi exploration of the events social app">
        <DCArtboard id="title" label="overview" width={540} height={360}><Title /></DCArtboard>
      </DCSection>

      <DCSection id="feed" title="1 · timeline / feed" subtitle="how do you see what your friends are doing?">
        <DCArtboard id="feedA" label="A · day-stacked (canon)" width={FW} height={FH}><FeedA /></DCArtboard>
        <DCArtboard id="feedB" label="B · 15-day horizontal" width={FW} height={FH}><FeedB /></DCArtboard>
        <DCArtboard id="feedC" label="C · time-of-day spine" width={FW} height={FH}><FeedC /></DCArtboard>
        <DCArtboard id="feedD" label="D · friends-as-rows" width={FW} height={FH}><FeedD /></DCArtboard>
      </DCSection>

      <DCSection id="detail" title="2 · event detail" subtitle="rsvp, comments, who's going">
        <DCArtboard id="dA" label="A · classic" width={FW} height={FH}><DetailA /></DCArtboard>
        <DCArtboard id="dB" label="B · photo-first" width={FW} height={FH}><DetailB /></DCArtboard>
        <DCArtboard id="dC" label="C · sticky-note" width={FW} height={FH}><DetailC /></DCArtboard>
      </DCSection>

      <DCSection id="add" title="3 · add an event" subtitle="suggestion-first vs. manual">
        <DCArtboard id="addA" label="A · suggest 4 (claude-style)" width={FW} height={FH}><AddA /></DCArtboard>
        <DCArtboard id="addB" label="B · manual form" width={FW} height={FH}><AddB /></DCArtboard>
        <DCArtboard id="addC" label="C · smart one-liner" width={FW} height={FH}><AddC /></DCArtboard>
      </DCSection>

      <DCSection id="prompt" title="4 · daily prompt" subtitle="open the app → 'are you doing this?'">
        <DCArtboard id="pA" label="A · once-a-day modal" width={FW} height={FH}><PromptA /></DCArtboard>
        <DCArtboard id="pB" label="B · inline at top of feed" width={FW} height={FH}><PromptB /></DCArtboard>
      </DCSection>

      <DCSection id="fav" title="5 · favorites & filtering" subtitle="see only the people you care about">
        <DCArtboard id="favA" label="A · feed toggle" width={FW} height={FH}><FavA /></DCArtboard>
        <DCArtboard id="favB" label="B · favorites manager" width={FW} height={FH}><FavB /></DCArtboard>
      </DCSection>

      <DCSection id="overlap" title="6 · handling overlaps" subtitle="two events at the same time — what do we do?">
        <DCArtboard id="oA" label="A · stacked by start time" width={FW} height={FH}><OverlapA /></DCArtboard>
        <DCArtboard id="oB" label="B · side-by-side blocks" width={FW} height={FH}><OverlapB /></DCArtboard>
        <DCArtboard id="oC" label="C · 'pick one' on rsvp" width={FW} height={FH}><OverlapC /></DCArtboard>
      </DCSection>

      <DCSection id="profile" title="7 · profile" subtitle="what they're attending — feed-scoped only">
        <DCArtboard id="prA" label="A · friend profile" width={FW} height={FH}><ProfileA /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
