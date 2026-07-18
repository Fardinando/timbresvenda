import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data: produtos } = await supabaseAdmin
    .from("produtos")
    .select("id, nome, slug, descricao, arquivo_tamanho, preco")
    .eq("ativo", true)
    .order("created_at", { ascending: false });

  return NextResponse.json({ produtos: produtos ?? [] });
}
