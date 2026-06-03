// Timeline — hi-fi screens
// All screens use components from tl-base.jsx (StatusBar, TabBar, Fab, Icon, Avatar, AvatarStack)
// Each screen is a 390×844 phone-sized board. Theme classes (.v-warm, .v-mono) wrap the screen.

const SCR_W = 390;
const SCR_H = 844;

// ─────────────────────────── shared bits ───────────────────────────
function Screen({ theme = 'warm', children, light }) {
  return (
    <div className={`tl v-${theme}`}>
      <div className="tl-screen">
        <StatusBar light={light} />
        {children}
        <div className="tl-home" />
      </div>
    </div>
  );
}

function DayStrip({ active = 1 }) {
  const days = [
    { d:'TUE', n:29 }, { d:'WED', n:30 }, { d:'THU', n:1 },
    { d:'FRI', n:2 }, { d:'SAT', n:3 }, { d:'SUN', n:4 }, { d:'MON', n:5 },
  ];
  return (
    <div style={{ display:'flex', gap:6, padding:'4px 16px 0' }}>
      {days.map((x,i) => {
        const on = i === active;
        return (
          <div key={i} style={{
            flex:1, textAlign:'center', padding:'8px 0', borderRadius:12,
            background: on ? 'var(--ink)' : 'transparent',
            color: on ? 'var(--paper)' : 'var(--ink-2)',
            border: on ? '1px solid var(--ink)' : '1px solid transparent',
          }}>
            <div style={{ fontSize:9, letterSpacing:'.08em', opacity: on?.7:.5, fontWeight:600 }} className="tl-mono">{x.d}</div>
            <div style={{ fontSize:17, fontWeight:600, marginTop:2 }}>{x.n}</div>
          </div>
        );
      })}
    </div>
  );
}

