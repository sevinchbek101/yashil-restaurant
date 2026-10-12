"use client";

import {useCallback,useEffect,useState} from "react";
import {Lang,useLanguage} from "../language";
import {CheckCircleIcon,ChefHatIcon,DeliveryIcon,RefreshIcon} from "../icons";
import SiteHeader from "../site-header";

const copy={
 uz:{eye:"BUYURTMA HOLATI",title:<>Taomingiz<br/>qayerda?</>,intro:"Buyurtma raqami yoki telefon raqamidan bittasini kiriting. Telefon orqali shu raqamdagi barcha buyurtmalar chiqadi.",number:"Buyurtma raqami",numberHint:"Bitta buyurtmani topadi",example:"Masalan: 24",phone:"Telefon raqami",phoneHint:"Barcha buyurtmalarni topadi",check:"HOLATNI KO‘RISH",checking:"TEKSHIRILMOQDA...",required:"Buyurtma raqami yoki telefon raqamidan bittasini kiriting",notFound:"Buyurtma topilmadi",found:"ta buyurtma topildi",order:"BUYURTMA",updated:"Yangilandi",cancelled:"Buyurtma bekor qilindi",cancelText:"Qo‘shimcha ma’lumot uchun restoran bilan bog‘laning.",items:"Buyurtma tarkibi",subtotal:"Taomlar",delivery:"Yetkazib berish",discount:"Chegirma",total:"Jami",auto:"Holat har 10 soniyada avtomatik yangilanadi",paymentPaid:"To‘lov tasdiqlandi",paymentPending:"To‘lov kutilmoqda",paymentCash:"Olganda to‘lanadi",steps:[["Qabul qilindi","Buyurtmangiz tizimga qabul qilindi."],["Tayyorlanmoqda","Oshpazlar taomingizni tayyorlamoqda."],["Yetkazilmoqda","Kuryer buyurtmangiz bilan yo‘lda."],["Yetkazildi","Buyurtma muvaffaqiyatli yetkazildi."]]},
 ru:{eye:"СТАТУС ЗАКАЗА",title:<>Где ваш<br/>заказ?</>,intro:"Введите номер заказа или телефон. По номеру телефона будут показаны все ваши заказы.",number:"Номер заказа",numberHint:"Найдёт один заказ",example:"Например: 24",phone:"Номер телефона",phoneHint:"Найдёт все заказы",check:"ПОКАЗАТЬ СТАТУС",checking:"ПРОВЕРКА...",required:"Введите номер заказа или номер телефона",notFound:"Заказ не найден",found:"заказов найдено",order:"ЗАКАЗ",updated:"Обновлено",cancelled:"Заказ отменён",cancelText:"Свяжитесь с рестораном для дополнительной информации.",items:"Состав заказа",subtotal:"Блюда",delivery:"Доставка",discount:"Скидка",total:"Итого",auto:"Статус обновляется автоматически каждые 10 секунд",paymentPaid:"Оплата подтверждена",paymentPending:"Ожидается оплата",paymentCash:"Оплата при получении",steps:[["Принят","Ваш заказ принят системой."],["Готовится","Повара готовят ваш заказ."],["В пути","Курьер уже едет к вам."],["Доставлен","Заказ успешно доставлен."]]},
 en:{eye:"ORDER STATUS",title:<>Where is your<br/>order?</>,intro:"Enter either an order number or a phone number. A phone search shows every order for that number.",number:"Order number",numberHint:"Finds one order",example:"Example: 24",phone:"Phone number",phoneHint:"Finds all orders",check:"VIEW STATUS",checking:"CHECKING...",required:"Enter an order number or phone number",notFound:"Order not found",found:"orders found",order:"ORDER",updated:"Updated",cancelled:"Order cancelled",cancelText:"Contact the restaurant for more information.",items:"Order items",subtotal:"Items",delivery:"Delivery",discount:"Discount",total:"Total",auto:"Status refreshes automatically every 10 seconds",paymentPaid:"Payment confirmed",paymentPending:"Awaiting payment",paymentCash:"Pay on delivery",steps:[["Received","Your order has been received."],["Preparing","The kitchen is preparing your food."],["On the way","The courier is on the way."],["Delivered","Your order was delivered successfully."]]}
};
const keys=["new","preparing","delivery","done"],stepIcons=[CheckCircleIcon,ChefHatIcon,DeliveryIcon,CheckCircleIcon];
const money=(n:number,lang:Lang)=>Number(n).toLocaleString(lang==="uz"?"uz-UZ":lang==="ru"?"ru-RU":"en-US")+" so‘m";

