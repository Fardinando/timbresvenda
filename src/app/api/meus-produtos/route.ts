import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Faça login" }, { status: 401 });
    }

    const { data: links } = await supabaseAdmin
      .from("usuario_produtos")
      .select("produto_id, activated_at")
      .eq("usuario_id", session.userId);

    if (!links || links.length === 0) {
      return NextResponse.json({ produtos: [] });
    }

    const produtoIds = links.map((l) => l.produto_id);

    const { data: produtos } = await supabaseAdmin
      .from("produtos")
      .select("id, nome, slug, descricao, arquivo_tamanho, arquivo_nome, chunks")
      .in("id", produtoIds)
      .eq("ativo", true);

    const result = (produtos ?? []).map((p) => {
      let chunks = p.chunks;
      if (typeof chunks === "string") chunks = JSON.parse(chunks);
      return {
        ...p,
        chunks: chunks ?? [],
        activated_at: links.find((l) => l.produto_id === p.id)?.activated_at,
      };
    });

    return NextResponse.json({ produtos: result });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}