// Event row used in the day-stacked feed
function EventRow({ title, time, host, place, going = [], moreCount = 0, joined, photo, accent, onAccent }) {
  return (
    <div className="tl-card" style={{ padding:14, marginTop:10 }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <span className="tl-mono" style={{ fontSize:11, color:'var(--ink-2)', fontWeight:600, whiteSpace:'nowrap', flexShrink:0 }}>{time}</span>
            {accent && <span className="tl-pill accent" style={{ padding:'2px 8px', fontSize:10, fontWeight:600, whiteSpace:'nowrap', flexShrink:0 }}>{accent}</span>}
            {onAccent}
          </div>
          <div style={{ fontSize:18, fontWeight:600, lineHeight:1.2, marginTop:4 }}>{title}</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>{host} · {place}</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <AvatarStack items={going} size={22} more={moreCount} />
              <span style={{ fontSize:12, color:'var(--muted)' }}>{going.length + moreCount} going</span>
            </div>
            {joined ? (
              <span className="tl-pill is-on" style={{ padding:'4px 12px' }}>✓ in</span>
            ) : (
              <button className="tl-btn" style={{ height:32, fontSize:13, padding:'0 14px' }}>Join</button>
            )}
          </div>
        </div>
        {photo && (
          <div className={`tl-photo ${photo}`} style={{ width:64, height:64, flex:'0 0 64px' }} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── 1A. FEED — warm system ───────────────────────────
function Feed_Warm() {
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 18px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div className="tl-tag">wed apr 30</div>
          <div className="tl-display" style={{ fontSize:34, lineHeight:1, fontWeight:700, marginTop:2 }}>Today.</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="tl-btn ghost" style={{ width:40, height:40, padding:0, borderRadius:999 }}>{Icon.search}</button>
          <button className="tl-btn ghost" style={{ width:40, height:40, padding:0, borderRadius:999 }}>{Icon.bell}</button>
        </div>
      </div>

      <DayStrip active={1} />

      <div style={{ padding:'10px 16px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div className="tl-segment">
          <button className="on">★ Favorites</button>
          <button>Everyone</button>
        </div>
        <span className="tl-tag">5 events</span>
      </div>

      {/* Inline daily prompt */}
      <div style={{ padding:'12px 16px 0' }}>
        <div className="tl-card" style={{ padding:14, background:'var(--accent-soft)', borderColor:'color-mix(in oklab, var(--accent) 25%, transparent)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div className="tl-tag" style={{ color:'var(--accent-ink)' }}>your turn · 9:42a</div>
            <button className="tl-btn ghost" style={{ width:28, height:28, padding:0, color:'var(--accent-ink)' }}>{Icon.close}</button>
          </div>
          <div style={{ fontSize:18, fontWeight:600, marginTop:4, color:'var(--accent-ink)' }}>
            Going to the gym at 7? You usually do Thursdays.
          </div>
          <div style={{ display:'flex', gap:8, marginTop:10 }}>
            <button className="tl-btn accent" style={{ flex:1, height:40 }}>Yes, post it</button>
            <button className="tl-btn" style={{ height:40 }}>Edit</button>
            <button className="tl-btn ghost" style={{ height:40 }}>No</button>
          </div>
        </div>
      </div>

      <div className="scroll-hidden" style={{ padding:'8px 16px 200px', overflow:'hidden' }}>
        <EventRow
          time="5:30 PM"
          title="Pickup soccer"
          host="Maya"
          place="Roble Field"
          going={[{ch:'M',tone:'b1'},{ch:'J',tone:'b3'},{ch:'K',tone:'b2'}]}
          moreCount={3}
          photo="green"
          accent="happening soon"
        />
        <EventRow
          time="6:30 PM"
          title="Dinner at Arrillaga"
          host="Greg"
          place="Open invite · come thru"
          going={[{ch:'A',tone:'b4'},{ch:'B',tone:'b2'},{ch:'C',tone:'b1'},{ch:'D',tone:'b5'}]}
          moreCount={4}
          photo="warm"
          joined
        />
        <EventRow
          time="9:00 PM"
          title="Movie night — Past Lives"
          host="Nat"
          place="Suites lounge"
          going={[{ch:'N',tone:'b3'},{ch:'R',tone:'b5'}]}
          photo="blue"
        />

        <div style={{ display:'flex', alignItems:'baseline', gap:10, margin:'18px 0 4px' }}>
          <div className="tl-display" style={{ fontSize:24, fontWeight:700 }}>Tomorrow</div>
          <div className="tl-tag">thu may 1</div>
        </div>
        <EventRow
          time="7:00 AM"
          title="Run + coffee"
          host="Sam"
          place="The Dish loop"
          going={[{ch:'S',tone:'b2'}]}
          photo="green"
        />
      </div>

      <Fab />
      <TabBar active={0} />
    </Screen>
  );
}

// ─────────────────────────── 1B. FEED — mono system ───────────────────────────
function Feed_Mono() {
  return (
    <Screen theme="mono">
      <div style={{ padding:'4px 20px 0' }}>
        <div className="tl-tag">timeline</div>
        <div style={{ fontSize:30, fontWeight:700, lineHeight:1.05, marginTop:2, letterSpacing:'-0.02em' }}>
          Wednesday<br/>April 30
        </div>
      </div>

      <DayStrip active={1} />

      <div style={{ padding:'14px 20px 0' }}>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div className="tl-segment">
            <button className="on">★ Favorites</button>
            <button>Everyone</button>
          </div>
          <button className="tl-btn ghost" style={{ width:36, height:36, padding:0, marginLeft:'auto' }}>{Icon.filter}</button>
        </div>
      </div>

      <div className="scroll-hidden" style={{ padding:'14px 20px 200px', overflow:'hidden' }}>
        {/* timeline items, denser, no photos, with thin time spine */}
        {[
          { t:'5:30p', n:'Pickup soccer', h:'Maya', p:'Roble field', go:[{ch:'M',tone:'b1'},{ch:'J',tone:'b3'}], m:3 },
          { t:'6:30p', n:'Dinner at Arrillaga', h:'Greg', p:'Open invite', go:[{ch:'A',tone:'b4'},{ch:'B',tone:'b2'},{ch:'C',tone:'b1'}], m:5, joined:true },
          { t:'9:00p', n:'Movie night', h:'Nat', p:'Suites lounge', go:[{ch:'N',tone:'b3'}], m:1 },
        ].map((e,i) => (
          <div key={i} style={{ display:'flex', gap:12, paddingTop: i===0?0:14 }}>
            <div style={{ width:54, paddingTop:2 }}>
              <div className="tl-mono" style={{ fontSize:13, fontWeight:600 }}>{e.t}</div>
            </div>
            <div className="tl-card" style={{ flex:1, padding:14 }}>
              <div style={{ fontSize:17, fontWeight:600 }}>{e.n}</div>
              <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>{e.h} · {e.p}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <AvatarStack items={e.go} size={22} more={e.m} />
                  <span style={{ fontSize:12, color:'var(--muted)' }}>{e.go.length + e.m} going</span>
                </div>
                {e.joined
                  ? <span className="tl-pill is-on" style={{ padding:'4px 12px' }}>✓ joined</span>
                  : <button className="tl-btn" style={{ height:32, fontSize:13, padding:'0 14px' }}>Join</button>
                }
              </div>
            </div>
          </div>
        ))}

        <div style={{ display:'flex', gap:10, alignItems:'baseline', marginTop:22 }}>
          <div style={{ fontSize:18, fontWeight:700, letterSpacing:'-0.01em' }}>Tomorrow</div>
          <div className="tl-tag">thu may 1</div>
        </div>
        <div style={{ display:'flex', gap:12, marginTop:8 }}>
          <div style={{ width:54, paddingTop:2 }}><div className="tl-mono" style={{ fontSize:13, fontWeight:600 }}>7:00a</div></div>
          <div className="tl-card" style={{ flex:1, padding:14 }}>
            <div style={{ fontSize:17, fontWeight:600 }}>Run + coffee</div>
            <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>Sam · The Dish loop</div>
          </div>
        </div>
      </div>

      <Fab />
      <TabBar active={0} />
    </Screen>
  );
}

// ─────────────────────────── 2A. EVENT DETAIL — w/ image ───────────────────────────
function Detail_Image() {
  return (
    <Screen theme="warm">
      <div className="tl-photo warm" style={{ position:'absolute', top:0, left:0, right:0, height:340, borderRadius:0 }}>
        {/* fade to paper */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 50%, var(--paper) 100%)' }} />
        <div style={{ position:'absolute', top:50, left:18, right:18, display:'flex', justifyContent:'space-between' }}>
          <button className="tl-btn ghost" style={{ width:40, height:40, padding:0, background:'rgba(255,255,255,0.85)' }}>{Icon.back}</button>
          <button className="tl-btn ghost" style={{ width:40, height:40, padding:0, background:'rgba(255,255,255,0.85)' }}>{Icon.more}</button>
        </div>
      </div>

      <div style={{ position:'absolute', top:260, left:0, right:0, bottom:0, padding:'0 20px 100px', overflow:'hidden' }}>
        <div className="tl-mono" style={{ fontSize:11, color:'var(--accent-ink)', fontWeight:600, letterSpacing:'.06em' }}>WED APR 30 · 6:30 – 8:00 PM</div>
        <div style={{ fontSize:30, fontWeight:700, lineHeight:1.1, marginTop:6, letterSpacing:'-0.02em' }}>Dinner at Arrillaga</div>

        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:12 }}>
          <Avatar ch="G" tone="b4" size={36} />
          <div>
            <div style={{ fontSize:14, fontWeight:600 }}>Greg posted</div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>Open invite · 2h ago</div>
          </div>
          <button className="tl-btn ghost" style={{ marginLeft:'auto', height:32, fontSize:13, padding:'0 12px' }}>{Icon.star(false)} Favorite</button>
        </div>

        <div className="tl-card" style={{ padding:14, marginTop:14, display:'flex', gap:12 }}>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:10 }}>
            {Icon.pin}
            <div>
              <div style={{ fontSize:14, fontWeight:600 }}>Arrillaga Family Dining</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>340 Jane Stanford Way</div>
            </div>
          </div>
          <div style={{ width:1, background:'var(--hair)' }} />
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {Icon.clock}
            <div>
              <div style={{ fontSize:14, fontWeight:600 }}>1h 30m</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>flexible</div>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:18 }}>
          <div className="tl-tag">8 going</div>
          <button style={{ background:'transparent', border:0, fontSize:13, fontWeight:600, color:'var(--accent-ink)' }}>See all</button>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:10, alignItems:'center' }}>
          {[
            ['M','b1'],['J','b3'],['A','b4'],['B','b2'],['C','b1'],['D','b5'],
          ].map(([c,t],i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <Avatar ch={c} tone={t} size={36} />
              <span style={{ fontSize:10, color:'var(--muted)' }}>{['Maya','Jess','Ana','Ben','Cy','Dan'][i]}</span>
            </div>
          ))}
          <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--soft)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'var(--muted)', fontWeight:600 }}>+2</div>
        </div>
      </div>

      {/* sticky CTA */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'12px 16px 28px', background:'linear-gradient(180deg, transparent 0%, var(--paper) 30%)' }}>
        <div style={{ display:'flex', gap:10 }}>
          <button className="tl-btn primary" style={{ flex:1, height:52, fontSize:16 }}>I'm in</button>
          <button className="tl-btn" style={{ height:52, padding:'0 18px' }}>Maybe</button>
          <button className="tl-btn ghost" style={{ width:52, height:52, padding:0 }}>{Icon.comment}</button>
        </div>
      </div>
    </Screen>
  );
}

