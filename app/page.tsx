"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

import AuthPanelModal from "./components/AuthPanel";
import KaraokeVariantModal from "./components/KaraokeVariantModal";
import { GENRES, KARAOKE_ARTISTS, KARAOKE_TRACKS, TRACKS, type KaraokeTrack } from "./lib/tracks";

type TabKey = "overview" | "karaoke" | "original";

const FAVORITES_KEY = "monora:favorites:v1";
const PURCHASED_KEY = "monora:purchased:v1";
const PLAYLISTS_KEY = "monora:playlists:v1";

function Yen({ value }: { value: number }) {
  return <span>¥{value.toLocaleString("ja-JP")}</span>;
}

function Pill({
  active,
  children,
  onClick,
  tone = "mono",
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "mono" | "pop";
}) {
  const mono = {
    border: active ? "1px solid #111827" : "1px solid #e5e7eb",
    background: active ? "#111827" : "#fff",
    color: active ? "#fff" : "#111827",
  };
  const pop = {
    border: active ? "1px solid #0ea5e9" : "1px solid #bae6fd",
    background: active ? "#0ea5e9" : "#e0f2fe",
    color: active ? "#fff" : "#075985",
  };
  const t = tone === "pop" ? pop : mono;

  return (
    <button
      onClick={onClick}
      style={{
        ...t,
        borderRadius: 999,
        padding: "8px 12px",
        fontSize: 12,
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function FakeWave({ tone = "mono" }: { tone?: "mono" | "pop" }) {
  const bg =
    tone === "pop"
      ? "linear-gradient(90deg, #bae6fd 0%, #e0f2fe 20%, #bae6fd 40%, #e0f2fe 60%, #bae6fd 80%, #e0f2fe 100%)"
      : "linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 20%, #e5e7eb 40%, #f3f4f6 60%, #e5e7eb 80%, #f3f4f6 100%)";

  return <div style={{ height: 28, borderRadius: 8, background: bg, border: "1px solid #e5e7eb" }} />;
}

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}
function saveSet(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch {}
}

type Playlist = { id: string; name: string; trackIds: string[] };

function loadPlaylists(): Playlist[] {
  try {
    const raw = localStorage.getItem(PLAYLISTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Playlist[];
  } catch {
    return [];
  }
}
function savePlaylists(list: Playlist[]) {
  try {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(list));
  } catch {}
}

export default function Home() {
  const [tab, setTab] = useState<TabKey>("overview");

  // “認証の器”だけ先に作る（後でSupabaseに差し替え）
  const [authOpen, setAuthOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [credits, setCredits] = useState(120);
  const [cartCount, setCartCount] = useState(0);
  const [q, setQ] = useState("");

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  const [genre, setGenre] = useState<string | null>(null);
  const [karaokeArtist, setKaraokeArtist] = useState<string | null>(null);
  const [karaokeSort, setKaraokeSort] = useState<"popular" | "new">("popular");

  const [karaokeModalOpen, setKaraokeModalOpen] = useState(false);
  const [karaokeSelectedId, setKaraokeSelectedId] = useState<string | null>(null);

  const karaokeSelectedTrack = useMemo<KaraokeTrack | null>(() => {
    if (!karaokeSelectedId) return null;
    return KARAOKE_TRACKS.find((t) => t.id === karaokeSelectedId) ?? null;
  }, [karaokeSelectedId]);

  useEffect(() => {
    setFavorites(loadSet(FAVORITES_KEY));
    setPurchased(loadSet(PURCHASED_KEY));
    setPlaylists(loadPlaylists());
  }, []);
  useEffect(() => saveSet(FAVORITES_KEY, favorites), [favorites]);
  useEffect(() => saveSet(PURCHASED_KEY, purchased), [purchased]);
  useEffect(() => savePlaylists(playlists), [playlists]);

  const toggleFav = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const createPlaylist = () => {
    const name = prompt("プレイリスト名");
    if (!name) return;
    const id = `pl_${Math.random().toString(36).slice(2, 10)}`;
    setPlaylists((prev) => [{ id, name, trackIds: [] }, ...prev]);
    setActivePlaylistId(id);
  };

  const renamePlaylist = (id: string) => {
    const p = playlists.find((x) => x.id === id);
    if (!p) return;
    const nextName = prompt("新しい名前", p.name);
    if (!nextName) return;
    setPlaylists((prev) => prev.map((x) => (x.id === id ? { ...x, name: nextName } : x)));
  };

  const deletePlaylist = (id: string) => {
    const p = playlists.find((x) => x.id === id);
    if (!p) return;
    const ok = confirm(`「${p.name}」を削除しますか？（元に戻せません）`);
    if (!ok) return;
    setPlaylists((prev) => prev.filter((x) => x.id !== id));
    setActivePlaylistId((cur) => (cur === id ? null : cur));
  };

  const duplicatePlaylist = (id: string) => {
    const src = playlists.find((p) => p.id === id);
    if (!src) return;
    const newId = `pl_${Math.random().toString(36).slice(2, 10)}`;
    setPlaylists((prev) => [{ id: newId, name: `${src.name} (copy)`, trackIds: [...src.trackIds] }, ...prev]);
    setActivePlaylistId(newId);
  };

  const activePlaylist = useMemo(() => playlists.find((p) => p.id === activePlaylistId) ?? null, [playlists, activePlaylistId]);

  const addToPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id !== playlistId) return p;
        if (p.trackIds.includes(trackId)) return p;
        return { ...p, trackIds: [...p.trackIds, trackId] };
      })
    );
  };

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) => prev.map((p) => (p.id !== playlistId ? p : { ...p, trackIds: p.trackIds.filter((x) => x !== trackId) })));
  };

  const unlockFullMix = (_trackId: string) => {
    const cost = 10;
    if (credits < cost) return alert("クレジット不足（ダミー）");
    setCredits((c) => c - cost);
    alert("フル2mixを解放（ダミー）。ウォーターマーク版が再生可能になります。");
  };

  const requestOriginalAccess = () => {
    const subject = encodeURIComponent("[monora] オリジナル閲覧の招待申請");
    const body = encodeURIComponent(`申請者メール: ${userEmail ?? "(未ログイン)"}\n用途:\nチーム名/会社名:\n希望する利用範囲:\n`);
    window.location.href = `mailto:hello@monora.example?subject=${subject}&body=${body}`;
  };

  const originalList = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = TRACKS;
    if (genre) list = list.filter((t) => t.genre === genre);
    if (query) {
      list = list.filter((t) => {
        const hay = [t.title, t.genre, t.mood, t.creator, ...t.tags].join(" ").toLowerCase();
        return hay.includes(query);
      });
    }
    return list;
  }, [q, genre]);

  const karaokeList = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = KARAOKE_TRACKS;
    if (karaokeArtist) list = list.filter((t) => t.artist === karaokeArtist);
    if (query) {
      list = list.filter((t) => [t.title, t.artist, ...t.tags].join(" ").toLowerCase().includes(query));
    }
    list = [...list].sort((a, b) => (karaokeSort === "popular" ? b.sales - a.sales : b.createdAt.localeCompare(a.createdAt)));
    return list;
  }, [q, karaokeArtist, karaokeSort]);

  const libraryFavorites = useMemo(() => {
    const all = [...TRACKS, ...KARAOKE_TRACKS] as Array<{ id: string }>;
    return all.filter((t) => favorites.has(t.id));
  }, [favorites]);

  const libraryPurchased = useMemo(() => {
    const all = [...TRACKS, ...KARAOKE_TRACKS] as Array<{ id: string }>;
    return all.filter((t) => purchased.has(t.id));
  }, [purchased]);

  const pageWrap = { minHeight: "100vh", background: "#fff", color: "#111827" } as const;
  const container = { maxWidth: 1200, margin: "0 auto", padding: "0 18px" } as const;

  const card = { border: "1px solid #e5e7eb", borderRadius: 18, padding: 16, background: "#fff" } as const;
  const popCard = { border: "1px solid #bae6fd", borderRadius: 18, padding: 16, background: "#f0f9ff" } as const;

  return (
    <div style={pageWrap}>
      {/* ===== Header (2段) ===== */}
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
        {/* Top row */}
        <div style={{ ...container, display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 360 }}>
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setTab("overview");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{ textDecoration: "none", color: "#111827" }}
            >
              <span style={{ fontWeight: 900, letterSpacing: "-0.02em", fontSize: 18 }}>monora</span>
            </Link>

            <span style={{ fontSize: 12, color: "#374151" }}>本格カラオケ・オリジナル楽曲販売</span>

            <span style={{ fontSize: 12, color: "#111827", fontWeight: 900, border: "1px solid #e5e7eb", padding: "6px 10px", borderRadius: 999 }}>
              商用利用OK
            </span>
          </div>

          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tab === "karaoke" ? "曲名 / アーティスト / タグで検索" : "曲名 / ジャンル / タグ / 作家で検索"}
              style={{ width: "min(560px, 100%)", padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", outline: "none", fontSize: 13, background: "#fff" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 360, justifyContent: "flex-end" }}>
            <button
              onClick={() => alert("購入カート（次段）")}
              style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 900, cursor: "pointer" }}
            >
              購入カート {cartCount ? `(${cartCount})` : ""}
            </button>

            <button
              onClick={() => alert("クレジット取得：サブスク/個別購入（次段）")}
              style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 900, cursor: "pointer" }}
            >
              クレジット {credits}
            </button>

            <button
              onClick={() => setAuthOpen(true)}
              style={{ border: "1px solid #111827", background: "#111827", color: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 13, fontWeight: 900, cursor: "pointer" }}
            >
              ログイン
            </button>
          </div>
        </div>

        {/* Tabs row */}
        <div style={{ borderTop: "1px solid #f3f4f6", background: "#fff" }}>
          <div style={{ ...container, display: "flex", alignItems: "center", justifyContent: "space-between", height: 54 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Pill active={tab === "overview"} onClick={() => setTab("overview")} tone="mono">
                A面（概要）
              </Pill>
              <Pill active={tab === "karaoke"} onClick={() => setTab("karaoke")} tone="pop">
                Karaoke（OPEN）
              </Pill>

              {/* 仕様：Originalはモーダル→ログイン押下で入る */}
              <Pill
                active={tab === "original"}
                onClick={() => {
                  setAuthOpen(true);
                }}
                tone="mono"
              >
                Original（招待制）
              </Pill>
            </div>

            <nav style={{ display: "flex", gap: 14, fontSize: 12, color: "#374151" }}>
              <button
                onClick={() => {
                  setTab("overview");
                  document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{ all: "unset", cursor: "pointer", fontWeight: 800 }}
              >
                FAQ
              </button>
              <button
                onClick={() => {
                  setTab("overview");
                  document.getElementById("creators")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{ all: "unset", cursor: "pointer", fontWeight: 800 }}
              >
                クリエイター
              </button>
              <Link href="/about" style={{ textDecoration: "none", color: "#374151", fontWeight: 800 }}>
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ===== Body ===== */}
      <div style={{ ...container, paddingTop: 18, paddingBottom: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: tab === "overview" ? "1fr" : "320px 1fr", gap: 18, alignItems: "start" }}>
          {/* Sidebar */}
          {tab !== "overview" && (
            <aside style={{ ...(tab === "karaoke" ? popCard : card), position: "sticky", top: 130 }}>
              <div style={{ fontWeight: 900, fontSize: 14 }}>ライブラリー</div>

              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12, background: "#fff" }}>
                  <div style={{ fontWeight: 900, fontSize: 12 }}>お気に入り</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>{libraryFavorites.length} 件</div>
                  <button
                    onClick={() => alert("お気に入り一覧（次段）")}
                    style={{ marginTop: 10, width: "100%", border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}
                  >
                    閲覧
                  </button>
                </div>

                <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12, background: "#fff" }}>
                  <div style={{ fontWeight: 900, fontSize: 12 }}>購入済み</div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>{libraryPurchased.length} 件</div>
                  <button
                    onClick={() => alert("購入済み一覧（次段）")}
                    style={{ marginTop: 10, width: "100%", border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}
                  >
                    閲覧
                  </button>
                </div>

                <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12, background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 900, fontSize: 12 }}>プレイリスト</div>
                    <button onClick={createPlaylist} style={{ all: "unset", cursor: "pointer", fontSize: 12, fontWeight: 900 }}>
                      ＋作成
                    </button>
                  </div>

                  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                    {playlists.length === 0 ? (
                      <div style={{ fontSize: 12, color: "#6b7280" }}>未作成</div>
                    ) : (
                      playlists.slice(0, 8).map((p) => (
                        <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 6, alignItems: "center" }}>
                          <button
                            onClick={() => setActivePlaylistId(p.id)}
                            style={{
                              border: activePlaylistId === p.id ? "1px solid #111827" : "1px solid #e5e7eb",
                              background: activePlaylistId === p.id ? "#111827" : "#fff",
                              color: activePlaylistId === p.id ? "#fff" : "#111827",
                              borderRadius: 12,
                              padding: "8px 10px",
                              fontSize: 12,
                              fontWeight: 900,
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            {p.name} <span style={{ opacity: 0.75 }}>({p.trackIds.length})</span>
                          </button>

                          <button
                            onClick={() => renamePlaylist(p.id)}
                            style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: "8px 10px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}
                            title="名前変更"
                          >
                            ✎
                          </button>

                          <button
                            onClick={() => deletePlaylist(p.id)}
                            style={{
                              border: "1px solid #fee2e2",
                              background: "#fff",
                              borderRadius: 12,
                              padding: "8px 10px",
                              fontSize: 12,
                              fontWeight: 900,
                              cursor: "pointer",
                              color: "#991b1b",
                            }}
                            title="削除"
                          >
                            🗑
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {activePlaylist && (
                    <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                      <button
                        onClick={() => duplicatePlaylist(activePlaylist.id)}
                        style={{ flex: 1, border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}
                      >
                        複製
                      </button>
                      <button
                        onClick={() => alert("共有（次段：顧客ID/組織/権限/RLS）")}
                        style={{ flex: 1, border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}
                      >
                        共有
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 16, fontWeight: 900, fontSize: 14 }}>絞り込み</div>

              {tab === "karaoke" ? (
                <>
                  <div style={{ marginTop: 10, fontSize: 12, color: "#075985", fontWeight: 900 }}>アーティスト</div>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <Pill active={karaokeArtist === null} onClick={() => setKaraokeArtist(null)} tone="pop">
                      ALL
                    </Pill>
                    {KARAOKE_ARTISTS.map((a) => (
                      <Pill key={a} active={karaokeArtist === a} onClick={() => setKaraokeArtist(a)} tone="pop">
                        {a}
                      </Pill>
                    ))}
                  </div>

                  <div style={{ marginTop: 14, fontSize: 12, color: "#075985", fontWeight: 900 }}>ソート</div>
                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <Pill active={karaokeSort === "popular"} onClick={() => setKaraokeSort("popular")} tone="pop">
                      販売数順
                    </Pill>
                    <Pill active={karaokeSort === "new"} onClick={() => setKaraokeSort("new")} tone="pop">
                      新着順
                    </Pill>
                  </div>

                  <div style={{ marginTop: 14, fontSize: 12, color: "#075985", lineHeight: 1.7 }}>
                    ※ フルinst視聴は禁止（サビ短尺＋Ver比較のみ）
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280", fontWeight: 900 }}>ジャンル</div>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    <Pill active={genre === null} onClick={() => setGenre(null)} tone="mono">
                      ALL
                    </Pill>
                    {GENRES.map((g) => (
                      <Pill key={g} active={genre === g} onClick={() => setGenre(g)} tone="mono">
                        {g}
                      </Pill>
                    ))}
                  </div>

                  <div style={{ marginTop: 14, fontSize: 12, color: "#6b7280", lineHeight: 1.7 }}>
                    ※ 本番は招待制・監査ログ・RLSを必ず実装。いまはUI検証。
                  </div>

                  <button
                    onClick={requestOriginalAccess}
                    style={{ marginTop: 12, width: "100%", border: "1px solid #111827", background: "#111827", color: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 950, cursor: "pointer" }}
                  >
                    オリジナル招待制の中に入りたい
                  </button>
                </>
              )}
            </aside>
          )}

          {/* Main */}
          <main style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {tab === "overview" && (
              <>
                <section style={{ ...card, padding: 22 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 18, alignItems: "start" }}>
                    <div>
                      <div style={{ fontWeight: 950, fontSize: 26, letterSpacing: "-0.02em" }}>
                        探す → 試す → 決める。<br />
                        “楽曲調達”の意思決定を最短に。
                      </div>
                      <div style={{ marginTop: 10, fontSize: 14, color: "#374151", lineHeight: 1.9 }}>
                        monoraは、<strong>「本格カラオケ（OPEN）」</strong>と<strong>「招待制オリジナル（BtoB）」</strong>の二面マーケット。
                        <br />
                        カラオケは集客。オリジナルは独占購入の意思決定を高速化。
                        <br />
                        <strong>商用利用OK</strong>（契約条件に準拠）・再譲渡禁止設計。
                      </div>

                      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <Pill tone="pop" onClick={() => setTab("karaoke")}>
                          Karaoke（OPEN）を見る
                        </Pill>
                        <Pill
                          tone="mono"
                          onClick={() => {
                            setAuthOpen(true);
                          }}
                        >
                          オリジナル招待制の中に入りたい
                        </Pill>

                        <button
                          onClick={() => setAuthOpen(true)}
                          style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 999, padding: "8px 12px", fontSize: 12, fontWeight: 900, cursor: "pointer" }}
                        >
                          ログインで開始
                        </button>
                      </div>
                    </div>

                    <div style={{ border: "1px solid #e5e7eb", borderRadius: 18, padding: 16, background: "#fafafa" }}>
                      <div style={{ fontWeight: 900, fontSize: 14 }}>このサイトでできること</div>
                      <ul style={{ marginTop: 10, fontSize: 13, color: "#374151", lineHeight: 1.9, paddingLeft: 18 }}>
                        <li>カラオケ：原曲Key＋±2のVer比較（サビ短尺）</li>
                        <li>オリジナル：ワンコーラス試聴 → ポイントでフル解放</li>
                        <li>プレイリスト：検討の意思決定ログを“形”にする</li>
                        <li>招待制：チーム共有（閲覧/試聴のみ）を後で実装</li>
                      </ul>
                      <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
                        ※ フル解放は<strong>ウォーターマーク</strong>前提（そのまま商用転用できない設計）にする予定
                      </div>
                    </div>
                  </div>
                </section>

                <section id="faq" style={card}>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>FAQ</div>
                  <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                    {[
                      { q: "カラオケはフルで聴けますか？", a: "禁止。サビ短尺＋Ver比較のみ。フルinst視聴は提供しません。" },
                      { q: "オリジナルのフル2mixは？", a: "ポイントで解放後に再生可。ただしDL不可＋ウォーターマークを入れる前提。" },
                      { q: "招待制はいつ？", a: "後で実装。顧客ID/組織/招待リンク/RLS/監査ログまでを設計対象にします。" },
                    ].map((f) => (
                      <div key={f.q} style={{ border: "1px solid #e5e7eb", borderRadius: 18, padding: 14, background: "#fff" }}>
                        <div style={{ fontWeight: 950 }}>{f.q}</div>
                        <div style={{ marginTop: 8, fontSize: 13, color: "#374151", lineHeight: 1.9 }}>{f.a}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="creators" style={card}>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>クリエイター向け</div>
                  <div style={{ marginTop: 8, fontSize: 13, color: "#374151", lineHeight: 1.9 }}>
                    未採用・完成済み楽曲（アレンジ済み／パラあり）を“商品化”し、BtoBで活用される導線を作ります。
                    <br />
                    供給側の運用コストを破綻させないため、素材保管は外部ストレージでも成立する設計にします（後で実装）。
                  </div>
                </section>
              </>
            )}

            {tab === "karaoke" && (
              <>
                <section style={popCard}>
                  <div style={{ fontWeight: 950, fontSize: 20, color: "#075985" }}>Karaoke（OPEN）</div>
                  <div style={{ marginTop: 8, fontSize: 13, color: "#075985", lineHeight: 1.9 }}>
                    原曲Key + ±2（計5本）パック販売。<br />
                    <strong>Ver比較（サビ短尺）</strong>でキー差を即判断。フルinst視聴は提供しません。
                  </div>
                </section>

                <section style={popCard}>
                  <div style={{ fontWeight: 900, color: "#075985" }}>人気ランキング</div>
                  <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                    {karaokeList.map((t) => (
                      <div key={t.id} style={{ border: "1px solid #bae6fd", borderRadius: 18, padding: 14, background: "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                          <div>
                            <div style={{ fontWeight: 950 }}>{t.title}</div>
                            <div style={{ marginTop: 6, fontSize: 12, color: "#0369a1" }}>
                              {t.artist} ・ BPM {t.bpm} ・ 販売数 {t.sales}
                            </div>
                          </div>
                          <div style={{ fontWeight: 950 }}>
                            <Yen value={t.price} />
                          </div>
                        </div>

                        <div style={{ marginTop: 12 }}>
                          <FakeWave tone="pop" />
                        </div>

                        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "space-between" }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              onClick={() => {
                                setKaraokeSelectedId(t.id);
                                setKaraokeModalOpen(true);
                              }}
                              style={{ border: "1px solid #0ea5e9", background: "#0ea5e9", color: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 950, cursor: "pointer" }}
                            >
                              Verを確認
                            </button>

                            <button
                              onClick={() => {
                                setCartCount((c) => c + 1);
                                alert("カートに追加（ダミー）");
                              }}
                              style={{ border: "1px solid #bae6fd", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 950, cursor: "pointer", color: "#075985" }}
                            >
                              購入する
                            </button>
                          </div>

                          <button
                            onClick={() => toggleFav(t.id)}
                            style={{ border: "1px solid #bae6fd", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 950, cursor: "pointer", color: "#075985" }}
                            title="お気に入り"
                          >
                            {favorites.has(t.id) ? "★" : "☆"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {tab === "original" && (
              <>
                <section style={card}>
                  <div style={{ fontWeight: 950, fontSize: 20 }}>Original（BtoBクローズド想定）</div>
                  <div style={{ marginTop: 8, fontSize: 13, color: "#374151", lineHeight: 1.9 }}>
                    ワンコーラスで検討 → ポイントでフル2mix解放（DL不可）。<br />
                    招待制・RLS・監査ログは<strong>後で必ず実装</strong>（今はUI検証）。
                  </div>
                </section>

                <section style={card}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontWeight: 950 }}>楽曲一覧（{originalList.length}件）</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>※ 絞り込みは左のジャンル</div>
                  </div>

                  <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                    {originalList.map((t) => (
                      <div key={t.id} style={{ border: "1px solid #e5e7eb", borderRadius: 18, padding: 14, background: "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                          <div>
                            <div style={{ fontWeight: 950 }}>{t.title}</div>
                            <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
                              {t.genre} / {t.mood} / BPM {t.bpm} ・ {t.length} ・ {t.creator}
                            </div>
                          </div>
                          <div style={{ fontWeight: 950 }}>
                            <Yen value={t.price} />
                          </div>
                        </div>

                        <div style={{ marginTop: 12 }}>
                          <FakeWave />
                        </div>

                        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {t.tags.map((tag) => (
                            <span key={tag} style={{ border: "1px solid #e5e7eb", borderRadius: 999, padding: "6px 10px", fontSize: 12, background: "#fafafa" }}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "space-between", flexWrap: "wrap" }}>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button
                              onClick={() => alert("ワンコーラス再生（次段：Storage）")}
                              style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 950, cursor: "pointer" }}
                            >
                              ワンコーラス試聴
                            </button>

                            <button
                              onClick={() => unlockFullMix(t.id)}
                              style={{ border: "1px solid #111827", background: "#111827", color: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 950, cursor: "pointer" }}
                            >
                              フル2mix解放（10pt）
                            </button>

                            <button
                              onClick={() => {
                                setCartCount((c) => c + 1);
                                alert("カートに追加（ダミー）");
                              }}
                              style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 950, cursor: "pointer" }}
                            >
                              購入する
                            </button>

                            <button
                              onClick={() => {
                                if (!activePlaylist) return alert("左でプレイリストを選択/作成してから追加");
                                addToPlaylist(activePlaylist.id, t.id);
                              }}
                              style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 950, cursor: "pointer" }}
                            >
                              プレイリストに追加
                            </button>
                          </div>

                          <button
                            onClick={() => toggleFav(t.id)}
                            style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 950, cursor: "pointer" }}
                            title="お気に入り"
                          >
                            {favorites.has(t.id) ? "★" : "☆"}
                          </button>
                        </div>

                        {activePlaylist && activePlaylist.trackIds.includes(t.id) && (
                          <div style={{ marginTop: 10 }}>
                            <button
                              onClick={() => removeFromPlaylist(activePlaylist.id, t.id)}
                              style={{ border: "1px solid #fee2e2", background: "#fff", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 950, cursor: "pointer", color: "#991b1b" }}
                            >
                              プレイリストから外す
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            <footer style={{ color: "#6b7280", fontSize: 12, padding: "10px 2px 0" }}>© monora（UIプロトタイプ）</footer>
          </main>
        </div>
      </div>

      {/* モーダル */}
      <AuthPanelModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={({ email }) => {
          setUserEmail(email);
          setTab("original"); // ★ログイン押下で無条件にOriginalへ
        }}
      />
      <KaraokeVariantModal open={karaokeModalOpen} track={karaokeSelectedTrack} onClose={() => setKaraokeModalOpen(false)} />
    </div>
  );
}
