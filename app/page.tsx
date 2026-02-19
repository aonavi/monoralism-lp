import Link from "next/link";

type Track = {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  mood: string;
  length: string;
  price: number;
  creator: string;
  tags: string[];
};

const GENRES = [
  "J-POP",
  "J-ROCK",
  "Kawaii Pop",
  "City Pop",
  "Idol",
  "Dance Pop",
  "EDM",
  "Future Bass",
  "Hyperpop",
  "Lo-fi",
  "Ballad",
  "Acoustic",
  "Piano",
  "Rock",
  "Pop Rock",
  "Metal",
  "Loud",
  "Punk",
  "Funk",
  "R&B",
  "Hip-Hop",
  "Trap",
  "Jazz",
  "Orchestra",
  "Cinematic",
  "Game",
  "Anime",
  "VTuber",
  "Horror",
  "Ambient",
];

const MOODS = ["爽快", "エモい", "切ない", "かわいい", "クール", "熱い", "ダーク", "チル"];
const TEMPOS = ["〜90", "91〜120", "121〜150", "151〜"];

const PICKUP: Track[] = [
  {
    id: "PK-001",
    title: "Neon Panorama",
    genre: "City Pop",
    bpm: 108,
    mood: "チル",
    length: "3:12",
    price: 220000,
    creator: "monora composer A",
    tags: ["夜", "都会", "シンセ"],
  },
  {
    id: "PK-002",
    title: "Sparkling ID",
    genre: "Idol",
    bpm: 160,
    mood: "爽快",
    length: "2:58",
    price: 200000,
    creator: "monora composer B",
    tags: ["サビ強", "コール", "疾走感"],
  },
  {
    id: "PK-003",
    title: "No Risk Mode",
    genre: "Loud",
    bpm: 148,
    mood: "熱い",
    length: "3:25",
    price: 250000,
    creator: "monora composer C",
    tags: ["ラウド", "リフ", "ブレイク"],
  },
];

const TRACKS: Track[] = [
  ...PICKUP,
  {
    id: "TR-101",
    title: "Afterglow",
    genre: "J-POP",
    bpm: 124,
    mood: "エモい",
    length: "3:40",
    price: 180000,
    creator: "monora composer D",
    tags: ["現代", "切なさ"],
  },
  {
    id: "TR-102",
    title: "Rocket Start!",
    genre: "J-ROCK",
    bpm: 170,
    mood: "熱い",
    length: "3:05",
    price: 210000,
    creator: "monora composer E",
    tags: ["ギター", "サビ強"],
  },
  {
    id: "TR-103",
    title: "Soft Light",
    genre: "Ballad",
    bpm: 72,
    mood: "切ない",
    length: "3:33",
    price: 160000,
    creator: "monora composer F",
    tags: ["ピアノ", "泣きメロ"],
  },
];

function Yen({ value }: { value: number }) {
  return <span>¥{value.toLocaleString("ja-JP")}</span>;
}

