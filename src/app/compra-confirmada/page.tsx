"use client";

import Shell from "@/components/Shell";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface CompraInfo {
  codigo: string;
  produto_nome: string;
  erro?: string;
}

function CompraConfirmadaInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [info, setInfo] = useState<CompraInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setInfo({ codigo: "", produto_nome: "", erro: "Sessão não encontrada" });
      setLoading(false);
      return;
    }

    fetch(`/api/compra?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        setInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setInfo({ codigo: "", produto_nome: "", erro: "Erro ao consultar compra" });
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <Shell>
        <div className="flex flex-1 items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center glow-primary">
          {info?.erro ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Erro</h1>
              <p className="mt-3 text-muted">{info.erro}</p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Compra Confirmada!</h1>
              <p className="mt-2 text-muted">
                Seu timbre <strong>{info?.produto_nome}</strong> está pronto.
              </p>

              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">
                  Seu código de ativação
                </p>
                <p className="font-mono text-2xl font-bold tracking-widest text-primary">
                  {info?.codigo}
                </p>
              </div>

              <div className="mt-6 space-y-3 text-left text-sm text-muted">
                <p className="font-semibold text-foreground">Como ativar:</p>
                <ol className="list-inside list-decimal space-y-1">
                  <li>Acesse <Link href="/login" className="text-primary hover:text-primary-hover">fazer login</Link> ou <Link href="/cadastro" className="text-primary hover:text-primary-hover">crie uma conta</Link></li>
                  <li>Vá em <Link href="/ativar" className="text-primary hover:text-primary-hover">Ativar Código</Link></li>
                  <li>Insira o código acima</li>
                  <li>Acesse <Link href="/meus-produtos" className="text-primary hover:text-primary-hover">Meus Produtos</Link> para baixar</li>
                </ol>
              </div>

              <div className="mt-8 flex gap-3">
                <Link
                  href="/ativar"
                  className="flex-1 rounded-lg bg-primary py-3 text-center text-sm font-semibold text-background transition-colors hover:bg-primary-hover"
                >
                  Ativar Agora
                </Link>
                <Link
                  href="/"
                  className="flex-1 rounded-lg border border-border py-3 text-center text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  Voltar ao Início
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}

export default function CompraConfirmadaPage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </Shell>
      }
    >
      <CompraConfirmadaInner />
    </Suspense>
  );
}