// ─────────────────────────── 2B. EVENT DETAIL — text-forward (no image) ───────────────────────────
function Detail_NoImage() {
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 18px 0', display:'flex', justifyContent:'space-between' }}>
        <button className="tl-btn ghost" style={{ width:40, height:40, padding:0 }}>{Icon.back}</button>
        <button className="tl-btn ghost" style={{ width:40, height:40, padding:0 }}>{Icon.more}</button>
      </div>

      <div style={{ padding:'10px 22px 0' }}>
        <div className="tl-mono" style={{ fontSize:11, color:'var(--accent-ink)', fontWeight:600, letterSpacing:'.06em' }}>WED APR 30 · 6:30 – 8 PM</div>
        <div className="tl-display" style={{ fontSize:50, lineHeight:0.95, fontWeight:700, marginTop:8, letterSpacing:'-0.01em' }}>
          Dinner at<br/>Arrillaga.
        </div>
        <div style={{ fontSize:16, color:'var(--muted)', marginTop:10, lineHeight:1.45 }}>
          Open invite. Roll thru — I'll grab a long table on the right side near the windows. Bringing cards.
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:18 }}>
          <Avatar ch="G" tone="b4" size={32} />
          <span style={{ fontSize:14 }}><b>Greg</b> · 2h ago</span>
        </div>

        <div className="tl-divider" style={{ margin:'18px 0' }} />

        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          {Icon.pin}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600 }}>Arrillaga Family Dining</div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>340 Jane Stanford Way</div>
          </div>
          <button className="tl-btn ghost" style={{ height:32, fontSize:13, padding:'0 12px' }}>Map</button>
        </div>
        <div className="tl-divider" style={{ margin:'14px 0' }} />
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          {Icon.clock}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600 }}>About 1h 30m</div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>flexible — come / go</div>
          </div>
        </div>
        <div className="tl-divider" style={{ margin:'14px 0' }} />

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div className="tl-tag">8 going</div>
          <button style={{ background:'transparent', border:0, fontSize:13, fontWeight:600, color:'var(--accent-ink)' }}>See all</button>
        </div>
        <div style={{ display:'flex', gap:6, marginTop:10 }}>
          <AvatarStack items={[{ch:'M',tone:'b1'},{ch:'J',tone:'b3'},{ch:'A',tone:'b4'},{ch:'B',tone:'b2'},{ch:'C',tone:'b1'}]} size={32} more={3} />
        </div>
      </div>

      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'12px 16px 28px', background:'var(--paper)', borderTop:'1px solid var(--hair)' }}>
        <div style={{ display:'flex', gap:10 }}>
          <button className="tl-btn primary" style={{ flex:1, height:52, fontSize:16 }}>I'm in</button>
          <button className="tl-btn" style={{ height:52, padding:'0 18px' }}>Maybe</button>
          <button className="tl-btn ghost" style={{ width:52, height:52, padding:0 }}>{Icon.comment}</button>
        </div>
      </div>
    </Screen>
  );
}

