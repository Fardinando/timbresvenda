import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Faça login para ativar códigos" }, { status: 401 });
    }

    const { codigo } = await req.json();
    if (!codigo || typeof codigo !== "string") {
      return NextResponse.json({ error: "Código obrigatório" }, { status: 400 });
    }

    const cleanCode = codigo.trim().toUpperCase();

    const { data: code } = await supabaseAdmin
      .from("codigos")
      .select("id, produto_id, usado, codigo")
      .eq("codigo", cleanCode)
      .single();

    if (!code) {
      return NextResponse.json({ error: "Código inválido" }, { status: 404 });
    }

    if (code.usado) {
      const { data: existingLink } = await supabaseAdmin
        .from("usuario_produtos")
        .select("id")
        .eq("usuario_id", session.userId)
        .eq("produto_id", code.produto_id)
        .single();

      if (existingLink) {
        return NextResponse.json({
          ok: true,
          message: "Este produto já está atrelado à sua conta",
          produtoId: code.produto_id,
        });
      }

      return NextResponse.json({ error: "Este código já foi utilizado" }, { status: 400 });
    }

    const { error: updateError } = await supabaseAdmin
      .from("codigos")
      .update({
        usado: true,
        usado_em: new Date().toISOString(),
        usuario_id: session.userId,
      })
      .eq("id", code.id);

    if (updateError) throw updateError;

    const { error: linkError } = await supabaseAdmin
      .from("usuario_produtos")
      .insert({
        usuario_id: session.userId,
        produto_id: code.produto_id,
      });

    if (linkError && linkError.code !== "23505") throw linkError;

    const { data: produto } = await supabaseAdmin
      .from("produtos")
      .select("nome, slug")
      .eq("id", code.produto_id)
      .single();

    return NextResponse.json({
      ok: true,
      message: `Produto "${produto?.nome}" ativado com sucesso!`,
      produtoId: code.produto_id,
    });
  } catch {
    return NextResponse.json({ error: "Erro ao ativar código" }, { status: 500 });
  }
}
