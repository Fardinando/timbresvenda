"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalProdutos: number;
  totalCodigos: number;
  codigosUsados: number;
  totalUsuarios: number;
  totalPedidos: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  async function handleSyncML() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/cron/sync-ml", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setSyncResult(`Erro: ${data.error}`);
        return;
      }
      setSyncResult(
        `Sincronizado! ${data.processed} pedido(s) processado(s), ${data.errors} erro(s).`
      );
    } catch {
      setSyncResult("Erro de conexão com o servidor");
    } finally {
      setSyncing(false);
    }
  }

  const cards = stats
    ? [
        {
          label: "Produtos",
          value: stats.totalProdutos,
          color: "text-primary",
          bg: "bg-primary/10",
        },
        {
          label: "Códigos Gerados",
          value: stats.totalCodigos,
          color: "text-blue-400",
          bg: "bg-blue-400/10",
        },
        {
          label: "Códigos Utilizados",
          value: stats.codigosUsados,
          color: "text-success",
          bg: "bg-success/10",
        },
        {
          label: "Usuários",
          value: stats.totalUsuarios,
          color: "text-purple-400",
          bg: "bg-purple-400/10",
        },
        {
          label: "Pedidos ML",
          value: stats.totalPedidos,
          color: "text-orange-400",
          bg: "bg-orange-400/10",
        },
      ]
    : [];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats ? (
          cards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="text-sm text-muted">{card.label}</div>
              <div className={`mt-2 text-3xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </div>
          ))
        ) : (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-border bg-card"
            />
          ))
        )}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-bold">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/produtos"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
          >
            Gerenciar Produtos
          </a>
          <a
            href="/admin/codigos"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
          >
            Gerar Códigos
          </a>
          <a
            href="/admin/upload"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
          >
            Upload de Timbres
          </a>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-bold">Mercado Livre</h2>
        <p className="mb-4 text-sm text-muted">
          Buscar novos pedidos e enviar códigos de ativação automaticamente.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSyncML}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
          >
            {syncing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Sincronizando...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sincronizar com ML
              </>
            )}
          </button>
          {syncResult && (
            <span
              className={`text-sm ${
                syncResult.startsWith("Erro")
                  ? "text-danger"
                  : "text-success"
              }`}
            >
              {syncResult}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
