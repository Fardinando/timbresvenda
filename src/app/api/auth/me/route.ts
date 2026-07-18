import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { data: user } = await supabaseAdmin
    .from("usuarios")
    .select("email, nome, is_admin")
    .eq("id", session.userId)
    .single();

  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  return NextResponse.json({
    email: user.email,
    nome: user.nome,
    isAdmin: user.is_admin,
  });
}
