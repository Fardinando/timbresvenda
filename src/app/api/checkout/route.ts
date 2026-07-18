import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { produto_id } = await req.json();

    if (!produto_id) {
      return NextResponse.json({ error: "produto_id obrigatório" }, { status: 400 });
    }

    const { data: produto } = await supabaseAdmin
      .from("produtos")
      .select("id, nome, slug, descricao, preco_stripe_price_id")
      .eq("id", produto_id)
      .eq("ativo", true)
      .single();

    if (!produto) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (produto.preco_stripe_price_id) {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: produto.preco_stripe_price_id, quantity: 1 }],
        success_url: `${siteUrl}/compra-confirmada?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/produtos/${produto.slug}`,
        metadata: { produto_id: produto.id },
      });

      return NextResponse.json({ url: session.url });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: produto.nome,
              description: produto.descricao || `Pack de timbres: ${produto.nome}`,
            },
            unit_amount: 0,
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/compra-confirmada?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/produtos/${produto.slug}`,
      metadata: { produto_id: produto.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao criar sessão de pagamento" },
      { status: 500 }
    );
  }
}