// ─────────────────────────── 2C. COMMENTS ───────────────────────────
function Detail_Comments() {
  const comments = [
    { ch:'J', tone:'b3', n:'Jess', t:'10m', m:'i\'ll bring oat milk just in case', likes:2 },
    { ch:'K', tone:'b2', n:'Kim', t:'8m', m:'going!! who\'s parking?' },
    { ch:'A', tone:'b4', n:'Ana', t:'4m', m:'Greg you said long table by window right' },
    { ch:'G', tone:'b4', n:'Greg', t:'2m', m:'yes, right side. i\'ll be there at 6:25' },
  ];
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 18px 0', display:'flex', alignItems:'center', gap:8 }}>
        <button className="tl-btn ghost" style={{ width:40, height:40, padding:0 }}>{Icon.back}</button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:600 }}>Dinner at Arrillaga</div>
          <div className="tl-tag">14 comments · 8 going</div>
        </div>
      </div>

      <div className="tl-divider" style={{ marginTop:10 }} />

      <div className="scroll-hidden" style={{ padding:'14px 18px 100px', overflow:'hidden' }}>
        {comments.map((c,i) => (
          <div key={i} style={{ display:'flex', gap:10, paddingBottom:14 }}>
            <Avatar ch={c.ch} tone={c.tone} size={32} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13 }}>
                <b>{c.n}</b> <span style={{ color:'var(--muted)' }}>· {c.t}</span>
              </div>
              <div style={{ fontSize:15, marginTop:2, lineHeight:1.4 }}>{c.m}</div>
              <div style={{ display:'flex', gap:14, marginTop:6, color:'var(--muted)', fontSize:12 }}>
                <span>Reply</span>
                {c.likes ? <span>♥ {c.likes}</span> : <span>♡</span>}
              </div>
            </div>
          </div>
        ))}

        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 0' }}>
          <div style={{ flex:1, height:1, background:'var(--hair)' }} />
          <span className="tl-tag">+ 3 going just rsvp'd</span>
          <div style={{ flex:1, height:1, background:'var(--hair)' }} />
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <Avatar ch="N" tone="b3" size={32} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13 }}><b>Nat</b> <span style={{ color:'var(--muted)' }}>· just now</span></div>
            <div style={{ fontSize:15, marginTop:2 }}>swinging by movie night after, anyone want a ride at 8:45</div>
          </div>
        </div>
      </div>

      {/* Composer */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'10px 14px 26px', background:'var(--paper)', borderTop:'1px solid var(--hair)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Avatar ch="A" tone="b1" size={32} />
          <div style={{ flex:1, position:'relative' }}>
            <input className="tl-input" placeholder="Write something…" style={{ paddingRight:44 }} />
            <button style={{ position:'absolute', right:6, top:'50%', transform:'translateY(-50%)', width:36, height:36, borderRadius:999, background:'var(--ink)', color:'var(--paper)', border:0, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.send}</button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ─────────────────────────── 3A. ADD EVENT — manual form ───────────────────────────
function Add_Form() {
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 16px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button className="tl-btn ghost" style={{ height:36, padding:'0 12px', fontSize:14 }}>Cancel</button>
        <div style={{ fontSize:15, fontWeight:600 }}>New event</div>
        <button className="tl-btn primary" style={{ height:36, padding:'0 16px', fontSize:14 }}>Post</button>
      </div>

      <div className="scroll-hidden" style={{ padding:'14px 18px 40px', overflow:'hidden' }}>
        <div className="tl-tag">what</div>
        <input className="tl-input" placeholder="Dinner, gym, study sesh…" defaultValue="Dinner at Arrillaga" style={{ marginTop:6, fontSize:18, fontWeight:600, padding:'14px' }} />
        <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
          {[['Dinner','b4'],['Gym','b2'],['Study','b3'],['Brunch','b5'],['Movie','b1']].map(([t,tone],i) => (
            <span key={i} className="tl-pill" style={{ padding:'6px 12px' }}>
              <span style={{ width:8, height:8, borderRadius:99, background:`var(--accent)`, opacity:.5, marginRight:4 }} /> {t}
            </span>
          ))}
        </div>

        <div className="tl-tag" style={{ marginTop:18 }}>when</div>
        <div style={{ display:'flex', gap:8, marginTop:6 }}>
          <span className="tl-pill is-on" style={{ padding:'8px 14px' }}>Today</span>
          <span className="tl-pill" style={{ padding:'8px 14px' }}>Tomorrow</span>
          <span className="tl-pill" style={{ padding:'8px 14px' }}>Fri 2</span>
          <span className="tl-pill" style={{ padding:'8px 14px' }}>Pick…</span>
        </div>
        <div className="tl-card" style={{ padding:'14px 16px', marginTop:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>Starts</div>
            <div className="tl-mono" style={{ fontSize:18, fontWeight:600 }}>6:30 PM</div>
          </div>
          <div style={{ width:1, height:40, background:'var(--hair)' }} />
          <div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>Duration <span style={{ fontSize:11 }}>(opt)</span></div>
            <div className="tl-mono" style={{ fontSize:18, fontWeight:600 }}>~ 1h 30m</div>
          </div>
        </div>

        <div className="tl-tag" style={{ marginTop:18 }}>where <span style={{ textTransform:'none', letterSpacing:0 }}>(optional)</span></div>
        <div className="tl-card" style={{ padding:'12px 14px', marginTop:6, display:'flex', alignItems:'center', gap:10 }}>
          {Icon.pin}
          <span style={{ fontSize:15 }}>Arrillaga Family Dining</span>
        </div>

        <div className="tl-tag" style={{ marginTop:18 }}>who can join</div>
        <div className="tl-card" style={{ padding:4, marginTop:6 }}>
          {[
            { lbl:'Open · everyone', sub:'anyone in your network can see + join', on:true },
            { lbl:'Favorites only', sub:'just people you ★', on:false },
            { lbl:'Pick people', sub:'specific friends', on:false },
          ].map((o,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 12px', borderTop: i?'1px solid var(--hair)':'none' }}>
              <div style={{ width:18, height:18, borderRadius:999, border:'1.5px solid var(--hair-2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {o.on && <div style={{ width:10, height:10, borderRadius:999, background:'var(--ink)' }} />}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600 }}>{o.lbl}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{o.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="tl-tag" style={{ marginTop:18 }}>say more <span style={{ textTransform:'none', letterSpacing:0 }}>(optional)</span></div>
        <textarea className="tl-input" rows={3} placeholder="Long table by the window. Bringing cards." style={{ marginTop:6, resize:'none', fontFamily:'inherit' }} />

        <div className="tl-tag" style={{ marginTop:18 }}>photo <span style={{ textTransform:'none', letterSpacing:0 }}>(optional)</span></div>
        <div style={{ display:'flex', gap:8, marginTop:6 }}>
          <div className="tl-photo warm" style={{ width:80, height:80 }} />
          <div style={{ width:80, height:80, border:'1.5px dashed var(--hair-2)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)' }}>
            {Icon.plus}
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ─────────────────────────── 3B. ADD EVENT — split (suggest + manual) ───────────────────────────
function Add_Split() {
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 16px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button className="tl-btn ghost" style={{ height:36, padding:'0 12px', fontSize:14 }}>Cancel</button>
        <div style={{ fontSize:15, fontWeight:600 }}>Add event</div>
        <span style={{ width:60 }} />
      </div>

      <div style={{ padding:'14px 18px 0' }}>
        <div className="tl-display" style={{ fontSize:30, fontWeight:700, lineHeight:1.05 }}>What's the move?</div>
        <div style={{ fontSize:14, color:'var(--muted)', marginTop:4 }}>Pick something you usually do, or start fresh.</div>
      </div>

      <div style={{ padding:'14px 18px 0' }}>
        <div className="tl-tag">your usuals</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:8 }}>
          {[
            { i:'🍽', n:'Dinner', sub:'open invite · ~6:30p · 12× this quarter' },
            { i:'🏋', n:'Gym',    sub:'arc · ~7p · 8× this month' },
            { i:'📚', n:'Study sesh', sub:'green library · 2h · last: monday' },
            { i:'🌅', n:'Brunch',  sub:'coupa · weekends' },
          ].map((s,i) => (
            <button key={i} className="tl-card" style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:12, textAlign:'left', border:'1px solid var(--hair)', background:'var(--card)' }}>
              <div style={{ width:36, height:36, borderRadius:10, background:'var(--soft)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{s.i}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:600 }}>{s.n}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{s.sub}</div>
              </div>
              <span style={{ color:'var(--muted)' }}>›</span>
            </button>
          ))}
        </div>
        <button className="tl-btn" style={{ width:'100%', marginTop:14, height:48 }}>+ Start from scratch</button>
      </div>

      <Fab />
      <TabBar active={2} />
    </Screen>
  );
}

// ─────────────────────────── 4A. DAILY PROMPT — modal ───────────────────────────
function Prompt_Modal() {
  return (
    <Screen theme="warm">
      {/* dimmed feed behind */}
      <div style={{ padding:'4px 18px 0', opacity:.35, filter:'blur(1px)' }}>
        <div className="tl-tag">wed apr 30</div>
        <div className="tl-display" style={{ fontSize:34, lineHeight:1, fontWeight:700, marginTop:2 }}>Today.</div>
        <DayStrip active={1} />
        <div className="tl-card" style={{ padding:14, marginTop:14 }}>
          <div style={{ fontSize:16, fontWeight:600 }}>Pickup soccer</div>
          <div style={{ fontSize:13, color:'var(--muted)' }}>Maya · 5:30p</div>
        </div>
        <div className="tl-card" style={{ padding:14, marginTop:10 }}>
          <div style={{ fontSize:16, fontWeight:600 }}>Dinner at Arrillaga</div>
          <div style={{ fontSize:13, color:'var(--muted)' }}>Greg · 6:30p</div>
        </div>
      </div>
      <div style={{ position:'absolute', inset:0, background:'rgba(20,16,12,.34)' }} />

      {/* sheet */}
      <div className="tl-bottomsheet" style={{ paddingBottom:30 }}>
        <div className="tl-grabber" />
        <div style={{ padding:'4px 22px 0' }}>
          <div className="tl-tag">good morning, alex</div>
          <div className="tl-display" style={{ fontSize:30, fontWeight:700, lineHeight:1.05, marginTop:4 }}>What are you up to today?</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>Tap one to post in seconds.</div>
        </div>

        <div style={{ padding:'14px 18px 0', display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { i:'🏋', n:'Gym',    t:'7:00 PM',  sub:'usual · arc' },
            { i:'🍽', n:'Dinner',  t:'6:30 PM',  sub:'open invite' },
            { i:'📚', n:'Study sesh', t:'2 – 4 PM', sub:'green library' },
          ].map((o,i) => (
            <button key={i} className="tl-card" style={{ padding:14, display:'flex', alignItems:'center', gap:12, textAlign:'left', background:'var(--card)' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'var(--soft)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{o.i}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:16, fontWeight:600 }}>{o.n}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{o.sub}</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span className="tl-mono" style={{ fontSize:13, fontWeight:600 }}>{o.t}</span>
                <span style={{ width:30, height:30, borderRadius:999, background:'var(--ink)', color:'var(--paper)', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.check}</span>
              </div>
            </button>
          ))}
          <button className="tl-btn ghost" style={{ height:44, marginTop:4 }}>+ Something else</button>
          <button className="tl-btn ghost" style={{ height:36, color:'var(--muted)', fontWeight:500 }}>Skip — ask me later</button>
        </div>
      </div>
    </Screen>
  );
}

// ─────────────────────────── 4B. DAILY PROMPT — inline at top ───────────────────────────
function Prompt_Inline() {
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 18px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div className="tl-tag">wed apr 30</div>
          <div className="tl-display" style={{ fontSize:34, lineHeight:1, fontWeight:700, marginTop:2 }}>Today.</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="tl-btn ghost" style={{ width:40, height:40, padding:0 }}>{Icon.search}</button>
          <button className="tl-btn ghost" style={{ width:40, height:40, padding:0 }}>{Icon.bell}</button>
        </div>
      </div>

      <DayStrip active={1} />

      {/* big inline prompt card */}
      <div style={{ padding:'12px 16px 0' }}>
        <div className="tl-card" style={{ padding:16, background:'var(--ink)', color:'var(--paper)', borderColor:'var(--ink)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div className="tl-tag" style={{ color:'rgba(255,255,255,.6)' }}>your turn</div>
            <button className="tl-btn ghost" style={{ width:28, height:28, padding:0, color:'rgba(255,255,255,.7)' }}>{Icon.close}</button>
          </div>
          <div style={{ fontSize:18, fontWeight:600, marginTop:6, lineHeight:1.3 }}>
            Doing any of these? Tap to post.
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12 }}>
            {[
              { i:'🏋', n:'Gym',     t:'7p' },
              { i:'🍽', n:'Dinner',   t:'6:30p' },
              { i:'📚', n:'Study',    t:'2-4p' },
              { i:'🌅', n:'Other…',   t:'' },
            ].map((o,i) => (
              <button key={i} style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.18)', borderRadius:14, padding:12, textAlign:'left', color:'var(--paper)' }}>
                <div style={{ fontSize:18 }}>{o.i}</div>
                <div style={{ fontSize:14, fontWeight:600, marginTop:4 }}>{o.n}</div>
                {o.t && <div className="tl-mono" style={{ fontSize:11, opacity:.7, marginTop:2 }}>{o.t}</div>}
              </button>
            ))}
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, fontSize:12 }}>
            <span style={{ opacity:.6 }}>Once a day · dismiss to hide</span>
            <span style={{ fontWeight:600 }}>Skip</span>
          </div>
        </div>
      </div>

      {/* feed continues */}
      <div className="scroll-hidden" style={{ padding:'14px 16px 200px', overflow:'hidden' }}>
        <EventRow time="6:30 PM" title="Dinner at Arrillaga" host="Greg" place="Open invite" going={[{ch:'A',tone:'b4'},{ch:'B',tone:'b2'}]} moreCount={6} photo="warm" joined />
        <EventRow time="9:00 PM" title="Movie night" host="Nat" place="Suites lounge" going={[{ch:'N',tone:'b3'}]} photo="blue" />
      </div>

      <Fab />
      <TabBar active={0} />
    </Screen>
  );
}

// ─────────────────────────── 5A. FRIENDS TAB w/ favorites manager ───────────────────────────
function Friends_Tab() {
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 18px 0' }}>
        <div className="tl-display" style={{ fontSize:30, fontWeight:700 }}>Friends.</div>
        <div className="tl-tag" style={{ marginTop:2 }}>★ pin people to filter your feed</div>
      </div>

      <div style={{ padding:'12px 18px 0', position:'relative' }}>
        <input className="tl-input" placeholder="Search friends" style={{ paddingLeft:38 }} />
        <span style={{ position:'absolute', left:30, top:24, color:'var(--muted)' }}>{Icon.search}</span>
      </div>

      <div style={{ padding:'14px 18px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div className="tl-tag">favorites · 4</div>
        <button className="tl-btn ghost" style={{ height:30, fontSize:12, padding:'0 10px' }}>Reorder</button>
      </div>
      <div style={{ padding:'8px 18px 0' }}>
        {[
          { ch:'M', tone:'b1', n:'Maya Chen',     h:'@maya',     s:'going to soccer · 5:30p' },
          { ch:'G', tone:'b4', n:'Greg Watanabe', h:'@gregw',    s:'hosting dinner · 6:30p' },
          { ch:'S', tone:'b2', n:'Sam Park',      h:'@sammie',   s:'no plans posted today' },
          { ch:'J', tone:'b3', n:'Jess Ramos',    h:'@jess',     s:'going to dinner · 6:30p' },
        ].map((f,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--hair)' }}>
            <Avatar ch={f.ch} tone={f.tone} size={42} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:600 }}>{f.n}</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>{f.s}</div>
            </div>
            <button style={{ background:'transparent', border:0, color:'var(--accent)' }}>{Icon.star(true)}</button>
          </div>
        ))}
      </div>

      <div style={{ padding:'14px 18px 0' }}>
        <div className="tl-tag">everyone else</div>
        {[
          { ch:'N', tone:'b3', n:'Nat Lin',      h:'@natlin' },
          { ch:'K', tone:'b2', n:'Kim Ortiz',    h:'@kimo' },
          { ch:'T', tone:'b5', n:'Theo Wells',   h:'@theow' },
          { ch:'R', tone:'b4', n:'Riley Adams',  h:'@riley' },
        ].map((f,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--hair)' }}>
            <Avatar ch={f.ch} tone={f.tone} size={36} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600 }}>{f.n}</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>{f.h}</div>
            </div>
            <button style={{ background:'transparent', border:0, color:'var(--muted)' }}>{Icon.star(false)}</button>
          </div>
        ))}
      </div>

      <Fab />
      <TabBar active={1} />
    </Screen>
  );
}

// ─────────────────────────── 6A. PROFILE ───────────────────────────
function Profile() {
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 18px 0', display:'flex', justifyContent:'space-between' }}>
        <button className="tl-btn ghost" style={{ width:40, height:40, padding:0 }}>{Icon.back}</button>
        <button className="tl-btn ghost" style={{ width:40, height:40, padding:0 }}>{Icon.more}</button>
      </div>

      <div style={{ padding:'12px 22px 0', display:'flex', alignItems:'center', gap:14 }}>
        <Avatar ch="G" tone="b4" size={72} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:22, fontWeight:700 }}>Greg Watanabe</div>
          <div style={{ fontSize:13, color:'var(--muted)' }}>@gregw · 12 mutual</div>
          <div style={{ display:'flex', gap:8, marginTop:8 }}>
            <button className="tl-btn primary" style={{ height:36, fontSize:13, padding:'0 14px' }}>{Icon.star(true)} Favorited</button>
            <button className="tl-btn" style={{ height:36, fontSize:13, padding:'0 14px' }}>Message</button>
          </div>
        </div>
      </div>

      <div style={{ padding:'18px 22px 0' }}>
        <div className="tl-tag">going to · in your feed</div>
        <div className="tl-card" style={{ padding:14, marginTop:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div style={{ fontSize:16, fontWeight:600 }}>Dinner at Arrillaga</div>
            <span className="tl-pill accent" style={{ padding:'2px 8px', fontSize:10, fontWeight:600 }}>he's hosting</span>
          </div>
          <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>Wed 6:30 PM</div>
        </div>
        <div className="tl-card" style={{ padding:14, marginTop:8 }}>
          <div style={{ fontSize:16, fontWeight:600 }}>Movie night</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>Wed 9:00 PM · by Nat</div>
        </div>
        <div className="tl-card" style={{ padding:14, marginTop:8 }}>
          <div style={{ fontSize:16, fontWeight:600 }}>Run + coffee</div>
          <div style={{ fontSize:13, color:'var(--muted)', marginTop:2 }}>Thu 7:00 AM · by Sam</div>
        </div>

        <div className="tl-tag" style={{ marginTop:18 }}>1 hidden</div>
        <div style={{ padding:'12px 14px', borderRadius:14, border:'1px dashed var(--hair-2)', color:'var(--muted)', fontSize:13, marginTop:6, lineHeight:1.4 }}>
          Greg is going to 1 event posted by people you don't follow. Follow them to see it.
        </div>
      </div>

      <TabBar active={1} />
    </Screen>
  );
}

