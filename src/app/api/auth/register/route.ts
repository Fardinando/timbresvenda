import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, nome } = await req.json();

    if (!email || !password || !nome) {
      return NextResponse.json(
        { error: "Nome, email e senha obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from("usuarios")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabaseAdmin
      .from("usuarios")
      .insert({
        email: email.toLowerCase().trim(),
        nome: nome.trim(),
        password_hash,
      })
      .select("id, email, is_admin")
      .single();

    if (error) throw error;

    await createSession({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin ?? false,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao criar conta" }, { status: 500 });
  }
}
