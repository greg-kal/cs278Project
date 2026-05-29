export const ME = { id: 'alex', name: 'Alex Park', handle: '@alexp', ch: 'A', tone: 'b1' };

export const USERS = [
  { id: 'alex',  name: 'Alex Park',     handle: '@alexp',  ch: 'A', tone: 'b1' },
  { id: 'maya',  name: 'Maya Chen',     handle: '@maya',   ch: 'M', tone: 'b1' },
  { id: 'greg',  name: 'Greg Watanabe', handle: '@gregw',  ch: 'G', tone: 'b4' },
  { id: 'sam',   name: 'Sam Park',      handle: '@sammie', ch: 'S', tone: 'b2' },
  { id: 'jess',  name: 'Jess Ramos',    handle: '@jess',   ch: 'J', tone: 'b3' },
  { id: 'nat',   name: 'Nat Lin',       handle: '@natlin', ch: 'N', tone: 'b3' },
  { id: 'kim',   name: 'Kim Ortiz',     handle: '@kimo',   ch: 'K', tone: 'b2' },
  { id: 'theo',  name: 'Theo Wells',    handle: '@theow',  ch: 'T', tone: 'b5' },
  { id: 'riley', name: 'Riley Adams',   handle: '@riley',  ch: 'R', tone: 'b4' },
  { id: 'ana',   name: 'Ana Diaz',      handle: '@anad',   ch: 'A', tone: 'b4' },
];

export function getUser(id) {
  return USERS.find(u => u.id === id) || USERS[0];
}

export function buildDateLabel(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getDay()].toLowerCase()} ${months[d.getMonth()]} ${d.getDate()}`;
}

export const EVENTS = [
  {
    id: 'soccer',
    title: 'Pickup soccer',
    time: '5:30 PM', endTime: '7:00 PM',
    dateKey: 'today', dateLabel: buildDateLabel(0),
    hostId: 'maya',
    place: 'Roble Field', placeAddress: 'Roble Athletic Center',
    duration: '1h 30m', durationNote: 'flexible',
    visibility: 'open', photo: 'green',
    accent: 'happening soon',
    goingIds: ['maya', 'jess', 'kim', 'theo', 'riley'],
    description: 'Casual pickup soccer at Roble. All skill levels welcome. Bring cleats if you have them!',
    comments: [],
  },
  {
    id: 'dinner',
    title: 'Dinner at Arrillaga',
    time: '6:30 PM', endTime: '8:00 PM',
    dateKey: 'today', dateLabel: buildDateLabel(0),
    hostId: 'greg',
    place: 'Arrillaga Family Dining', placeAddress: '340 Jane Stanford Way',
    duration: '1h 30m', durationNote: 'flexible — come / go',
    visibility: 'open', photo: 'warm',
    goingIds: ['maya', 'jess', 'ana', 'sam', 'kim', 'theo', 'riley'],
    description: "Open invite. Roll thru — I'll grab a long table on the right side near the windows. Bringing cards.",
    comments: [
      { id: 'c1', userId: 'jess', text: "i'll bring oat milk just in case", timeLabel: '10m', likes: 2 },
      { id: 'c2', userId: 'kim',  text: "going!! who's parking?",            timeLabel: '8m',  likes: 0 },
      { id: 'c3', userId: 'ana',  text: 'Greg you said long table by window right', timeLabel: '4m', likes: 0 },
      { id: 'c4', userId: 'greg', text: "yes, right side. i'll be there at 6:25",   timeLabel: '2m', likes: 0 },
      { id: 'c5', userId: 'nat',  text: 'swinging by movie night after, anyone want a ride at 8:45', timeLabel: 'just now', likes: 0 },
    ],
  },
  {
    id: 'movie',
    title: 'Movie night — Past Lives',
    time: '9:00 PM',
    dateKey: 'today', dateLabel: buildDateLabel(0),
    hostId: 'nat',
    place: 'Suites lounge', placeAddress: 'Suites Residence Hall',
    duration: '2h', durationNote: 'flexible',
    visibility: 'open', photo: 'blue',
    goingIds: ['nat', 'riley'],
    description: 'Watching Past Lives in the Suites lounge. Popcorn provided!',
    comments: [],
  },
  {
    id: 'run',
    title: 'Run + coffee',
    time: '7:00 AM',
    dateKey: 'tomorrow', dateLabel: buildDateLabel(1),
    hostId: 'sam',
    place: 'The Dish loop', placeAddress: 'Stanford, CA',
    duration: '1h', durationNote: 'flexible',
    visibility: 'open', photo: 'green',
    goingIds: ['sam'],
    description: 'Morning run around The Dish, then coffee at CoHo. About 3.5 miles.',
    comments: [],
  },
];

export function getEvent(id) {
  return EVENTS.find(e => e.id === id);
}

export const ACTIVITY = [
  { id: 'a1', userId: 'jess',  eventId: 'dinner', message: 'commented on Dinner at Arrillaga', subtext: '"i\'ll bring oat milk just in case"', timeLabel: '2m' },
  { id: 'a2', userId: 'maya',  eventId: 'soccer', message: 'invited you to Pickup soccer', subtext: null, timeLabel: '12m' },
  { id: 'a3', userId: 'greg',  eventId: 'movie',  message: 'joined Movie night', subtext: null, timeLabel: '34m' },
  { id: 'a4', userId: 'sam',   eventId: 'run',    message: 'posted Run + coffee for tomorrow', subtext: null, timeLabel: '1h' },
  { id: 'a5', userId: 'ana',   eventId: null,     message: '★ favorited you', subtext: null, timeLabel: '3h' },
];

export const USUALS = [
  { icon: '🍽', name: 'Dinner',     sub: 'open invite · ~6:30p · 12× this quarter' },
  { icon: '🏋', name: 'Gym',        sub: 'arc · ~7p · 8× this month' },
  { icon: '📚', name: 'Study sesh', sub: 'green library · 2h · last: monday' },
  { icon: '🌅', name: 'Brunch',     sub: 'coupa · weekends' },
];

export function getDayStrip() {
  const dayNames = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    return { dayName: dayNames[d.getDay()], dayNum: d.getDate(), index: i };
  });
}
