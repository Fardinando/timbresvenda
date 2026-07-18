import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { generateActivationCode } from "@/lib/codes";

export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { data: codigos } = await supabaseAdmin
    .from("codigos")
    .select("*, produto:produtos(nome)")
    .order("created_at", { ascending: false });

  return NextResponse.json({ codigos: codigos ?? [] });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { produto_id, quantidade } = await req.json();

  if (!produto_id || !quantidade || quantidade < 1 || quantidade > 100) {
    return NextResponse.json(
      { error: "Produto e quantidade (1-100) obrigatórios" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabaseAdmin
    .from("codigos")
    .select("codigo");

  const existingCodes = new Set((existing ?? []).map((c) => c.codigo));

  const newCodes: string[] = [];
  let attempts = 0;

  while (newCodes.length < quantidade && attempts < quantidade * 10) {
    const code = generateActivationCode();
    if (!existingCodes.has(code)) {
      existingCodes.add(code);
      newCodes.push(code);
    }
    attempts++;
  }

  if (newCodes.length < quantidade) {
    return NextResponse.json(
      { error: "Não foi possível gerar códigos únicos" },
      { status: 500 }
    );
  }

  const rows = newCodes.map((codigo) => ({
    codigo,
    produto_id,
  }));

  const { data: inserted, error } = await supabaseAdmin
    .from("codigos")
    .insert(rows)
    .select("id, codigo, produto_id, usado, created_at");

  if (error) return NextResponse.json({ error: "Erro ao salvar códigos" }, { status: 500 });

  return NextResponse.json({ codigos: inserted ?? [], message: `${newCodes.length} códigos gerados` });
}
