import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { createRelease } from "@/lib/github";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { produto_id, produto_nome, files } = await req.json();

  if (!produto_id || !files?.length) {
    return NextResponse.json({ error: "produto_id e files obrigatórios" }, { status: 400 });
  }

  const { data: existing } = await supabaseAdmin
    .from("produtos")
    .select("github_release_tag")
    .eq("id", produto_id)
    .single();

  if (existing?.github_release_tag) {
    return NextResponse.json(
      { error: "Este produto já possui arquivos. Exclua os antigos antes de enviar novos." },
      { status: 400 }
    );
  }

  const tag = `produto-${produto_id}-${Date.now()}`;
  const release = await createRelease(tag, `Timbres: ${produto_nome}`);

  const totalSize = files.reduce((acc: number, f: { size: number }) => acc + f.size, 0);
  const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(1);

  return NextResponse.json({
    releaseTag: tag,
    releaseId: release.id,
    totalSize: `${totalSizeGB} GB`,
    totalFiles: files.length,
  });
}
