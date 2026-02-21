"use client";

import { useEffect, useMemo, useState } from "react";

type KaraokeVariant = {
  keyLabel: string;
  semitone: number;
};

type KaraokeTrack = {
  id: string;
  title: string;
  bpm: number;
  price: number;
  variants: KaraokeVariant[];
};

type Props = {
  open: boolean;
  track: KaraokeTrack | null;
  onClose: () => void;
};

export default function KaraokeVariantModal({ open, track, onClose }: Props) {
  const original = useMemo(() => track?.variants.find((v) => v.semitone === 0) ?? null, [track]);
  const [selected, setSelected] = useState<KaraokeVariant | null>(null);
  const [ab, setAb] = useState<"A" | "B">("A"); // A=Original, B=Selected

  useEffect(() => {
    if (!open || !track) return;
    const init = track.variants.find((v) => v.semitone === 0) ?? track.variants[0] ?? null;
    setSelected(init);
    setAb("A");
  }, [open, track]);

  if (!open || !track) return null;

  const canCompare = !!original && !!selected && selected.semitone !== 0;
  const current = ab === "A" ? original : selected;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17,24,39,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 60,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(860px, 100%)",
          background: "#fff",
          borderRadius: 18,
          border: "1px solid #e5e7eb",
          padding: 16,
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Ver確認</div>
            <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>
              {track.title} ・ BPM {track.bpm} ・ {track.variants.length} Ver Pack
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "1px solid #e5e7eb",
              background: "#fff",
              borderRadius: 10,
              padding: "8px 10px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            閉じる
          </button>
        </div>

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 14, marginTop: 14 }}>
          {/* Left */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 13 }}>キーを選択</div>

            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {track.variants.map((v) => {
                const active = selected?.semitone === v.semitone;
                const isOri = v.semitone === 0;
                return (
                  <button
                    key={`${track.id}-${v.keyLabel}-${v.semitone}`}
                    onClick={() => {
                      setSelected(v);
                      setAb("A");
                    }}
                    style={{
                      border: active ? "1px solid #111827" : "1px solid #e5e7eb",
                      background: active ? "#111827" : "#fff",
                      color: active ? "#fff" : "#111827",
                      borderRadius: 999,
                      padding: "8px 12px",
                      fontSize: 12,
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                    title={isOri ? "Original" : `Originalから${v.keyLabel}`}
                  >
                    {v.keyLabel}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 14, borderTop: "1px solid #e5e7eb", paddingTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 13 }}>A/B 比較</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
                    A = Original / B = 選択Ver（{selected?.keyLabel ?? "-"}）
                  </div>
                </div>

                <button
                  disabled={!canCompare}
                  onClick={() => setAb((p) => (p === "A" ? "B" : "A"))}
                  style={{
                    border: "1px solid #111827",
                    background: canCompare ? "#111827" : "#6b7280",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "10px 12px",
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: canCompare ? "pointer" : "not-allowed",
                    whiteSpace: "nowrap",
                  }}
                >
                  {canCompare ? "A ↔ B 切替" : "Originalと同じ"}
                </button>
              </div>

              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>A</div>
                  <div style={{ fontWeight: 900, marginTop: 6 }}>{original?.keyLabel ?? "Original"}</div>
                  <button
                    onClick={() => alert("（ダミー）Aを試聴")}
                    style={{
                      marginTop: 10,
                      width: "100%",
                      border: "1px solid #e5e7eb",
                      background: ab === "A" ? "#111827" : "#fff",
                      color: ab === "A" ? "#fff" : "#111827",
                      borderRadius: 12,
                      padding: "10px 12px",
                      fontSize: 12,
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {ab === "A" ? "再生中（A）" : "試聴（A）"}
                  </button>
                </div>

                <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 12 }}>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>B</div>
                  <div style={{ fontWeight: 900, marginTop: 6 }}>{selected?.keyLabel ?? "-"}</div>
                  <button
                    onClick={() => alert("（ダミー）Bを試聴")}
                    style={{
                      marginTop: 10,
                      width: "100%",
                      border: "1px solid #e5e7eb",
                      background: ab === "B" ? "#111827" : "#fff",
                      color: ab === "B" ? "#fff" : "#111827",
                      borderRadius: 12,
                      padding: "10px 12px",
                      fontSize: 12,
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {ab === "B" ? "再生中（B）" : "試聴（B）"}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                現在選択中：<strong style={{ color: "#111827" }}>{current?.keyLabel ?? "-"}</strong>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 14, height: "fit-content" }}>
            <div style={{ fontWeight: 900, fontSize: 13 }}>購入内容</div>

            <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280", lineHeight: 1.7 }}>
              原曲Key + ±2（計5本）パック
              <br />
              ※ 二次配布・再販売は禁止（購入者ログイン/ログ記録）
            </div>

            <div style={{ marginTop: 12, fontWeight: 900, fontSize: 18 }}>
              ¥{track.price.toLocaleString("ja-JP")}
            </div>

            <button
              onClick={() => alert("（次段）購入フローを実装：Stripe/請求書")}
              style={{
                marginTop: 12,
                width: "100%",
                border: "1px solid #111827",
                background: "#111827",
                color: "#fff",
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 13,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              購入する
            </button>

            <button
              onClick={() => alert("（次段）用途申告フォーム")}
              style={{
                marginTop: 8,
                width: "100%",
                border: "1px solid #e5e7eb",
                background: "#fff",
                borderRadius: 12,
                padding: "10px 12px",
                fontSize: 12,
                fontWeight: 900,
                cursor: "pointer",
                color: "#111827",
              }}
            >
              用途申告（サンプル）
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
