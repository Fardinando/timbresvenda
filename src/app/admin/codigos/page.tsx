"use client";

import { useEffect, useState } from "react";

interface Produto {
  id: string;
  nome: string;
  slug: string;
}

interface Codigo {
  id: string;
  codigo: string;
  produto_id: string;
  usado: boolean;
  usado_em: string | null;
  ml_order_id: string | null;
  created_at: string;
  produto?: { nome: string };
}

export default function AdminCodigos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [codigos, setCodigos] = useState<Codigo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduto, setSelectedProduto] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/produtos").then((r) => r.json()),
      fetch("/api/admin/codigos").then((r) => r.json()),
    ]).then(([p, c]) => {
      setProdutos(p.produtos ?? []);
      setCodigos(c.codigos ?? []);
      setLoading(false);
    });
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduto) {
      setMessage("Selecione um produto");
      return;
    }

    setGenerating(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/codigos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto_id: selectedProduto,
          quantidade,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Erro ao gerar códigos");
        return;
      }

      setMessage(`${quantidade} código(s) gerado(s) com sucesso!`);
      setCodigos((prev) => [...(data.codigos ?? []), ...prev]);
      setQuantidade(1);
    } catch {
      setMessage("Erro de conexão");
    } finally {
      setGenerating(false);
    }
  }

  function copyCode(codigo: string) {
    navigator.clipboard.writeText(codigo);
    setMessage(`Código ${codigo} copiado!`);
    setTimeout(() => setMessage(""), 2000);
  }

  const codigosFiltrados = selectedProduto
    ? codigos.filter((c) => c.produto_id === selectedProduto)
    : codigos;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Códigos de Ativação</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Gerar Novos Códigos</h2>

        {message && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm ${
              message.includes("Erro")
                ? "border border-danger/20 bg-danger/5 text-danger"
                : "border border-success/20 bg-success/5 text-success"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleGenerate} className="flex flex-wrap items-end gap-4">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-sm font-medium text-muted">
              Produto
            </label>
            <select
              value={selectedProduto}
              onChange={(e) => setSelectedProduto(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">Selecione...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="w-24">
            <label className="mb-1 block text-sm font-medium text-muted">
              Qtd
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            {generating ? "Gerando..." : "Gerar Códigos"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">
          Códigos Existentes ({codigosFiltrados.length})
        </h2>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg border border-border bg-card"
              />
            ))}
          </div>
        ) : codigosFiltrados.length === 0 ? (
          <p className="text-sm text-muted">Nenhum código gerado.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Produto</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Criado em</th>
                    <th className="px-4 py-3">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {codigosFiltrados.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-border/50 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        {c.codigo}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {c.produto?.nome ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {c.usado ? (
                          <span className="rounded-md bg-success/10 px-2 py-0.5 text-xs text-success">
                            Utilizado
                          </span>
                        ) : (
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            Disponível
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        {!c.usado && (
                          <button
                            onClick={() => copyCode(c.codigo)}
                            className="text-xs text-primary hover:text-primary-hover"
                          >
                            Copiar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