// ─────────────────────────── 7A. OVERLAP — stacked by start ───────────────────────────
function Overlap() {
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 18px 0' }}>
        <div className="tl-display" style={{ fontSize:30, fontWeight:700 }}>Wed afternoon</div>
        <div className="tl-tag">3 events · 2 overlap</div>
      </div>

      <div style={{ padding:'14px 18px 0' }}>
        <div style={{ display:'flex', gap:12 }}>
          <div style={{ width:54, paddingTop:2 }}>
            <div className="tl-mono" style={{ fontSize:13, fontWeight:600 }}>5:30p</div>
            <div className="tl-mono" style={{ fontSize:11, color:'var(--muted)' }}>– 7</div>
          </div>
          <div className="tl-card" style={{ flex:1, padding:14 }}>
            <div style={{ fontSize:16, fontWeight:600 }}>Pickup soccer</div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>Maya · Roble field</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
              <AvatarStack items={[{ch:'M',tone:'b1'},{ch:'J',tone:'b3'}]} size={22} more={3} />
              <button className="tl-btn" style={{ height:30, fontSize:13, padding:'0 12px' }}>Join</button>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:12, marginTop:10 }}>
          <div style={{ width:54, paddingTop:2 }}>
            <div className="tl-mono" style={{ fontSize:13, fontWeight:600 }}>6:30p</div>
            <div className="tl-mono" style={{ fontSize:11, color:'var(--muted)' }}>– 8</div>
          </div>
          <div className="tl-card" style={{ flex:1, padding:14, position:'relative', borderColor:'color-mix(in oklab, var(--accent) 30%, transparent)' }}>
            <span className="tl-pill accent" style={{ position:'absolute', top:-10, right:14, padding:'2px 8px', fontSize:10, fontWeight:600 }}>overlaps soccer</span>
            <div style={{ fontSize:16, fontWeight:600 }}>Dinner at Arrillaga</div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>Greg · open invite</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
              <AvatarStack items={[{ch:'A',tone:'b4'},{ch:'B',tone:'b2'},{ch:'C',tone:'b1'}]} size={22} more={5} />
              <span className="tl-pill is-on" style={{ padding:'4px 12px' }}>✓ in</span>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:12, marginTop:10 }}>
          <div style={{ width:54, paddingTop:2 }}>
            <div className="tl-mono" style={{ fontSize:13, fontWeight:600 }}>9:00p</div>
          </div>
          <div className="tl-card" style={{ flex:1, padding:14 }}>
            <div style={{ fontSize:16, fontWeight:600 }}>Movie night</div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>Nat · suites lounge</div>
          </div>
        </div>

        {/* conflict banner */}
        <div className="tl-card" style={{ marginTop:18, padding:14, background:'var(--accent-soft)', borderColor:'color-mix(in oklab, var(--accent) 25%, transparent)' }}>
          <div className="tl-tag" style={{ color:'var(--accent-ink)' }}>heads up</div>
          <div style={{ fontSize:14, fontWeight:600, color:'var(--accent-ink)', marginTop:2 }}>
            You're in dinner. Joining soccer would overlap by 30m.
          </div>
          <div style={{ display:'flex', gap:8, marginTop:10 }}>
            <button className="tl-btn primary" style={{ height:36, fontSize:13, padding:'0 14px' }}>Join both anyway</button>
            <button className="tl-btn" style={{ height:36, fontSize:13, padding:'0 14px' }}>Swap</button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

