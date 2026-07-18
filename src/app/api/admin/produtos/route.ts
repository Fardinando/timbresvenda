import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { data: produtos } = await supabaseAdmin
    .from("produtos")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ produtos: produtos ?? [] });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { nome, slug, descricao, ml_item_id, instrucoes } = await req.json();

  if (!nome || !slug) {
    return NextResponse.json({ error: "Nome e slug obrigatórios" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("produtos")
    .insert({ nome, slug, descricao, ml_item_id, instrucoes })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Já existe um produto com este slug" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }

  return NextResponse.json({ produto: data });
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  const allowedFields = ["nome", "slug", "descricao", "ml_item_id", "instrucoes", "ativo"];
  const filtered: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }

  const { error } = await supabaseAdmin
    .from("produtos")
    .update(filtered)
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("produtos").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
