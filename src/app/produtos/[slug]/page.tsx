"use client";

import Shell from "@/components/Shell";
import AudioPlayer from "@/components/AudioPlayer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  instrucoes: string | null;
  arquivo_tamanho: string | null;
  preco: number | null;
  preview_url: string | null;
  created_at: string;
}

const visualClasses = [
  "product-visual-1",
  "product-visual-2",
  "product-visual-3",
  "product-visual-4",
  "product-visual-5",
  "product-visual-6",
];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function ProdutoPage() {
  const routeParams = useParams<{ slug: string }>();
  const slug = routeParams.slug ?? "";
  const [produto, setProduto] = useState<Produto | null>(null);
  const [vendidos, setVendidos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/produtos/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => {
        setProduto(data.produto);
        setVendidos(data.vendidos);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  async function handleBuy() {
    if (!produto) return;
    setBuying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produto_id: produto.id }),
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
      setBuying(false);
    }
  }

  function formatPrice(price: number | null) {
    if (!price || price === 0) return null;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  }

  if (loading) {
    return (
      <Shell>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-48 rounded-2xl bg-muted/5" />
            <div className="h-8 w-1/2 rounded bg-muted/10" />
            <div className="h-4 w-3/4 rounded bg-muted/10" />
          </div>
        </div>
      </Shell>
    );
  }

  if (notFound || !produto) {
    return (
      <Shell>
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Produto não encontrado</h1>
          <p className="mt-3 text-muted">O timbre que você procura não existe ou foi removido.</p>
          <Link
            href="/produtos"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-background transition-colors hover:bg-primary-hover"
          >
            Ver Catálogo
          </Link>
        </div>
      </Shell>
    );
  }

  const price = formatPrice(produto.preco);
  const visualClass = visualClasses[hashStr(produto.slug) % visualClasses.length];

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 pt-6 pb-16 sm:px-6">
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-primary">Início</Link>
          <span>/</span>
          <Link href="/produtos" className="transition-colors hover:text-primary">Catálogo</Link>
          <span>/</span>
          <span className="text-foreground">{produto.nome}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 min-w-0">
            <div className={`relative ${visualClass} flex h-64 items-center justify-center overflow-hidden rounded-2xl sm:h-80`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                  SoundFont SF2
                </span>
              </div>
              {price && (
                <div className="absolute top-4 right-4 rounded-xl bg-primary px-4 py-2 shadow-lg shadow-primary/30">
                  <span className="text-lg font-bold text-background">{price}</span>
                </div>
              )}
            </div>

            {produto.preview_url && (
              <div className="mt-4">
                <AudioPlayer src={produto.preview_url} label="Ouvir prévia" />
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Descrição
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted break-words">
                {produto.descricao || "Pacote de timbres profissionais em formato SoundFont (SF2), otimizado para AudioEvolution Mobile e outros DAWs compatíveis."}
              </p>
            </div>

            {produto.instrucoes && (
              <div className="mt-6">
                <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Instruções de uso
                </h2>
                <div className="mt-3 whitespace-pre-wrap rounded-xl border border-border bg-surface/80 p-4 text-sm leading-relaxed text-muted break-words">
                  {produto.instrucoes}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-20 rounded-2xl card-gradient p-6 glow-primary">
              <h1 className="text-2xl font-bold leading-tight break-words">{produto.nome}</h1>

              <div className="mt-4 flex items-center gap-4 text-sm text-muted">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download instantâneo
                </div>
                {produto.arquivo_tamanho && (
                  <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {produto.arquivo_tamanho}
                  </div>
                )}
              </div>

              {vendidos > 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex -space-x-1">
                    {[...Array(Math.min(3, vendidos))].map((_, i) => (
                      <div key={i} className="h-5 w-5 rounded-full border border-card bg-primary/20" />
                    ))}
                  </div>
                  <span>{vendidos} {vendidos === 1 ? "pessoa já comprou" : "pessoas já compraram"}</span>
                </div>
              )}

              <div className="mt-5 rounded-xl bg-surface/50 p-4">
                <p className="text-xs text-muted-foreground">Preço</p>
                <p className="mt-1 text-3xl font-bold text-primary">{price || "Grátis"}</p>
              </div>

              <button
                onClick={handleBuy}
                disabled={buying}
                className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-bold text-background shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
              >
                {buying ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processando...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    Comprar Agora
                  </span>
                )}
              </button>

              <div className="mt-4 flex items-center gap-2 text-center text-xs text-muted-foreground">
                <svg className="h-3.5 w-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Pagamento seguro via Mercado Pago ou Stripe
              </div>

              <Link
                href="/ativar"
                className="mt-3 block text-center text-xs font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Já tem um código? Ative aqui
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
