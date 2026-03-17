export type Category =
  | 'outdoors' | 'food' | 'arts' | 'games' | 'learning' | 'music' | 'sports' | 'wellness' | 'community'

export type Activity = {
  id: string
  title: string
  description: string
  category: Category
  emoji: string
  host: {
    name: string
    avatar: string
    verified: boolean
  }
  location: {
    neighborhood: string
    city: string
    venueName?: string
  }
  dateLabel: string
  time: string
  spotsTotal: number
  spotsLeft: number
  attendees: string[] // avatar initials
  recurring?: string
  tags: string[]
  isNew?: boolean
  isFeatured?: boolean
  hostEmail?: string
  isOnline?: boolean
  meetingUrl?: string
}

export const CATEGORY_META: Record<Category, { label: string; color: string; bg: string; emoji: string }> = {
  outdoors:  { label: 'Outdoors',   color: 'text-sage-700',    bg: 'bg-sage-100',    emoji: '🌿' },
  food:      { label: 'Food',       color: 'text-orange-700',  bg: 'bg-orange-100',  emoji: '🍜' },
  arts:      { label: 'Arts',       color: 'text-purple-700',  bg: 'bg-purple-100',  emoji: '🎨' },
  games:     { label: 'Games',      color: 'text-blue-700',    bg: 'bg-blue-100',    emoji: '🎲' },
  learning:  { label: 'Learning',   color: 'text-yellow-700',  bg: 'bg-yellow-100',  emoji: '📚' },
  music:     { label: 'Music',      color: 'text-pink-700',    bg: 'bg-pink-100',    emoji: '🎸' },
  sports:    { label: 'Sports',     color: 'text-red-700',     bg: 'bg-red-100',     emoji: '⚽' },
  wellness:  { label: 'Wellness',   color: 'text-teal-700',    bg: 'bg-teal-100',    emoji: '🧘' },
  community: { label: 'Community',  color: 'text-amber-700',   bg: 'bg-amber-100',   emoji: '🤝' },
}

