import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { checkoutRequest, checkoutWebhookSecret, getCheckoutApiKey } from "../../../checkout";

type PaymentStatus = { status: string; data?: { id?: number; amount?: number; status?: string } };

function secureEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export async function POST(req: NextRequest) {
  const expectedSecret = checkoutWebhookSecret();
  const suppliedSecret = req.nextUrl.searchParams.get("token") || "";
  if (!expectedSecret || !secureEqual(suppliedSecret, expectedSecret)) {
    return NextResponse.json({ error: "Ruxsat yo‘q" }, { status: 403 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto‘g‘ri JSON" }, { status: 400 });
  }
  const providerOrderId = Number(payload?.data?.order_id);
  if (payload?.event !== "payment_confirmed" || !providerOrderId) return NextResponse.json({ ok: true, ignored: true });

  const order = await env.DB.prepare("SELECT id,total,payment_status FROM orders WHERE checkout_payment_id=?").bind(providerOrderId).first<{ id: number; total: number; payment_status: string }>();
  if (!order || order.payment_status === "paid") return NextResponse.json({ ok: true, ignored: true });

  const apiKey = await getCheckoutApiKey(env.DB);
  if (!apiKey) return NextResponse.json({ error: "CHECKOUT sozlanmagan" }, { status: 503 });
  const verified = await checkoutRequest<PaymentStatus>(apiKey, "status_payment", { id: providerOrderId });
  if (verified.data?.status !== "paid" || Number(verified.data.amount) !== Number(order.total)) {
    return NextResponse.json({ error: "To‘lov tasdiqlanmadi" }, { status: 409 });
  }

  await env.DB.prepare("UPDATE orders SET payment_status='paid' WHERE id=? AND payment_status!='paid'").bind(order.id).run();
  return NextResponse.json({ ok: true });
}
