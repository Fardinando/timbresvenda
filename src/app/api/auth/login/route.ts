import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });
    }

    const { data: user } = await supabaseAdmin
      .from("usuarios")
      .select("id, email, nome, password_hash, is_admin")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    await createSession({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin ?? false,
    });

    return NextResponse.json({ ok: true, nome: user.nome, isAdmin: user.is_admin });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
