"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (user: { email: string }) => void;
};

export default function AuthPanel({ open, onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (mode === "login") {
      const bothEmpty = !trimmedEmail && !trimmedPassword;
      const bothFilled = Boolean(trimmedEmail && trimmedPassword);
      return bothEmpty || bothFilled;
    }
    return Boolean(trimmedEmail && trimmedPassword);
  }, [mode, email, password]);

  useEffect(() => {
    if (open) {
      setMsg(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    setMsg(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("登録OK。ログインしてください。（メール確認が必要な場合は受信メールを確認）");
        setMode("login");
      } else {
        if (!email.trim() && !password.trim()) {
          onSuccess?.({ email: "(ゲストログイン)" });
          onClose();
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess?.({ email: email.trim() });
        onClose();
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "エラー";
      setMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17,24,39,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(520px, 100%)",
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          padding: 16,
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{mode === "login" ? "ログイン" : "新規登録"}</div>
          <button
            onClick={onClose}
            style={{
              border: "1px solid #e5e7eb",
              background: "#fff",
              borderRadius: 10,
              padding: "8px 10px",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            閉じる
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              border: "1px solid #e5e7eb",
              background: mode === "login" ? "#111827" : "#fff",
              color: mode === "login" ? "#fff" : "#111827",
              borderRadius: 10,
              padding: "10px 12px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            ログイン
          </button>
          <button
            onClick={() => setMode("signup")}
            style={{
              flex: 1,
              border: "1px solid #e5e7eb",
              background: mode === "signup" ? "#111827" : "#fff",
              color: mode === "signup" ? "#fff" : "#111827",
              borderRadius: 10,
              padding: "10px 12px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            新規登録
          </button>
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6, fontSize: 12 }}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
                outline: "none",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6, fontSize: 12 }}>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="8文字以上推奨"
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 13,
                outline: "none",
              }}
            />
          </label>

          {msg ? <div style={{ fontSize: 12, color: "#b45309" }}>{msg}</div> : null}

          <button
            onClick={submit}
            disabled={!canSubmit || loading}
            style={{
              border: "1px solid #111827",
              background: !canSubmit || loading ? "#6b7280" : "#111827",
              color: "#fff",
              borderRadius: 10,
              padding: "10px 12px",
              cursor: !canSubmit || loading ? "not-allowed" : "pointer",
              fontSize: 13,
              fontWeight: 900,
            }}
          >
            {loading ? "処理中..." : mode === "login" ? "ログイン" : "登録"}
          </button>

          <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
            ※ Supabase Auth を使用。メール確認がONの場合、登録後にメールのリンクを踏んでからログイン。
          </div>
        </div>
      </div>
    </div>
  );
}
