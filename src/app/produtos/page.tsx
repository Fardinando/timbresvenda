"use client";

import Shell from "@/components/Shell";
import AudioPlayer from "@/components/AudioPlayer";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  arquivo_tamanho: string | null;
  preco: number | null;
  preview_url: string | null;
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/produtos")
      .then((r) => r.json())
      .then((data) => {
        setProdutos(data.produtos ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleBuy(produtoId: string) {
    setBuyingId(produtoId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produto_id: produtoId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erro ao criar pagamento");
      }
    } catch {
      alert("Erro de conexão");
    } finally {
      setBuyingId(null);
    }
  }

  function formatPrice(price: number | null) {
    if (!price || price === 0) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Nossos Produtos</h1>
          <p className="mt-3 text-muted">
            Escolha seu pacote de timbres profissionais
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
        ) : produtos.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-muted">
              Nenhum produto disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto) => {
              const price = formatPrice(produto.preco);
              return (
                <div
                  key={produto.id}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:glow-primary"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>

                  <h3 className="text-lg font-bold">{produto.nome}</h3>
                  {produto.descricao && (
                    <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
                      {produto.descricao}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    {price && (
                      <span className="text-xl font-bold text-primary">
                        {price}
                      </span>
                    )}
                    {produto.arquivo_tamanho && (
                      <span className="text-xs text-muted-foreground">
                        {produto.arquivo_tamanho}
                      </span>
                    )}
                  </div>

                  {produto.preview_url && (
                    <div className="mt-4">
                      <AudioPlayer src={produto.preview_url} label="Ouvir amostra" />
                    </div>
                  )}

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => handleBuy(produto.id)}
                      disabled={buyingId === produto.id}
                      className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
                    >
                      {buyingId === produto.id
                        ? "Redirecionando..."
                        : price
                          ? "Comprar"
                          : "Grátis - Ativar"}
                    </button>
                    <Link
                      href="/ativar"
                      className="rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      Código
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Shell>
  );
}
