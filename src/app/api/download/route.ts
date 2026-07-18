import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { listReleaseAssets } from "@/lib/github";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Faça login" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const produtoId = searchParams.get("produto_id");

    if (!produtoId) {
      return NextResponse.json({ error: "produto_id obrigatório" }, { status: 400 });
    }

    const { data: link } = await supabaseAdmin
      .from("usuario_produtos")
      .select("id")
      .eq("usuario_id", session.userId)
      .eq("produto_id", produtoId)
      .single();

    if (!link) {
      return NextResponse.json({ error: "Produto não atrelado à sua conta" }, { status: 403 });
    }

    const { data: produto } = await supabaseAdmin
      .from("produtos")
      .select("github_release_tag, chunks, arquivo_nome, nome")
      .eq("id", produtoId)
      .single();

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    let chunks = produto.chunks;
    if (chunks && typeof chunks === "string") {
      chunks = JSON.parse(chunks);
    }

    if ((!chunks || chunks.length === 0) && produto.github_release_tag) {
      const assets = await listReleaseAssets(produto.github_release_tag);
      chunks = assets.map((a: { name: string; size: number; browser_download_url: string }) => ({
        filename: a.name,
        size: a.size,
        url: a.browser_download_url,
      }));
    }

    return NextResponse.json({
      produto: {
        id: produtoId,
        nome: produto.nome,
        arquivo_nome: produto.arquivo_nome,
      },
      chunks: chunks ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar dados de download" }, { status: 500 });
  }
}
