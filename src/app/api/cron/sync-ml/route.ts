import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { searchOrders, getOrder, sendBuyerMessage } from "@/lib/ml-api";
import { generateActivationCode } from "@/lib/codes";

export const maxDuration = 30;

async function handleSync(req: Request) {
  const cronSecret = req.headers.get("x-cron-secret");
  const authorization = req.headers.get("authorization");
  const session = await getSession();

  const isVercelCron = authorization === `Bearer ${process.env.CRON_SECRET}`;
  if (cronSecret !== process.env.CRON_SECRET && !isVercelCron && !session?.isAdmin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const sellerId = process.env.ML_SELLER_ID;
    if (!sellerId) {
      return NextResponse.json({ error: "ML_SELLER_ID não configurado" }, { status: 500 });
    }

    const { data: lastSync } = await supabaseAdmin
      .from("pedidos_ml")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const result = await searchOrders(sellerId, lastSync?.created_at);
    const orders = result.results ?? [];

    const { data: produtos } = await supabaseAdmin
      .from("produtos")
      .select("id, ml_item_id, nome, slug")
      .eq("ativo", true);

    const processed = [];
    const errors = [];

    for (const order of orders) {
      if (order.status !== "paid") continue;

      const existingOrder = await supabaseAdmin
        .from("pedidos_ml")
        .select("id")
        .eq("ml_order_id", String(order.id))
        .single();

      if (existingOrder.data) continue;

      const orderDetail = order.pack_id ? await getOrder(order.id) : order;
      const itemId = orderDetail.items?.[0]?.id;
      const produto = produtos?.find((p) => p.ml_item_id === itemId);

      if (!produto) {
        errors.push({
          orderId: order.id,
          error: "Produto não encontrado no sistema",
        });
        continue;
      }

      const code = generateActivationCode();

      const { data: insertedCode } = await supabaseAdmin
        .from("codigos")
        .insert({
          codigo: code,
          produto_id: produto.id,
        })
        .select("id")
        .single();

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const message = [
        `Obrigado pela compra!`,
        ``,
        `Seu timbre "${produto.nome}" está pronto para download.`,
        ``,
        `Link: ${siteUrl}/ativar`,
        `Código: ${code}`,
        ``,
        `Como ativar:`,
        `1. Acesse o link acima`,
        `2. Crie sua conta ou faça login`,
        `3. Insira o código de ativação`,
        `4. Acesse "Meus Produtos" para baixar`,
        ``,
        `Tutorial: ${siteUrl}/produtos/${produto.slug}`,
      ].join("\n");

      await sendBuyerMessage(
        order.pack_id || order.id,
        sellerId,
        String(order.buyer?.id || order.buyer_id),
        message
      );

      await supabaseAdmin.from("pedidos_ml").insert({
        ml_order_id: String(order.id),
        ml_buyer_id: String(order.buyer?.id || order.buyer_id),
        ml_buyer_nickname: order.buyer?.nickname,
        produto_id: produto.id,
        codigo_id: insertedCode?.id,
        status: "processado",
      });

      processed.push({
        orderId: order.id,
        buyer: order.buyer?.nickname,
        produto: produto.nome,
        codigo: code,
      });
    }

    return NextResponse.json({
      ok: true,
      totalOrders: orders.length,
      processed: processed.length,
      errors: errors.length,
      details: { processed, errors },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Erro ao sincronizar com ML",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return handleSync(req);
}

export async function POST(req: Request) {
  return handleSync(req);
}
