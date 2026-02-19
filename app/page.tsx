export default function Page() {
  const cardStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 18,
    background: "#fff",
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    border: "1px solid #e5e7eb",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    marginRight: 8,
    marginBottom: 8,
    background: "#fafafa",
  };

  const h2: React.CSSProperties = { fontSize: 18, margin: "0 0 10px" };
  const p: React.CSSProperties = { margin: "8px 0", color: "#374151", lineHeight: 1.7 };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      {/* Header */}
      <header style={{ padding: "28px 0 18px" }}>
        <div style={{ marginBottom: 10 }}>
          <span style={badgeStyle}>β：法人限定</span>
          <span style={badgeStyle}>完全独占</span>
          <span style={badgeStyle}>著作権（財産権）譲渡</span>
          <span style={badgeStyle}>再譲渡禁止（グループ内利用のみ可）</span>
        </div>

        <h1 style={{ fontSize: 34, margin: 0, letterSpacing: "-0.02em" }}>
          コンペ落ちの高クオリティ楽曲を、独占で即取得。
        </h1>
        <p style={{ ...p, fontSize: 18, marginTop: 12 }}>
          地下アイドル／VTuber事務所向けの「完成済み楽曲」マーケット。
          <br />
          書き下ろしより速く、比較検討でき、予算が読みやすい。— 面倒な意思決定を減らすための仕組みです。
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
          <a
            href="#contact"
            style={{
              display: "inline-block",
              background: "#111827",
              color: "#fff",
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 12,
              fontSize: 14,
            }}
          >
            β参加・導入相談
          </a>
          <a
            href="#rules"
            style={{
              display: "inline-block",
              background: "#f3f4f6",
              color: "#111827",
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 12,
              fontSize: 14,
            }}
          >
            ルールを確認
          </a>
        </div>

        <p style={{ marginTop: 14, fontSize: 13, color: "#6b7280" }}>
          想定価格帯（目安）：<b>15万〜25万</b>（曲・内容により変動／価格は作家設定）
        </p>
      </header>

      {/* Why */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        <div style={cardStyle}>
          <h2 style={h2}>なぜこのサービスが必要？</h2>
          <p style={p}>
            地下市場では「曲は作りたいが、どこに頼めばいいか分からない／相場が怖い／キャンセルしづらい」が発生しがち。
            <br />
            そこで、<b>完成済み楽曲を並べ、聴いて選び、独占で買い切れる</b>形にすることで、意思決定のストレスを削減します。
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={cardStyle}>
          <h2 style={h2}>購入側のメリット</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#111827", lineHeight: 1.8 }}>
            <li>比較検討して選べる（選曲ミスが減る）</li>
            <li>書き下ろしより速い（制作期間を短縮）</li>
            <li>予算が読みやすい（途中膨張が起きにくい）</li>
            <li>商用原盤は自社制作（REC/MIXの自由度）</li>
          </ul>
        </div>

        <div style={cardStyle}>
          <h2 style={h2}>作家側のメリット</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#111827", lineHeight: 1.8 }}>
            <li>未採用曲の現金化（死蔵在庫の回収）</li>
            <li>書き下ろし不要（既存資産を活用）</li>
            <li>別名義クレジット可（ブランド保護）</li>
            <li>データ受け渡しまでで完結（追加調整なし）</li>
          </ul>
        </div>
      </section>

      {/* Flow */}
      <section style={{ marginTop: 16 }} id="flow">
        <div style={cardStyle}>
          <h2 style={h2}>購入の流れ</h2>
          <ol style={{ margin: 0, paddingLeft: 18, color: "#111827", lineHeight: 1.9 }}>
            <li>楽曲一覧から試聴 → 気に入った曲を購入（βは法人限定）</li>
            <li>購入時に利用用途を申告（媒体／名義／時期）</li>
            <li>納品：2mix / inst / パラデータ</li>
            <li>購入者側でREC/MIX → 商用原盤を新規制作</li>
          </ol>
          <p style={{ ...p, marginTop: 10, fontSize: 13 }}>
            ※ 追加オプション：原盤制作ディレクター（予算・分配は個別協議）
          </p>
        </div>
      </section>

      {/* Rules */}
      <section style={{ marginTop: 16 }} id="rules">
        <div style={cardStyle}>
          <h2 style={h2}>ルール（重要）</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#111827", lineHeight: 1.9 }}>
            <li>
              <b>完全独占：</b>販売は1回のみ。成約後は即非公開。
            </li>
            <li>
              <b>著作権（財産権）譲渡：</b>契約条件遵守を前提（重大違反時は解除＋権利復帰）。
            </li>
            <li>
              <b>再譲渡・再販売・再許諾は禁止：</b>グループ会社内利用のみ可（権利移転は不可）。
            </li>
            <li>
              <b>2mixの商用利用は禁止：</b>制作参考素材扱い。<b>仮歌公開も禁止</b>。
            </li>
            <li>
              <b>改変はOK：</b>再REC／再MIX／尺変更などは購入者側で自由。
            </li>
            <li>
              <b>クレジット必須：</b>作家は別名義可。
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginTop: 16 }}>
        <div style={cardStyle}>
          <h2 style={h2}>FAQ</h2>

          <p style={p}>
            <b>Q. 2mixをそのまま配信できますか？</b>
            <br />
            A. できません。2mixは制作参考素材です。商用配信・販売・公開は禁止（仮歌も公開禁止）。
          </p>

          <p style={p}>
            <b>Q. 著作権譲渡だと、将来の印税は？</b>
            <br />
            A. 財産権は購入者へ移転します。以後の著作権印税は購入者側に帰属します（作家は売却代金のみ）。
          </p>

          <p style={p}>
            <b>Q. どういう曲が出ますか？</b>
            <br />
            A. 基本は未採用（コンペ落ち等）の完成済みアレンジ曲。聴いて選べることが前提です。
          </p>
        </div>
      </section>

      {/* Contact */}
      <section style={{ marginTop: 16 }} id="contact">
        <div style={cardStyle}>
          <h2 style={h2}>β参加・お問い合わせ</h2>
          <p style={p}>
            β運用は法人限定。購入相談／出品相談／運用相談はこちらから。
          </p>

          {/* ここだけあなたのフォームURLに差し替え */}
          <a
            href="https://forms.gle/（ここにフォームURL）"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              background: "#111827",
              color: "#fff",
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 12,
              fontSize: 14,
              marginTop: 6,
            }}
          >
            フォームを開く
          </a>

          <p style={{ marginTop: 10, fontSize: 12, color: "#6b7280", lineHeight: 1.7 }}>
            ※ 返信が必要なため、メールアドレスは必須です。用途申告の内容は、転売等の不正対策に利用します。
          </p>
        </div>
      </section>

      <footer style={{ marginTop: 22, padding: "18px 0", fontSize: 12, color: "#6b7280" }}>
        © monoralism
      </footer>
    </main>
  );
}