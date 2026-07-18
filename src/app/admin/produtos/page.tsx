"use client";

import { useEffect, useState } from "react";

interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  ml_item_id: string | null;
  arquivo_tamanho: string | null;
  ativo: boolean;
  chunks: unknown;
}

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nome: "",
    slug: "",
    descricao: "",
    ml_item_id: "",
    instrucoes: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProdutos();
  }, []);

  async function loadProdutos() {
    const res = await fetch("/api/admin/produtos");
    const data = await res.json();
    setProdutos(data.produtos ?? []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...form, id: editingId } : form;
      const res = await fetch("/api/admin/produtos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Erro ao salvar");
        return;
      }

      setMessage(editingId ? "Produto atualizado!" : "Produto criado!");
      setForm({ nome: "", slug: "", descricao: "", ml_item_id: "", instrucoes: "" });
      setEditingId(null);
      loadProdutos();
    } catch {
      setMessage("Erro de conexão");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(produto: Produto) {
    setEditingId(produto.id);
    setForm({
      nome: produto.nome,
      slug: produto.slug,
      descricao: produto.descricao ?? "",
      ml_item_id: produto.ml_item_id ?? "",
      instrucoes: "",
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    await fetch("/api/admin/produtos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadProdutos();
  }

  async function handleToggle(id: string, ativo: boolean) {
    await fetch("/api/admin/produtos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ativo: !ativo }),
    });
    loadProdutos();
  }

  function generateSlug(nome: string) {
    return nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Produtos</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "Editar Produto" : "Novo Produto"}
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                Nome
              </label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => {
                  const nome = e.target.value;
                  setForm((f) => ({
                    ...f,
                    nome,
                    slug: editingId ? f.slug : generateSlug(nome),
                  }));
                }}
                required
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="Piano Grandioso"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                required
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="piano-grandioso"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">
              Descrição
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) =>
                setForm((f) => ({ ...f, descricao: e.target.value }))
              }
              rows={2}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="Descrição do produto..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted">
                ID do Item no ML (opcional)
              </label>
              <input
                type="text"
                value={form.ml_item_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ml_item_id: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="MLB1234567890"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">
              Instruções de Instalação
            </label>
            <textarea
              value={form.instrucoes}
              onChange={(e) =>
                setForm((f) => ({ ...f, instrucoes: e.target.value }))
              }
              rows={3}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="Como instalar os timbres no AudioEvolution..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {saving
                ? "Salvando..."
                : editingId
                  ? "Atualizar"
                  : "Criar Produto"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    nome: "",
                    slug: "",
                    descricao: "",
                    ml_item_id: "",
                    instrucoes: "",
                  });
                }}
                className="rounded-lg border border-border px-6 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Produtos Existentes</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        ) : produtos.length === 0 ? (
          <p className="text-sm text-muted">Nenhum produto cadastrado.</p>
        ) : (
          <div className="space-y-3">
            {produtos.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/20"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{p.nome}</h3>
                    {!p.ativo && (
                      <span className="rounded-md bg-danger/10 px-2 py-0.5 text-xs text-danger">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    /{p.slug} &middot; {p.arquivo_tamanho ?? "Sem arquivo"}
                    {p.ml_item_id && ` · ML: ${p.ml_item_id}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(p.id, p.ativo)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      p.ativo
                        ? "text-success hover:bg-success/10"
                        : "text-muted hover:bg-white/5"
                    }`}
                  >
                    {p.ativo ? "Ativo" : "Inativo"}
                  </button>
                  <button
                    onClick={() => handleEdit(p)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
