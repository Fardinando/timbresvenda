import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { generateActivationCode } from "@/lib/codes";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const produtoId = session.metadata?.produto_id;

    if (produtoId) {
      const code = generateActivationCode();

      await supabaseAdmin.from("codigos").insert({
        codigo: code,
        produto_id: produtoId,
      });

      await supabaseAdmin.from("pedidos_stripe").insert({
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        produto_id: produtoId,
        codigo_gerado: code,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
        status: "pago",
      });
    }
  }

  return NextResponse.json({ received: true });
}
