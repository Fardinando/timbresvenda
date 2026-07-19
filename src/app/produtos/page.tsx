"use client";

import Shell from "@/components/Shell";
import AudioPlayer from "@/components/AudioPlayer";
import { useEffect, useState } from "react";

interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  arquivo_tamanho: string | null;
  preco: number | null;
  preview_url: string | null;
}

const visualClasses = [
  "product-visual-1",
  "product-visual-2",
  "product-visual-3",
  "product-visual-4",
  "product-visual-5",
  "product-visual-6",
];

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
      <section className="relative overflow-hidden mesh-gradient">
        <div className="hero-glow bg-primary" style={{ left: "30%", top: "-200px" }} />

        <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-16">
          <div className="text-center animate-slide-up">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Catálogo de <span className="gradient-text">Timbres</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted">
              Soundfonts profissionais em formato SF2. Ouve a prévia, escolha a sua e comece a produzir.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {loading ? "Carregando..." : `${produtos.length} produtos`}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl card-gradient">
                <div className="h-40 animate-pulse bg-muted/5" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted/10" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted/10" />
                  <div className="h-10 w-1/2 animate-pulse rounded bg-muted/10" />
                </div>
              </div>
            ))}
          </div>
        ) : produtos.length === 0 ? (
          <div className="rounded-2xl card-gradient p-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/10 text-muted">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <p className="text-muted">
              Nenhum produto disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto, index) => {
              const price = formatPrice(produto.preco);
              const visualClass = visualClasses[index % visualClasses.length];
              return (
                <div
                  key={produto.id}
                  className="group overflow-hidden rounded-2xl card-gradient transition-all duration-300 hover:glow-primary-strong flex flex-col"
                >
                  <div className={`relative ${visualClass} h-44 flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                        SoundFont SF2
                      </span>
                    </div>
                    {price && (
                      <div className="absolute top-3 right-3 rounded-lg bg-primary px-3 py-1.5 shadow-lg shadow-primary/20">
                        <span className="text-sm font-bold text-background">{price}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-base font-bold leading-tight">{produto.nome}</h3>
                    {produto.descricao && (
                      <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
                        {produto.descricao}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                      {produto.arquivo_tamanho && (
                        <div className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {produto.arquivo_tamanho}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download instantâneo
                      </div>
                    </div>

                    {produto.preview_url && (
                      <div className="mt-3">
                        <AudioPlayer src={produto.preview_url} />
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      <button
                        onClick={() => handleBuy(produto.id)}
                        disabled={buyingId === produto.id}
                        className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-background transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
                      >
                        {buyingId === produto.id ? (
                          <span className="inline-flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Redirecionando...
                          </span>
                        ) : (
                          price ? "Comprar Agora" : "Ativar Grátis"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 rounded-2xl card-gradient p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold">Pagamento 100% seguro</p>
                <p className="text-xs text-muted">Dados protegidos com criptografia SSL</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold">Entrega instantânea</p>
                <p className="text-xs text-muted">Download disponível após ativação</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
