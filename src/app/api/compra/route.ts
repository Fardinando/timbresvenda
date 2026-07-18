import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ erro: "session_id obrigatório" }, { status: 400 });
  }

  const { data: pedido } = await supabaseAdmin
    .from("pedidos_stripe")
    .select("codigo_gerado, status, produto:produtos(nome)")
    .eq("stripe_session_id", sessionId)
    .single();

  if (!pedido) {
    return NextResponse.json({ erro: "Compra não encontrada" }, { status: 404 });
  }

  if (pedido.status !== "pago") {
    return NextResponse.json({ erro: "Pagamento ainda não confirmado" }, { status: 400 });
  }

  return NextResponse.json({
    codigo: pedido.codigo_gerado,
    produto_nome: (pedido.produto as unknown as { nome: string })?.nome ?? "Produto",
  });
}
