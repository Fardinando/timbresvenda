"use client";

import Shell from "@/components/Shell";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AtivarPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/ativar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError("Faça login primeiro para ativar códigos");
          return;
        }
        setError(data.error || "Erro ao ativar código");
        return;
      }

      setSuccess(data.message);
      setCodigo("");
      setTimeout(() => {
        router.push("/meus-produtos");
        router.refresh();
      }, 2000);
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  function formatCodigoInput(value: string) {
    const clean = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const parts = [];
    if (clean.length > 0) parts.push(clean.slice(0, 4));
    if (clean.length > 4) parts.push(clean.slice(4, 8));
    if (clean.length > 8) parts.push(clean.slice(8, 12));
    if (clean.length > 12) parts.push(clean.slice(12, 16));
    return parts.join("-");
  }

  return (
    <Shell>
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 glow-primary">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Ativar Código</h1>
              <p className="mt-2 text-sm text-muted">
                Insira seu código de ativação para desbloquear seu produto
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-lg border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
                  {success}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted">
                  Código de Ativação
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(formatCodigoInput(e.target.value))}
                  required
                  maxLength={19}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-center font-mono text-lg tracking-widest text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="TIMB-XXXX-XXXX-XXXX"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Formato: TIMB-XXXX-XXXX-XXXX
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !codigo}
                className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                {loading ? "Ativando..." : "Ativar Produto"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
}
