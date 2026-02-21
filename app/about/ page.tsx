import Link from "next/link";

export default function About() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24, fontFamily: "system-ui", color: "#111827" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#111827" }}>
          <span style={{ fontWeight: 800, letterSpacing: "-0.02em", fontSize: 18 }}>monora</span>
        </Link>
        <Link href="/" style={{ textDecoration: "none", color: "#111827", fontSize: 13 }}>
          ← Homeへ戻る
        </Link>
      </header>

      <section style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 18, background: "#fff" }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>monoraとは？</h1>

        <p style={{ color: "#374151", lineHeight: 1.8, marginTop: 10 }}>
          あなたが今LPに書いている「コンセプト／ルール／購入の流れ／FAQ」などを移してください。
          <br />
          （このページは“資料ページ”として使う想定）
        </p>

        <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "16px 0" }} />

        <h2 style={{ fontSize: 16, margin: "0 0 8px" }}>要点</h2>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
          <li>完全独占（販売は1回のみ）</li>
          <li>著作権（財産権）譲渡：契約条件遵守を前提（違反時は解除＋権利復帰）</li>
          <li>再譲渡・再販売・再許諾は禁止（グループ内利用のみ可）</li>
          <li>2mixは商用利用禁止／仮歌公開禁止（制作参考素材）</li>
          <li>改変自由／クレジット必須（別名義可）</li>
        </ul>
      </section>

      <footer style={{ marginTop: 18, color: "#6b7280", fontSize: 12 }}>© monora</footer>
    </main>
  );
}