// ─────────────────────────── 8A. RSVP CONFIRM ───────────────────────────
function RSVP() {
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 18px 0', opacity:.4 }}>
        <div className="tl-tag">wed apr 30</div>
        <div className="tl-display" style={{ fontSize:30, fontWeight:700 }}>Today.</div>
      </div>
      <div style={{ position:'absolute', inset:0, background:'rgba(20,16,12,.30)' }} />

      <div className="tl-bottomsheet" style={{ paddingBottom:30 }}>
        <div className="tl-grabber" />
        <div style={{ padding:'4px 22px 0', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ width:60, height:60, borderRadius:999, background:'var(--accent-soft)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--accent-ink)' }}>
            {Icon.check}
          </div>
          <div style={{ fontSize:22, fontWeight:700, marginTop:12 }}>You're in.</div>
          <div style={{ fontSize:14, color:'var(--muted)', marginTop:2, textAlign:'center' }}>Greg and 7 others will see you joined.</div>
        </div>

        <div style={{ padding:'18px 18px 0' }}>
          <div className="tl-card" style={{ padding:14 }}>
            <div className="tl-mono" style={{ fontSize:11, color:'var(--muted)' }}>WED 6:30 – 8 PM</div>
            <div style={{ fontSize:18, fontWeight:600, marginTop:2 }}>Dinner at Arrillaga</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8 }}>
              <Avatar ch="G" tone="b4" size={22} />
              <span style={{ fontSize:13 }}>Greg + 7</span>
            </div>
          </div>
        </div>

        <div style={{ padding:'14px 18px 0' }}>
          <div className="tl-tag">also doing</div>
          <button className="tl-card" style={{ width:'100%', padding:'12px 14px', marginTop:8, display:'flex', alignItems:'center', gap:10, textAlign:'left', background:'var(--card)' }}>
            <span style={{ fontSize:18 }}>🎬</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600 }}>Movie night after?</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>9p · Nat is hosting</div>
            </div>
            <span className="tl-mono" style={{ fontSize:13 }}>+ join</span>
          </button>
        </div>

        <div style={{ padding:'14px 18px 0', display:'flex', gap:10 }}>
          <button className="tl-btn ghost" style={{ flex:1, height:48 }}>Add comment</button>
          <button className="tl-btn primary" style={{ flex:1, height:48 }}>Done</button>
        </div>
      </div>
    </Screen>
  );
}

