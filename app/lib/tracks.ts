export type Track = {
  id: string;
  title: string;
  genre: string;
  mood: string;
  bpm: number;
  length: string;
  price: number;
  creator: string;
  tags: string[];
  createdAt: string;
  description: string;
};

export const GENRES = [
  "J-POP",
  "J-ROCK",
  "IDOL",
  "DANCE POP",
  "CITY POP",
  "FUTURE BASS",
  "LOUD ROCK",
  "KAWAII",
  "BALLAD",
  "HIPHOP",
  "R&B",
  "EDM",
  "ANIME",
  "GAME",
] as const;

export const TRACKS: Track[] = [
  {
    id: "or001",
    title: "Neon Horizon",
    genre: "J-POP",
    mood: "Bright",
    bpm: 150,
    length: "3:28",
    price: 180000,
    creator: "Composer A",
    tags: ["hook", "anthem", "live"],
    createdAt: "2026-02-10",
    description: "疾走感のある王道ポップ。ライブで跳ねるサビ設計。コール＆レスポンス対応。",
  },
  {
    id: "or002",
    title: "Midnight Bloom",
    genre: "CITY POP",
    mood: "Cool",
    bpm: 118,
    length: "3:42",
    price: 220000,
    creator: "Composer B",
    tags: ["urban", "night", "groove"],
    createdAt: "2026-02-12",
    description: "都会的な夜をイメージしたシティポップ。ミドルテンポで洗練された空気感。",
  },
  {
    id: "or003",
    title: "Brave Signal",
    genre: "IDOL",
    mood: "Hype",
    bpm: 156,
    length: "3:18",
    price: 200000,
    creator: "Composer C",
    tags: ["call&response", "festival", "fast"],
    createdAt: "2026-02-14",
    description: "アップテンポの王道アイドル楽曲。フェス映え・煽りパート強化型。",
  },
  {
    id: "or004",
    title: "Glass Memories",
    genre: "BALLAD",
    mood: "Emo",
    bpm: 78,
    length: "4:05",
    price: 160000,
    creator: "Composer D",
    tags: ["tear", "piano", "strings"],
    createdAt: "2026-02-15",
    description: "ピアノ主体のバラード。感情の起伏を丁寧に描く構成。ドラマタイアップ向き。",
  },
];

/* ===========================
   Karaoke (OPEN)
=========================== */

export type KaraokeVariant = {
  keyLabel: string;
  semitone: number;
};

export type KaraokeTrack = {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  price: number;
  sales: number;
  createdAt: string;
  tags: string[];
  variants: KaraokeVariant[];
};

export const KARAOKE_ARTISTS = [
  "Mrs. GREEN APPLE",
  "YOASOBI",
  "Ado",
  "米津玄師",
  "Official髭男dism",
  "King Gnu",
  "Vaundy",
  "あいみょん",
  "back number",
  "優里",
  "ずっと真夜中でいいのに。",
];

export const KARAOKE_TRACKS: KaraokeTrack[] = [
  {
    id: "kr001",
    title: "Midnight Drive (Karaoke Pack)",
    artist: "Mrs. GREEN APPLE",
    bpm: 128,
    price: 18000,
    sales: 312,
    createdAt: "2026-02-01",
    tags: ["live", "upbeat", "band"],
    variants: [
      { keyLabel: "Original", semitone: 0 },
      { keyLabel: "-1", semitone: -1 },
      { keyLabel: "-2", semitone: -2 },
      { keyLabel: "+1", semitone: 1 },
      { keyLabel: "+2", semitone: 2 },
    ],
  },
  {
    id: "kr002",
    title: "Starlight Pop (Karaoke Pack)",
    artist: "YOASOBI",
    bpm: 142,
    price: 22000,
    sales: 281,
    createdAt: "2026-02-05",
    tags: ["pop", "tight", "modern"],
    variants: [
      { keyLabel: "Original", semitone: 0 },
      { keyLabel: "-1", semitone: -1 },
      { keyLabel: "-2", semitone: -2 },
      { keyLabel: "+1", semitone: 1 },
      { keyLabel: "+2", semitone: 2 },
    ],
  },
  {
    id: "kr003",
    title: "Neon Anthem (Karaoke Pack)",
    artist: "Ado",
    bpm: 150,
    price: 24000,
    sales: 198,
    createdAt: "2026-02-08",
    tags: ["power", "fast", "vocal"],
    variants: [
      { keyLabel: "Original", semitone: 0 },
      { keyLabel: "-1", semitone: -1 },
      { keyLabel: "-2", semitone: -2 },
      { keyLabel: "+1", semitone: 1 },
      { keyLabel: "+2", semitone: 2 },
    ],
  },
];
