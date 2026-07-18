"use client";

import Shell from "@/components/Shell";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  arquivo_tamanho: string | null;
  arquivo_nome: string | null;
  chunks: { filename: string; size: number; url: string }[];
}

interface DownloadState {
  status: "idle" | "downloading" | "assembling" | "done" | "error";
  progress: number;
  currentChunk: number;
  totalChunks: number;
  error?: string;
}

export default function MeusProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadStates, setDownloadStates] = useState<
    Record<string, DownloadState>
  >({});

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(() => {
        return fetch("/api/meus-produtos");
      })
      .then((r) => r.json())
      .then((data) => {
        setProdutos(data.produtos ?? []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  async function handleDownload(produto: Produto) {
    setDownloadStates((prev) => ({
      ...prev,
      [produto.id]: {
        status: "downloading",
        progress: 0,
        currentChunk: 0,
        totalChunks: produto.chunks.length,
      },
    }));

    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: produto.arquivo_nome ?? `${produto.slug}.7z`,
        types: [
          {
            description: "Arquivo compactado",
            accept: { "application/octet-stream": [".7z", ".zip"] },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      const totalBytes = produto.chunks.reduce((acc, c) => acc + c.size, 0);
      let downloadedBytes = 0;

      for (let i = 0; i < produto.chunks.length; i++) {
        const chunk = produto.chunks[i];

        setDownloadStates((prev) => ({
          ...prev,
          [produto.id]: {
            status: "downloading",
            progress: 0,
            currentChunk: i + 1,
            totalChunks: produto.chunks.length,
          },
        }));

        const response = await fetch(chunk.url);
        if (!response.ok) throw new Error(`Erro ao baixar chunk ${i + 1}`);

        const reader = response.body!.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          await writable.write(value);
          downloadedBytes += value.length;
          const progress = Math.round((downloadedBytes / totalBytes) * 100);
          setDownloadStates((prev) => ({
            ...prev,
            [produto.id]: {
              ...prev[produto.id],
              progress,
            },
          }));
        }
      }

      setDownloadStates((prev) => ({
        ...prev,
        [produto.id]: {
          status: "assembling",
          progress: 100,
          currentChunk: produto.chunks.length,
          totalChunks: produto.chunks.length,
        },
      }));

      await writable.close();

      setDownloadStates((prev) => ({
        ...prev,
        [produto.id]: {
          status: "done",
          progress: 100,
          currentChunk: produto.chunks.length,
          totalChunks: produto.chunks.length,
        },
      }));
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setDownloadStates((prev) => ({
          ...prev,
          [produto.id]: {
            status: "idle",
            progress: 0,
            currentChunk: 0,
            totalChunks: 0,
          },
        }));
        return;
      }
      setDownloadStates((prev) => ({
        ...prev,
        [produto.id]: {
          status: "error",
          progress: 0,
          currentChunk: 0,
          totalChunks: 0,
          error: err instanceof Error ? err.message : "Erro desconhecido",
        },
      }));
    }
  }

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
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Meus Produtos</h1>
          <p className="mt-2 text-muted">
            Seus timbres ativados. Faça login em qualquer dispositivo para
            acessar.
          </p>
        </div>

        {produtos.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/10 text-muted">
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
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Nenhum produto ainda</h3>
            <p className="mt-2 text-sm text-muted">
              Ative um código para ver seus produtos aqui.
            </p>
            <Link
              href="/ativar"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-hover"
            >
              Ativar Código
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {produtos.map((produto) => {
              const ds = downloadStates[produto.id];
              return (
                <div
                  key={produto.id}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{produto.nome}</h3>
                      {produto.descricao && (
                        <p className="mt-1 text-sm text-muted line-clamp-2">
                          {produto.descricao}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {produto.arquivo_tamanho && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-muted/10 px-2 py-1">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                              />
                            </svg>
                            {produto.arquivo_tamanho}
                          </span>
                        )}
                        {produto.chunks.length > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-muted/10 px-2 py-1">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              />
                            </svg>
                            {produto.chunks.length} arquivo(s)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {(!ds || ds.status === "idle") && (
                        <button
                          onClick={() => handleDownload(produto)}
                          disabled={produto.chunks.length === 0}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-hover disabled:opacity-50"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Baixar
                        </button>
                      )}

                      {ds?.status === "downloading" && (
                        <div className="w-64 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted">
                              Chunk {ds.currentChunk}/{ds.totalChunks}
                            </span>
                            <span className="font-mono text-primary">
                              {ds.progress}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted/20">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-300"
                              style={{ width: `${ds.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {ds?.status === "assembling" && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          Finalizando...
                        </div>
                      )}

                      {ds?.status === "done" && (
                        <div className="flex items-center gap-2 text-sm text-success">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Download completo!
                        </div>
                      )}

                      {ds?.status === "error" && (
                        <div className="space-y-2">
                          <p className="text-xs text-danger">{ds.error}</p>
                          <button
                            onClick={() => handleDownload(produto)}
                            className="text-xs text-primary hover:text-primary-hover"
                          >
                            Tentar novamente
                          </button>
                        </div>
                      )}
                    </div>
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