// ─────────────────────────── 9A. ACTIVITY ───────────────────────────
function Activity() {
  const items = [
    { ch:'J', tone:'b3', n:'Jess', m:'commented on Dinner at Arrillaga', t:'2m', sub:'"i\'ll bring oat milk just in case"' },
    { ch:'M', tone:'b1', n:'Maya', m:'invited you to Pickup soccer', t:'12m' },
    { ch:'G', tone:'b4', n:'Greg', m:'joined Movie night', t:'34m' },
    { ch:'S', tone:'b2', n:'Sam', m:'posted Run + coffee for tomorrow', t:'1h' },
    { ch:'A', tone:'b4', n:'Ana', m:'★ favorited you', t:'3h' },
  ];
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 18px 0' }}>
        <div className="tl-display" style={{ fontSize:30, fontWeight:700 }}>Activity.</div>
        <div className="tl-segment" style={{ marginTop:10 }}>
          <button className="on">All</button>
          <button>Favorites</button>
          <button>Mentions</button>
        </div>
      </div>

      <div className="scroll-hidden" style={{ padding:'14px 18px 100px', overflow:'hidden' }}>
        {items.map((x,i) => (
          <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:'1px solid var(--hair)' }}>
            <Avatar ch={x.ch} tone={x.tone} size={36} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14 }}><b>{x.n}</b> <span style={{ color:'var(--muted)' }}>{x.m}</span></div>
              {x.sub && <div style={{ fontSize:13, color:'var(--ink-2)', marginTop:2, fontStyle:'italic' }}>{x.sub}</div>}
              <div className="tl-tag" style={{ marginTop:4 }}>{x.t}</div>
            </div>
          </div>
        ))}
      </div>

      <TabBar active={3} />
    </Screen>
  );
}

