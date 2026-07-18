import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const [produtos, codigos, usuarios, pedidos] = await Promise.all([
    supabaseAdmin.from("produtos").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("codigos").select("id, usado", { count: "exact" }),
    supabaseAdmin.from("usuarios").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("pedidos_ml").select("id", { count: "exact", head: true }),
  ]);

  const allCodes = codigos.data ?? [];

  return NextResponse.json({
    totalProdutos: produtos.count ?? 0,
    totalCodigos: allCodes.length,
    codigosUsados: allCodes.filter((c) => c.usado).length,
    totalUsuarios: usuarios.count ?? 0,
    totalPedidos: pedidos.count ?? 0,
  });
}
