"use client";

import { useEffect, useState, useRef } from "react";

interface Produto {
  id: string;
  nome: string;
  slug: string;
  chunks: unknown;
}

interface UploadState {
  status: "idle" | "compressing" | "uploading" | "finalizing" | "done" | "error";
  progress: number;
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  error?: string;
}

const CHUNK_SIZE = 50 * 1024 * 1024;

export default function AdminUpload() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selectedProduto, setSelectedProduto] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0,
    currentFile: 0,
    totalFiles: 0,
    currentFileName: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/produtos")
      .then((r) => r.json())
      .then((data) => setProdutos(data.produtos ?? []));
  }, []);

  async function handleUpload() {
    if (!selectedProduto || !fileInputRef.current?.files?.length) return;

    const files = Array.from(fileInputRef.current.files);
    const produto = produtos.find((p) => p.id === selectedProduto);
    if (!produto) return;

    setUploadState({
      status: "uploading",
      progress: 0,
      currentFile: 0,
      totalFiles: files.length,
      currentFileName: "",
    });

    try {
      const res = await fetch("/api/admin/upload/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto_id: selectedProduto,
          produto_nome: produto.nome,
          files: files.map((f) => ({ name: f.name, size: f.size })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const { releaseTag, releaseId } = data;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadState((prev) => ({
          ...prev,
          currentFile: i + 1,
          currentFileName: file.name,
          progress: 0,
        }));

        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          const start = chunkIndex * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const blob = file.slice(start, end);

          const formData = new FormData();
          formData.append("chunk", blob);
          formData.append("releaseId", String(releaseId));
          formData.append("filename", `${file.name}.part${String(chunkIndex).padStart(3, "0")}`);

          const uploadRes = await fetch("/api/admin/upload/chunk", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) {
            const errData = await uploadRes.json();
            throw new Error(errData.error || "Erro ao enviar chunk");
          }

          const chunkProgress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
          setUploadState((prev) => ({
            ...prev,
            progress: chunkProgress,
          }));
        }
      }

      setUploadState((prev) => ({ ...prev, status: "finalizing" }));

      const finalizeRes = await fetch("/api/admin/upload/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto_id: selectedProduto,
          releaseTag,
          files: files.map((f) => ({
            filename: f.name,
            size: f.size,
            chunksCount: Math.ceil(f.size / CHUNK_SIZE),
          })),
        }),
      });

      if (!finalizeRes.ok) {
        const errData = await finalizeRes.json();
        throw new Error(errData.error);
      }

      setUploadState((prev) => ({ ...prev, status: "done", progress: 100 }));
    } catch (err) {
      setUploadState((prev) => ({
        ...prev,
        status: "error",
        error: err instanceof Error ? err.message : "Erro desconhecido",
      }));
    }
  }

  function resetUpload() {
    setUploadState({
      status: "idle",
      progress: 0,
      currentFile: 0,
      totalFiles: 0,
      currentFileName: "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Upload de Timbres</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">Enviar Arquivos</h2>
        <p className="mb-6 text-sm text-muted">
          Selecione um produto e faça upload dos arquivos compactados (.7z, .zip).
          Os arquivos serão divididos em pedaços e enviados para armazenamento.
        </p>

        <div className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted">
              Produto
            </label>
            <select
              value={selectedProduto}
              onChange={(e) => setSelectedProduto(e.target.value)}
              disabled={uploadState.status !== "idle"}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
            >
              <option value="">Selecione um produto...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">
              Arquivos
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".7z,.zip,.rar,.tar.gz"
              disabled={uploadState.status !== "idle"}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20 disabled:opacity-50"
            />
          </div>

          {uploadState.status === "uploading" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">
                  Arquivo {uploadState.currentFile}/{uploadState.totalFiles}:{" "}
                  <span className="text-foreground">
                    {uploadState.currentFileName}
                  </span>
                </span>
                <span className="font-mono text-primary">
                  {uploadState.progress}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted/20">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${((uploadState.currentFile - 1) / uploadState.totalFiles) * 100 + (uploadState.progress / uploadState.totalFiles)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {uploadState.status === "finalizing" && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Finalizando upload...
            </div>
          )}

          {uploadState.status === "done" && (
            <div className="rounded-lg border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
              Upload concluído com sucesso!
            </div>
          )}

          {uploadState.status === "error" && (
            <div className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
              {uploadState.error}
            </div>
          )}

          <div className="flex gap-3">
            {uploadState.status === "idle" ? (
              <button
                onClick={handleUpload}
                disabled={!selectedProduto || !fileInputRef.current?.files?.length}
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Enviar
              </button>
            ) : (
              <button
                onClick={resetUpload}
                className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {uploadState.status === "done" || uploadState.status === "error"
                  ? "Novo Upload"
                  : "Cancelar"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Produtos com Arquivos</h2>
        <div className="space-y-2">
          {produtos.map((p) => {
            let chunks = p.chunks;
            if (typeof chunks === "string") chunks = JSON.parse(chunks);
            const chunkCount = Array.isArray(chunks) ? chunks.length : 0;
            return (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3"
              >
                <span className="text-sm font-medium">{p.nome}</span>
                <span className="text-xs text-muted-foreground">
                  {chunkCount > 0
                    ? `${chunkCount} chunk(s) enviado(s)`
                    : "Sem arquivos"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