// ─────────────────────────── 10A. EMPTY / 11A. YOU ───────────────────────────
function Empty() {
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 18px 0' }}>
        <div className="tl-tag">wed apr 30</div>
        <div className="tl-display" style={{ fontSize:34, fontWeight:700 }}>Today.</div>
      </div>
      <DayStrip active={1} />
      <div style={{ padding:'80px 32px', textAlign:'center' }}>
        <div style={{ width:88, height:88, margin:'0 auto', borderRadius:999, background:'var(--soft)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:42 }}>🌤️</div>
        <div className="tl-display" style={{ fontSize:26, fontWeight:700, marginTop:14 }}>No plans yet.</div>
        <div style={{ fontSize:14, color:'var(--muted)', marginTop:6, lineHeight:1.5 }}>
          Be the first to post. Or wait — your favorites probably have something cooking.
        </div>
        <button className="tl-btn primary" style={{ marginTop:18, height:46, padding:'0 22px' }}>+ Post a plan</button>
        <div style={{ marginTop:14 }}>
          <button className="tl-btn ghost" style={{ height:36 }}>Browse everyone</button>
        </div>
      </div>
      <Fab />
      <TabBar active={0} />
    </Screen>
  );
}

function You() {
  return (
    <Screen theme="warm">
      <div style={{ padding:'4px 18px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div className="tl-display" style={{ fontSize:30, fontWeight:700 }}>Alex Park</div>
          <div className="tl-tag" style={{ marginTop:2 }}>@alexp · 24 friends</div>
        </div>
        <Avatar ch="A" tone="b1" size={56} />
      </div>

      <div style={{ padding:'14px 18px 0', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
        {[
          { n:'Posted', v:14 },
          { n:'Joined', v:32 },
          { n:'★ Favs', v:4 },
        ].map((s,i) => (
          <div key={i} className="tl-card" style={{ padding:'12px 10px', textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:700 }}>{s.v}</div>
            <div className="tl-tag">{s.n}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:'18px 18px 0' }}>
        <div className="tl-tag">your week</div>
        <div className="tl-card" style={{ padding:14, marginTop:6 }}>
          <div style={{ fontSize:15, fontWeight:600 }}>Dinner at Arrillaga · today</div>
          <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>6:30 PM · joined</div>
        </div>
        <div className="tl-card" style={{ padding:14, marginTop:8 }}>
          <div style={{ fontSize:15, fontWeight:600 }}>Run + coffee · tomorrow</div>
          <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>7 AM · joined</div>
        </div>
      </div>

      <div style={{ padding:'18px 18px 0' }}>
        <div className="tl-tag">settings</div>
        <div className="tl-card" style={{ marginTop:6 }}>
          {['Who can see your events','Daily prompt time','Notifications','Sign out'].map((r,i) => (
            <div key={i} style={{ padding:'14px 16px', borderTop: i?'1px solid var(--hair)':'none', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:14 }}>{r}</span>
              <span style={{ color:'var(--muted)' }}>›</span>
            </div>
          ))}
        </div>
      </div>

      <TabBar active={4} />
    </Screen>
  );
}

// ─────────────────────────── COVER ───────────────────────────
function Cover() {
  return (
    <div className="tl v-warm" style={{ width:560, height:380, padding:36, background:'var(--paper)', borderRadius:18, border:'1px solid var(--hair)', position:'relative' }}>
      <div className="tl-tag">CS278 · timeline · hi-fi v1</div>
      <div className="tl-display" style={{ fontSize:62, fontWeight:700, lineHeight:0.95, marginTop:10, letterSpacing:'-0.01em' }}>
        Timeline.
      </div>
      <div style={{ fontSize:15, color:'var(--ink-2)', marginTop:10, lineHeight:1.5, maxWidth:460 }}>
        A social events app where friends post open-invite plans on a 15-day rail. See who's doing what, RSVP, comment, favorite people to filter your feed.
      </div>

      <div className="tl-tag" style={{ marginTop:24 }}>in this canvas</div>
      <ul style={{ fontSize:14, marginTop:6, paddingLeft:20, lineHeight:1.55, color:'var(--ink-2)' }}>
        <li>Two visual systems for the day-stacked feed (warm cards · mono spine)</li>
        <li>Event detail — w/ image, text-forward, comments thread</li>
        <li>Add event — full manual form, plus a usuals-first split</li>
        <li>Daily prompt — both modal sheet AND inline-at-top variants, fleshed</li>
        <li>Friends tab w/ favorites manager · profile · overlap handling</li>
      </ul>

      <div style={{ position:'absolute', right:36, top:30, display:'flex', alignItems:'center', gap:8, color:'var(--accent-ink)' }}>
        <span className="tl-mono" style={{ fontSize:11, letterSpacing:'.08em' }}>13 SCREENS · 390×844</span>
      </div>
    </div>
  );
}

// ─────────────────────────── App ───────────────────────────
function App() {
  return (
    <DesignCanvas>
      <DCSection id="cover" title="Timeline · hi-fi" subtitle="13 screens, 2 visual systems, one app">
        <DCArtboard id="cover" label="overview" width={560} height={380}><Cover /></DCArtboard>
      </DCSection>

      <DCSection id="feed" title="1 · Feed (day-stacked)" subtitle="two visual systems on the same structure">
        <DCArtboard id="feed-warm" label="A · warm + photos" width={SCR_W} height={SCR_H}><Feed_Warm /></DCArtboard>
        <DCArtboard id="feed-mono" label="B · mono + spine" width={SCR_W} height={SCR_H}><Feed_Mono /></DCArtboard>
      </DCSection>

      <DCSection id="detail" title="2 · Event detail" subtitle="image hero · text-forward · comments">
        <DCArtboard id="d-img"  label="A · with photo" width={SCR_W} height={SCR_H}><Detail_Image /></DCArtboard>
        <DCArtboard id="d-noimg" label="B · text-forward (no photo)" width={SCR_W} height={SCR_H}><Detail_NoImage /></DCArtboard>
        <DCArtboard id="d-com"  label="C · comments thread" width={SCR_W} height={SCR_H}><Detail_Comments /></DCArtboard>
      </DCSection>

      <DCSection id="add" title="3 · Add event" subtitle="manual form is the canonical path">
        <DCArtboard id="add-form"  label="A · full manual form" width={SCR_W} height={SCR_H}><Add_Form /></DCArtboard>
        <DCArtboard id="add-split" label="B · usuals-first picker" width={SCR_W} height={SCR_H}><Add_Split /></DCArtboard>
      </DCSection>

      <DCSection id="prompt" title="4 · Daily prompt" subtitle="both versions fleshed for comparison">
        <DCArtboard id="p-modal"  label="A · modal sheet" width={SCR_W} height={SCR_H}><Prompt_Modal /></DCArtboard>
        <DCArtboard id="p-inline" label="B · inline at top of feed" width={SCR_W} height={SCR_H}><Prompt_Inline /></DCArtboard>
      </DCSection>

      <DCSection id="friends" title="5 · Friends + favorites" subtitle="manage favorites in the Friends tab">
        <DCArtboard id="friends" label="A · friends tab" width={SCR_W} height={SCR_H}><Friends_Tab /></DCArtboard>
        <DCArtboard id="profile" label="B · friend profile" width={SCR_W} height={SCR_H}><Profile /></DCArtboard>
      </DCSection>

      <DCSection id="overlap" title="6 · Overlaps" subtitle="stacked by start time + soft conflict banner">
        <DCArtboard id="overlap" label="A · stacked + conflict" width={SCR_W} height={SCR_H}><Overlap /></DCArtboard>
      </DCSection>

      <DCSection id="extras" title="Extras worth flagging" subtitle="RSVP confirm · activity · empty · you">
        <DCArtboard id="rsvp"   label="RSVP confirm sheet" width={SCR_W} height={SCR_H}><RSVP /></DCArtboard>
        <DCArtboard id="act"    label="Activity feed" width={SCR_W} height={SCR_H}><Activity /></DCArtboard>
        <DCArtboard id="empty"  label="Empty state" width={SCR_W} height={SCR_H}><Empty /></DCArtboard>
        <DCArtboard id="you"    label="You / settings" width={SCR_W} height={SCR_H}><You /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
