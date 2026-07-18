const ML_API = "https://api.mercadolibre.com";

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getMLAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token;
  }

  const res = await fetch(`${ML_API}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.ML_CLIENT_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      refresh_token: process.env.ML_REFRESH_TOKEN!,
    }),
  });

  if (!res.ok) throw new Error("Failed to refresh ML token");
  const data = await res.json();

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

export async function searchOrders(sellerId: string, lastDate?: string) {
  const token = await getMLAccessToken();
  const params = new URLSearchParams({
    seller: sellerId,
    sort: "date_asc",
    limit: "50",
  });
  if (lastDate) params.set("last_date", lastDate);

  const res = await fetch(`${ML_API}/orders/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to search ML orders");
  return res.json();
}

export async function getOrder(orderId: string) {
  const token = await getMLAccessToken();
  const res = await fetch(`${ML_API}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to get ML order");
  return res.json();
}

export async function sendBuyerMessage(
  packId: string | number,
  sellerId: string,
  buyerId: string,
  text: string
) {
  const token = await getMLAccessToken();
  const res = await fetch(
    `${ML_API}/messages/packs/${packId}/sellers/${sellerId}?tag=post_sale`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { user_id: sellerId },
        to: { user_id: buyerId },
        text,
      }),
    }
  );

  return res.ok;
}
