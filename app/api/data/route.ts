import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import { sessionFromCookieHeader, verifyAdminSession } from "../../admin-auth";
import {
  checkoutIsConfigured,
  checkoutRequest,
  checkoutWebhookSecret,
  getCheckoutApiKey,
  removeCheckoutApiKey,
  safeCheckoutError,
  saveCheckoutApiKey,
} from "../../checkout";

const json = (data: unknown, status = 200) => NextResponse.json(data, { status });

async function seed() {
  const db = env.DB;
  const count = await db.prepare("SELECT COUNT(*) n FROM products").first<{ n: number }>();
  if (!count?.n) {
    const data = [
      ["Quyosh bowl", "bowl", "Tovuq, guruch, sabzi, avokado va limonli sous.", 59000, "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85", "ENG SEVIMLI"],
      ["Yashil quvvat", "bowl", "Brokkoli, no‘xat, bodring, ko‘kat va tahini.", 52000, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85", null],
      ["Achchiq teriyaki", "bowl", "Mol go‘shti, karam, guruch va achchiq teriyaki.", 64000, "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85", "FAQAT ONLINE"],
      ["Bog‘ salati", "salad", "Pomidor, bodring, rediska, ko‘kat va feta.", 42000, "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=900&q=85", null],
      ["Sezar yangi", "salad", "Tovuq, salat bargi, parmesan va yengil sous.", 55000, "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=85", null],
      ["Yashil fresh", "drink", "Olma, bodring, ismaloq va limon.", 25000, "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=900&q=85", null],
    ];
    await db.batch(data.map((x) => db.prepare("INSERT INTO products(name,category,description,price,image,badge,available) VALUES(?,?,?,?,?,?,1)").bind(...x)));
  }
  await db.prepare("INSERT OR IGNORE INTO promos(code,percent,active) VALUES('YASHIL10',10,1)").run();
  await db.prepare("INSERT OR IGNORE INTO zones(id,name,fee,eta,active) VALUES(1,'Markaz',12000,'25–35 daqiqa',1),(2,'Shahar cheti',20000,'40–55 daqiqa',1)").run();
  await db.prepare("INSERT OR IGNORE INTO settings(key,value) VALUES('store_name','YASHIL'),('phone','+998 90 123 45 67'),('payments','Naqd,Payme,Click'),('min_order','40000')").run();
}

async function authed(req: NextRequest) {
  if (process.env.NODE_ENV === "development") return true;
  return verifyAdminSession(sessionFromCookieHeader(req.headers.get("cookie")));
}

export async function GET(req: NextRequest) {
  await seed();
  if (req.nextUrl.searchParams.get("track") === "1") {
    const orderId = Number(req.nextUrl.searchParams.get("order"));
    const phone = (req.nextUrl.searchParams.get("phone") || "").replace(/\D/g, "");
    if (!orderId && !phone) return json({ error: "Buyurtma raqami yoki telefon raqamidan birini kiriting" }, 400);
    const fields = "id,customer_name,phone,items,subtotal,discount,delivery_fee,total,status,payment,payment_status,created_at";
    let orders: any[];
    if (orderId) {
      const order = await env.DB.prepare(`SELECT ${fields} FROM orders WHERE id=?`).bind(orderId).first();
      orders = order ? [order] : [];
    } else {
      orders = (await env.DB.prepare(`SELECT ${fields} FROM orders WHERE replace(replace(replace(replace(replace(phone,' ',''),'-',''),'(',''),')',''),'+','')=? ORDER BY id DESC`).bind(phone).all()).results as any[];
    }
    if (!orders.length) return json({ error: "Buyurtma topilmadi. Raqam yoki telefonni tekshiring" }, 404);
    const parsedOrders = orders.map((order: any) => ({ ...order, items: JSON.parse(order.items) }));
    return json({ order: parsedOrders[0], orders: parsedOrders });
  }
  const admin = req.nextUrl.searchParams.get("admin") === "1";
  if (admin && !(await authed(req))) return json({ error: "Kirish talab qilinadi" }, 401);
  const db = env.DB;
  const products = (await db.prepare(`SELECT * FROM products ${admin ? "" : "WHERE available=1"} ORDER BY id DESC`).all()).results;
  if (!admin) {
    const zones = (await db.prepare("SELECT * FROM zones WHERE active=1 ORDER BY fee").all()).results;
    const checkoutEnabled = await checkoutIsConfigured(db);
    return json({ products, zones, checkoutEnabled });
  }
  const [orders, customers, promos, zones, settings] = await Promise.all([
    db.prepare("SELECT * FROM orders ORDER BY id DESC").all(),
    db.prepare("SELECT * FROM customers ORDER BY total_spent DESC").all(),
    db.prepare("SELECT * FROM promos ORDER BY id DESC").all(),
    db.prepare("SELECT * FROM zones ORDER BY id").all(),
    db.prepare("SELECT * FROM settings").all(),
  ]);
  const stats = await db.prepare("SELECT COUNT(*) orders,COALESCE(SUM(total),0) revenue,COALESCE(AVG(total),0) avg_order,SUM(CASE WHEN status='new' THEN 1 ELSE 0 END) new_orders FROM orders").first();
  const publicSettings = Object.fromEntries(settings.results.filter((x: any) => x.key !== "checkout_api_key_encrypted").map((x: any) => [x.key, x.value]));
  return json({ products, orders: orders.results, customers: customers.results, promos: promos.results, zones: zones.results, settings: publicSettings, checkout_configured: settings.results.some((x: any) => x.key === "checkout_api_key_encrypted"), stats });
}

export async function POST(req: NextRequest) {
  await seed();
  const db = env.DB;
  const b: any = await req.json();
  if (b.action === "create-order") {
    if (!b.name || !b.email || !b.phone || !b.address || !Array.isArray(b.items) || !b.items.length) return json({ error: "Barcha maydonlarni to‘ldiring" }, 400);
    const paymentMethod = b.payment === "checkout" ? "checkout" : "cash_on_delivery";
    const checkoutApiKey = paymentMethod === "checkout" ? await getCheckoutApiKey(db) : null;
    if (paymentMethod === "checkout" && !checkoutApiKey) return json({ error: "CHECKOUT avto to‘lovi hali admin panelda sozlanmagan" }, 503);
    const ids = b.items.map((x: any) => Number(x.id)).filter(Boolean);
    const rows = (await db.prepare(`SELECT id,name,price FROM products WHERE available=1 AND id IN (${ids.map(() => "?").join(",")})`).bind(...ids).all()).results as any[];
    const subtotal = rows.reduce((sum, x) => sum + Number(x.price), 0);
    let discount = 0;
    if (b.promo) {
      const promo: any = await db.prepare("SELECT percent FROM promos WHERE code=? AND active=1").bind(String(b.promo).toUpperCase()).first();
      if (promo) discount = Math.round((subtotal * promo.percent) / 100);
    }
    const zone: any = await db.prepare("SELECT fee FROM zones WHERE id=? AND active=1").bind(Number(b.zoneId)).first();
    const fee = Number(zone?.fee || 0), total = subtotal - discount + fee;
    if (total < 1000 || total > 10000000) return json({ error: "To‘lov summasi 1 000 dan 10 000 000 so‘mgacha bo‘lishi kerak" }, 400);
    const initialPaymentStatus = paymentMethod === "checkout" ? "initiating" : "unpaid";
    const result = await db.prepare("INSERT INTO orders(customer_name,customer_email,phone,address,items,subtotal,discount,delivery_fee,total,status,payment,payment_status,created_at) VALUES(?,?,?,?,?,?,?,?,?,'new',?,?,datetime('now'))").bind(b.name,b.email,b.phone,b.address,JSON.stringify(rows),subtotal,discount,fee,total,paymentMethod,initialPaymentStatus).run();
    const orderId = Number(result.meta.last_row_id);
    let paymentUrl: string | undefined;

    if (paymentMethod === "checkout" && checkoutApiKey) {
      const webhookSecret = checkoutWebhookSecret();
      if (!webhookSecret) {
        await db.prepare("DELETE FROM orders WHERE id=?").bind(orderId).run();
        return json({ error: "Webhook xavfsizlik sozlamasi mavjud emas" }, 503);
      }
      try {
        const origin = req.nextUrl.origin;
        const created: any = await checkoutRequest(checkoutApiKey, "create_payment", {
          amount: total,
          description: `YASHIL buyurtma #${orderId}`,
          webhook_url: `${origin}/api/checkout/webhook?token=${encodeURIComponent(webhookSecret)}`,
          return_url: `${origin}/track?payment=returned`,
        });
        const providerPayment = created?.payment;
        if (!providerPayment?._id || !providerPayment?._uuid || !providerPayment?._url || Number(providerPayment._amount) !== total) throw new Error("CHECKOUT.UZ noto‘g‘ri invoice qaytardi");
        await db.prepare("UPDATE orders SET payment_status='pending',checkout_payment_id=?,checkout_payment_uuid=? WHERE id=?").bind(Number(providerPayment._id),String(providerPayment._uuid),orderId).run();
        paymentUrl = String(providerPayment._url);
      } catch (error) {
        await db.prepare("DELETE FROM orders WHERE id=?").bind(orderId).run();
        return json({ error: safeCheckoutError(error) }, 502);
      }
    }
    await db.prepare("INSERT INTO customers(name,email,phone,order_count,total_spent) VALUES(?,?,?,1,?) ON CONFLICT(email) DO UPDATE SET name=excluded.name,phone=excluded.phone,order_count=order_count+1,total_spent=total_spent+excluded.total_spent").bind(b.name,b.email,b.phone,total).run();
    return json({ ok: true, id: orderId, total, discount, paymentUrl });
  }
  if (!(await authed(req))) return json({ error: "Ruxsat yo‘q" }, 403);
  const q = (sql: string, ...args: any[]) => db.prepare(sql).bind(...args).run();
  switch (b.action) {
    case "save-product":
      if (b.id) await q("UPDATE products SET name=?,category=?,description=?,price=?,image=?,badge=?,available=? WHERE id=?",b.name,b.category,b.description,Number(b.price),b.image,b.badge||null,b.available?1:0,Number(b.id));
      else await q("INSERT INTO products(name,category,description,price,image,badge,available) VALUES(?,?,?,?,?,?,?)",b.name,b.category,b.description,Number(b.price),b.image,b.badge||null,b.available?1:0); break;
    case "delete-product": await q("DELETE FROM products WHERE id=?",Number(b.id)); break;
    case "order-status": await q("UPDATE orders SET status=? WHERE id=?",b.status,Number(b.id)); break;
    case "save-promo":
      if (b.id) await q("UPDATE promos SET code=?,percent=?,active=? WHERE id=?",String(b.code).toUpperCase(),Number(b.percent),b.active?1:0,Number(b.id));
      else await q("INSERT INTO promos(code,percent,active) VALUES(?,?,?)",String(b.code).toUpperCase(),Number(b.percent),b.active?1:0); break;
    case "delete-promo": await q("DELETE FROM promos WHERE id=?",Number(b.id)); break;
    case "save-zone":
      if (b.id) await q("UPDATE zones SET name=?,fee=?,eta=?,active=? WHERE id=?",b.name,Number(b.fee),b.eta,b.active?1:0,Number(b.id));
      else await q("INSERT INTO zones(name,fee,eta,active) VALUES(?,?,?,?)",b.name,Number(b.fee),b.eta,b.active?1:0); break;
    case "delete-zone": await q("DELETE FROM zones WHERE id=?",Number(b.id)); break;
    case "save-checkout-api": {
      const apiKey = String(b.apiKey || "").trim();
      if (apiKey.length < 12) return json({ error: "CHECKOUT.UZ API kalitini to‘liq kiriting" }, 400);
      try {
        const methods: any = await checkoutRequest(apiKey, "get_payment_methods");
        await saveCheckoutApiKey(db, apiKey);
        return json({ ok: true, methods: Array.isArray(methods?.data) ? methods.data.map((method: any) => ({ key: method.key, name: method.name })) : [] });
      } catch (error) {
        return json({ error: safeCheckoutError(error) }, 400);
      }
    }
    case "remove-checkout-api": await removeCheckoutApiKey(db); break;
    case "save-settings": {
      const allowed = new Set(["store_name", "phone", "min_order"]);
      for (const [k,v] of Object.entries(b.settings||{})) if (allowed.has(k)) await q("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",k,String(v));
      break;
    }
    default: return json({ error: "Noma’lum amal" }, 400);
  }
  return json({ ok: true });
}