export default function Tracker(){
 const {lang,setLang}=useLanguage(),t=copy[lang];
 const [id,setId]=useState(""),[phone,setPhone]=useState(""),[orders,setOrders]=useState<any[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(false),[updated,setUpdated]=useState<Date|null>(null),[autoLookup,setAutoLookup]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("yashil:lastOrder")||"null");if(saved){setId(String(saved.id));setPhone(saved.phone);setAutoLookup(new URLSearchParams(location.search).get("payment")==="returned")}}catch{}},[]);
 const search=useCallback(async(silent=false)=>{
  if(!id&&!phone){if(!silent)setError(copy[lang].required);return}
  if(!silent)setLoading(true);
  const params=new URLSearchParams({track:"1"});
  if(id)params.set("order",id);
  if(phone)params.set("phone",phone);
  const response=await fetch(`/api/data?${params}`,{cache:"no-store"});
  const data=await response.json();
  setLoading(false);
  if(response.ok){setOrders(data.orders||[data.order]);setError("");setUpdated(new Date())}
  else if(!silent){setOrders([]);setError(data.error||copy[lang].notFound)}
 },[id,phone,lang]);
 useEffect(()=>{if(autoLookup&&id){setAutoLookup(false);search()}},[autoLookup,id,search]);
 useEffect(()=>{if(!orders.some(order=>order.status!=="done"&&order.status!=="cancelled"))return;const timer=setInterval(()=>search(true),10000);return()=>clearInterval(timer)},[orders,search]);
 const locale=lang==="uz"?"uz-UZ":lang==="ru"?"ru-RU":"en-US";
 return <main className="trackPage">
  <SiteHeader lang={lang} setLang={setLang} active="track"/>
  <section className="trackHero shell"><span className="eyebrow">{t.eye}</span><h1>{t.title}</h1><p>{t.intro}</p></section>
  <section className="trackBody shell">
   <form className="trackForm" onSubmit={event=>{event.preventDefault();search()}}>
    <label>{t.number}<small>{t.numberHint}</small><div className="orderInput"><span>#</span><input value={id} onChange={event=>setId(event.target.value.replace(/\D/g,""))} inputMode="numeric" placeholder={t.example}/></div></label>
    <label>{t.phone}<small>{t.phoneHint}</small><input value={phone} onChange={event=>setPhone(event.target.value)} placeholder="+998 90 123 45 67"/></label>
    <button className="pill submitBtn" disabled={loading}>{loading&&<RefreshIcon className="spinIcon" size={19}/>}<span>{loading?t.checking:t.check}</span></button>
   </form>
   {error&&<div className="trackError">{error}</div>}
   {orders.length>1&&<p className="trackingFound"><b>{orders.length}</b> {t.found}</p>}
   <div className="trackingResults">{orders.map(order=>{
    const current=keys.indexOf(order.status);
    const paymentText=order.payment_status==="paid"?t.paymentPaid:order.payment==="checkout"?t.paymentPending:t.paymentCash;
    const validDate=order.created_at!=="CURRENT_TIMESTAMP"&&!Number.isNaN(new Date(order.created_at).getTime());
    return <div className="trackingCard" key={order.id}>
     <div className="trackingTop"><div><span>{t.order} #{order.id}</span><h2>{order.customer_name}</h2>{validDate&&<small>{new Date(order.created_at).toLocaleString(locale)}</small>}</div><div><b>{money(order.total,lang)}</b><em className={`paymentBadge ${order.payment_status==="paid"?"paid":"unpaid"}`}>{paymentText}</em>{updated&&<small>{t.updated}: {updated.toLocaleTimeString(locale,{hour:"2-digit",minute:"2-digit"})}</small>}</div></div>
     {order.status==="cancelled"?<div className="cancelled"><b>{t.cancelled}</b><p>{t.cancelText}</p></div>:<div className="timeline">{keys.map((key,index)=>{const StepIcon=stepIcons[index];return <div className={`${index<current?"complete ":""}${index===current?"current":""}`} key={key}><i><StepIcon size={19}/></i><span><b>{t.steps[index][0]}</b><small>{t.steps[index][1]}</small></span></div>})}</div>}
     <div className="trackingItems"><h3>{t.items}</h3>{order.items.map((item:any)=><div key={item.id}><span>{item.name}</span><b>{money(item.price,lang)}</b></div>)}<div className="trackingSum"><span>{t.subtotal}</span><b>{money(order.subtotal??order.items.reduce((sum:number,item:any)=>sum+Number(item.price),0),lang)}</b></div>{Number(order.discount)>0&&<div className="trackingSum discount"><span>{t.discount}</span><b>−{money(order.discount,lang)}</b></div>}<div className="trackingSum"><span>{t.delivery}</span><b>{money(order.delivery_fee||0,lang)}</b></div><div className="trackingSum total"><span>{t.total}</span><b>{money(order.total,lang)}</b></div></div>
     {order.status!=="done"&&order.status!=="cancelled"&&<p className="autoNote"><RefreshIcon size={15}/> {t.auto}</p>}
    </div>
   })}</div>
  </section>
 </main>;
}
