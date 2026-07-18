import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { produto_id, releaseTag, files } = await req.json();

  if (!produto_id || !releaseTag || !files?.length) {
    return NextResponse.json({ error: "Parâmetros obrigatórios faltando" }, { status: 400 });
  }

  const chunks = files.flatMap(
    (f: { filename: string; size: number; chunksCount: number }) =>
      Array.from({ length: f.chunksCount }, (_, i) => ({
        filename: `${f.filename}.part${String(i).padStart(3, "0")}`,
        originalName: f.filename,
        size: Math.min(50 * 1024 * 1024, f.size - i * 50 * 1024 * 1024),
        index: i,
      }))
  );

  const totalSizeBytes = files.reduce(
    (acc: number, f: { size: number }) => acc + f.size,
    0
  );

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    if (bytes >= 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const arquivoNome = files.length === 1 ? files[0].filename : `${files[0].filename} (+${files.length - 1} arquivos)`;

  const { error } = await supabaseAdmin
    .from("produtos")
    .update({
      github_release_tag: releaseTag,
      chunks,
      arquivo_nome: arquivoNome,
      arquivo_tamanho: formatSize(totalSizeBytes),
    })
    .eq("id", produto_id);

  if (error) {
    return NextResponse.json({ error: "Erro ao salvar dados do produto" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, chunks: chunks.length });
}
