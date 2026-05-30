export function buildDateLabel(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getDay()].toLowerCase()} ${months[d.getMonth()]} ${d.getDate()}`;
}

export function getDayStrip() {
  const dayNames = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    return { dayName: dayNames[d.getDay()], dayNum: d.getDate(), index: i };
  });
}