function FakeWave() {
  // “波形っぽい”見た目（本物の波形じゃない／あとで音源実装に置換）
  return (
    <div
      style={{
        height: 28,
        borderRadius: 8,
        background:
          "linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 20%, #e5e7eb 40%, #f3f4f6 60%, #e5e7eb 80%, #f3f4f6 100%)",
        border: "1px solid #e5e7eb",
      }}
      aria-label="waveform"
    />
  );
}

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#111827" }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link href="/" style={{ textDecoration: "none", color: "#111827" }}>
              <span style={{ fontWeight: 800, letterSpacing: "-0.02em", fontSize: 18 }}>monora</span>
            </Link>

            <nav style={{ display: "flex", gap: 10, fontSize: 13 }}>
              <Link href="/" style={{ color: "#111827", textDecoration: "none" }}>
                Home
              </Link>
              <Link href="/about" style={{ color: "#111827", textDecoration: "none" }}>
                monoraとは？
              </Link>
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              placeholder="曲名 / ジャンル / タグで検索"
              style={{
                width: 320,
                maxWidth: "45vw",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                outline: "none",
                fontSize: 13,
              }}
            />
            <button
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #111827",
                background: "#111827",
                color: "#fff",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              アカウント
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 18,
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 18,
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 14,
            height: "fit-content",
            position: "sticky",
            top: 72,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 10 }}>絞り込み</div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>ジャンル</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {GENRES.map((g) => (
                <button
                  key={g}
                  style={{
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    color: "#111827",
                    borderRadius: 999,
                    padding: "7px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>ムード</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MOODS.map((m) => (
                <button
                  key={m}
                  style={{
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    borderRadius: 999,
                    padding: "7px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>テンポ</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TEMPOS.map((t) => (
                <button
                  key={t}
                  style={{
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    borderRadius: 999,
                    padding: "7px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280", lineHeight: 1.7 }}>
            ※ いまは見た目用のダミーUI。<br />
            次段でタグ/価格ソート・お気に入り・試聴に繋げる。
          </div>
        </aside>

        {/* Main */}
        <main style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Pickups */}
          <section
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>ピックアップミュージック</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  今、狙い目（回転が早い想定の強い曲）
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
                <button
                  style={{
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    borderRadius: 10,
                    padding: "8px 10px",
                    cursor: "pointer",
                  }}
                >
                  価格順
                </button>
                <button
                  style={{
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    borderRadius: 10,
                    padding: "8px 10px",
                    cursor: "pointer",
                  }}
                >
                  新着順
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12 }}>
              {PICKUP.map((t) => (
                <div
                  key={t.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 14,
                    padding: 12,
                    background: "#fff",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {t.genre} / BPM {t.bpm} / {t.mood}
                  </div>
                  <div style={{ fontWeight: 800, marginTop: 6 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                    {t.length} · {t.creator}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          border: "1px solid #e5e7eb",
                          background: "#fafafa",
                          borderRadius: 999,
                          padding: "4px 8px",
                          fontSize: 12,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <FakeWave />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                    <div style={{ fontWeight: 800 }}>
                      <Yen value={t.price} />
                    </div>
                    <button
                      style={{
                        border: "1px solid #111827",
                        background: "#111827",
                        color: "#fff",
                        borderRadius: 10,
                        padding: "8px 10px",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      詳細
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* List */}
          <section
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>楽曲一覧</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  AudioStock風の一覧UI（試聴・お気に入り・購入は次段で実装）
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
                <button style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 10, padding: "8px 10px" }}>
                  価格フィルタ
                </button>
                <button style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 10, padding: "8px 10px" }}>
                  お気に入り
                </button>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {TRACKS.map((t) => (
                <div
                  key={t.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 14,
                    padding: 12,
                    display: "grid",
                    gridTemplateColumns: "44px 1fr 160px",
                    gap: 12,
                    alignItems: "center",
                    background: "#fff",
                  }}
                >
                  <button
                    aria-label="play"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                  >
                    ▶
                  </button>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 800 }}>{t.title}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        {t.genre} / BPM {t.bpm} / {t.mood} / {t.length}
                      </div>
                    </div>

                    <FakeWave />

                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {t.creator} · ID: {t.id}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <div style={{ fontWeight: 800 }}>
                      <Yen value={t.price} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={{
                          border: "1px solid #e5e7eb",
                          background: "#fff",
                          borderRadius: 10,
                          padding: "8px 10px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        ☆
                      </button>
                      <button
                        style={{
                          border: "1px solid #111827",
                          background: "#111827",
                          color: "#fff",
                          borderRadius: 10,
                          padding: "8px 10px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        購入
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer style={{ color: "#6b7280", fontSize: 12, padding: "6px 2px 20px" }}>
            © monora（UIプロトタイプ）
          </footer>
        </main>
      </div>
    </div>
  );
}