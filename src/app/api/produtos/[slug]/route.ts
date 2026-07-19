import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: produto } = await supabaseAdmin
    .from("produtos")
    .select("id, nome, slug, descricao, instrucoes, arquivo_tamanho, preco, preview_url, created_at")
    .eq("slug", slug)
    .eq("ativo", true)
    .single();

  if (!produto) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  const { count } = await supabaseAdmin
    .from("codigos")
    .select("*", { count: "exact", head: true })
    .eq("produto_id", produto.id)
    .eq("usado", true);

  return NextResponse.json({ produto, vendidos: count ?? 0 });
}