export const ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Sunday morning trail walk — Cedar Ridge',
    description: "Easy 5km trail, great for chatting. No experience needed. We end at a coffee spot nearby. The kind of morning that reminds you what it feels like to be human.",
    category: 'outdoors',
    emoji: '🥾',
    host: { name: 'Maya R.', avatar: 'MR', verified: true },
    location: { neighborhood: 'East Side', city: 'Omaha', venueName: 'Cedar Ridge Trailhead' },
    dateLabel: 'This Sunday',
    time: '8:30 AM',
    spotsTotal: 8,
    spotsLeft: 3,
    attendees: ['JK', 'TS', 'AL', 'PO'],
    recurring: 'Every Sunday',
    tags: ['beginner-friendly', 'coffee after', 'all ages'],
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Make ramen from scratch — my kitchen',
    description: "I learned to make proper tonkotsu ramen and I want to share it. We'll cook together, eat together, clean up together. Bring something to drink.",
    category: 'food',
    emoji: '🍜',
    host: { name: 'Kenji M.', avatar: 'KM', verified: false },
    location: { neighborhood: 'Hawthorne', city: 'Omaha' },
    dateLabel: 'Fri Mar 20',
    time: '6:00 PM',
    spotsTotal: 6,
    spotsLeft: 2,
    attendees: ['SL', 'RP', 'NW', 'HB'],
    tags: ['home cooking', 'beginner welcome', 'bring drinks'],
    isNew: true,
  },
  {
    id: '3',
    title: 'Life drawing — drop-in figure session',
    description: "Monthly drop-in life drawing. All skill levels. We provide easels and charcoal. Just show up, draw, talk about your work. No phones during drawing.",
    category: 'arts',
    emoji: '✏️',
    host: { name: 'Studio Commons', avatar: 'SC', verified: true },
    location: { neighborhood: 'Alberta Arts District', city: 'Omaha', venueName: 'Studio Commons' },
    dateLabel: 'Wed Mar 19',
    time: '7:00 PM',
    spotsTotal: 12,
    spotsLeft: 5,
    attendees: ['KL', 'MO', 'TR', 'VD', 'AS', 'BN', 'CK'],
    recurring: 'Monthly',
    tags: ['all skill levels', 'materials provided', 'no phones'],
  },
  {
    id: '4',
    title: 'Settlers of Catan + other euros — Café Noir',
    description: "We take over the back room at Café Noir every Tuesday. Bring a game or just show up. Usually 3–4 tables going. Good coffee, good people, low stakes.",
    category: 'games',
    emoji: '🎲',
    host: { name: 'Omaha Board Gamers', avatar: 'PB', verified: true },
    location: { neighborhood: 'Pearl District', city: 'Omaha', venueName: 'Café Noir' },
    dateLabel: 'This Tuesday',
    time: '6:30 PM',
    spotsTotal: 20,
    spotsLeft: 9,
    attendees: ['DG', 'EF', 'LM', 'NP', 'QR', 'ST'],
    recurring: 'Every Tuesday',
    tags: ['strategy games', 'all welcome', 'café setting'],
  },
  {
    id: '5',
    title: 'Philosophy reading group — Camus\'s "The Plague"',
    description: "Feels a bit relevant right now. We read a chapter a week and discuss Friday evenings. No philosophy background needed — just bring your thoughts.",
    category: 'learning',
    emoji: '📖',
    host: { name: 'Ruth A.', avatar: 'RA', verified: false },
    location: { neighborhood: 'Sellwood', city: 'Omaha', venueName: 'Sellwood Public Library' },
    dateLabel: 'Fri Mar 21',
    time: '7:00 PM',
    spotsTotal: 10,
    spotsLeft: 4,
    attendees: ['IJ', 'OQ', 'MN'],
    recurring: 'Every Friday',
    tags: ['book club', 'philosophy', 'free'],
    isNew: true,
  },
  {
    id: '6',
    title: 'Repair Café — bring broken things, fix together',
    description: "Bring your broken lamp, torn jacket, dead electronics. Volunteer fixers help you repair it yourself. Good conversations happen when hands are busy.",
    category: 'community',
    emoji: '🔧',
    host: { name: 'Right to Repair PDX', avatar: 'RR', verified: true },
    location: { neighborhood: 'St. Johns', city: 'Omaha', venueName: 'St. Johns Community Center' },
    dateLabel: 'Sat Mar 22',
    time: '10:00 AM – 2:00 PM',
    spotsTotal: 30,
    spotsLeft: 14,
    attendees: ['HI', 'JK', 'LM', 'NO', 'PQ'],
    recurring: 'Monthly',
    tags: ['sustainability', 'free', 'hands-on', 'all ages'],
  },
  {
    id: '7',
    title: 'Sunrise yoga at Waterfront Park',
    description: "Free yoga with the river at sunrise. All levels. We start in silence for 10 minutes, then flow. Bring your mat and something warm.",
    category: 'wellness',
    emoji: '🧘',
    host: { name: 'Elena V.', avatar: 'EV', verified: true },
    location: { neighborhood: 'Downtown', city: 'Omaha', venueName: 'Tom McCall Waterfront Park' },
    dateLabel: 'Tomorrow',
    time: '6:45 AM',
    spotsTotal: 25,
    spotsLeft: 12,
    attendees: ['AB', 'CD', 'EF', 'GH', 'IJ', 'KL'],
    recurring: 'Mon, Wed, Fri',
    tags: ['free', 'all levels', 'outdoor', 'bring mat'],
  },
  {
    id: '8',
    title: 'Acoustic session — original songs welcome',
    description: "Low-key open mic in someone's living room. 6 performers max. 10 min each. Listeners welcome too. No recording, no pressure, just music shared.",
    category: 'music',
    emoji: '🎸',
    host: { name: 'Aaron B.', avatar: 'AB', verified: false },
    location: { neighborhood: 'Division', city: 'Omaha' },
    dateLabel: 'Sat Mar 22',
    time: '5:00 PM',
    spotsTotal: 6,
    spotsLeft: 1,
    attendees: ['CD', 'EF', 'GH', 'IJ', 'KL'],
    tags: ['intimate', 'original music', 'listening welcome'],
    isNew: true,
  },
  {
    id: '9',
    title: 'Pickup basketball — Rose City Courts',
    description: "Casual pickup, all skill levels. We text the night before to confirm headcount. Show up by 9 for warmup. Competitive but chill.",
    category: 'sports',
    emoji: '🏀',
    host: { name: 'Marcus T.', avatar: 'MT', verified: false },
    location: { neighborhood: 'North Omaha', city: 'Omaha', venueName: 'Rose City Courts' },
    dateLabel: 'Saturday mornings',
    time: '9:00 AM',
    spotsTotal: 10,
    spotsLeft: 3,
    attendees: ['NP', 'QR', 'ST', 'UV', 'WX'],
    recurring: 'Every Saturday',
    tags: ['all levels', 'competitive-ish', 'free'],
  },
]

export const INTERESTS = [
  { id: 'outdoors', label: 'Outdoors & hiking', emoji: '🥾' },
  { id: 'food', label: 'Cooking & food', emoji: '🍜' },
  { id: 'arts', label: 'Visual arts', emoji: '🎨' },
  { id: 'games', label: 'Board games', emoji: '🎲' },
  { id: 'learning', label: 'Books & learning', emoji: '📚' },
  { id: 'music', label: 'Music', emoji: '🎸' },
  { id: 'sports', label: 'Sports & fitness', emoji: '⚽' },
  { id: 'wellness', label: 'Wellness & yoga', emoji: '🧘' },
  { id: 'community', label: 'Community projects', emoji: '🤝' },
  { id: 'crafts', label: 'Crafts & making', emoji: '🪡' },
  { id: 'film', label: 'Film & cinema', emoji: '🎬' },
  { id: 'gardening', label: 'Gardening', emoji: '🌱' },
  { id: 'cycling', label: 'Cycling', emoji: '🚴' },
  { id: 'photography', label: 'Photography', emoji: '📷' },
  { id: 'writing', label: 'Writing', emoji: '✍️' },
  { id: 'language', label: 'Language exchange', emoji: '🗣️' },
]

export const STATS = [
  { value: '47,000+', label: 'gatherings hosted', emoji: '🎯' },
  { value: '312,000+', label: 'people showed up', emoji: '🙌' },
  { value: '91%', label: 'said it helped their loneliness', emoji: '💛' },
  { value: '0', label: 'ads, algorithms, or engagement bait', emoji: '🚫' },
]
