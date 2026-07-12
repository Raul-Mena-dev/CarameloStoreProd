import Link from "next/link";
import { CalendarDays, MapPin, Package, Phone } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { formatCurrency } from "@/lib/domain";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import type { OrderStatus } from "@/types/database";
import { cn } from "@/lib/utils";
import { getOrderStatus } from "@/lib/order-status";

type OrderItem = { id:string; quantity:number; product_name:string; unit_price:number; subtotal:number };
type Order = { id:string; order_number:string; customer_name:string; customer_phone:string; customer_email:string|null; customer_address:string|null; notes:string|null; total:number; status:OrderStatus; created_at:string; order_items:OrderItem[] };

const FILTERS: { value: "all" | "active" | OrderStatus; label: string }[] = [
  { value:"active", label:"Por atender" }, { value:"new", label:"Nuevos" },
  { value:"confirmed", label:"Confirmados" }, { value:"preparing", label:"Preparando" },
  { value:"ready", label:"Listos" }, { value:"completed", label:"Completados" },
  { value:"cancelled", label:"Cancelados" }, { value:"all", label:"Todos" },
];
const ACTIVE: OrderStatus[] = ["new","contacted","confirmed","preparing","ready"];

export default async function OrdersPage({ searchParams }: { searchParams:Promise<{ estado?:string }> }) {
  const { estado = "active" } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("orders").select("*,order_items(*)").order("created_at",{ascending:false}).limit(100);
  const orders = (data ?? []) as Order[];
  const visible = estado === "all" ? orders : estado === "active" ? orders.filter(order => ACTIVE.includes(order.status)) : orders.filter(order => order.status === estado);
  const count = (filter:string) => filter === "all" ? orders.length : filter === "active" ? orders.filter(order => ACTIVE.includes(order.status)).length : orders.filter(order => order.status === filter).length;

  return <>
    <div className="mb-6"><p className="font-black uppercase tracking-widest text-cherry">Operación diaria</p><h2 className="text-3xl font-black">Pedidos</h2><p className="mt-2 text-stone-600">Revisa los pedidos pendientes y registra cada avance para mantener al equipo coordinado.</p></div>
    <nav aria-label="Filtrar pedidos por estado" className="mb-7 flex gap-2 overflow-x-auto pb-2">
      {FILTERS.map(filter => <Link key={filter.value} href={`/admin/pedidos?estado=${filter.value}`} className={cn("focus-ring whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition", estado === filter.value ? "border-ink bg-ink text-white" : "border-[#dccfbd] bg-white hover:bg-gold")}>
        {filter.label} <span className={cn("ml-1 rounded-full px-2 py-0.5 text-xs", estado === filter.value ? "bg-white/20" : "bg-cream")}>{count(filter.value)}</span>
      </Link>)}
    </nav>

    {!visible.length ? <div className="card p-12 text-center"><Package className="mx-auto text-cherry" size={46}/><h3 className="mt-4 text-xl font-black">No hay pedidos en esta sección</h3><p className="mt-2 text-stone-600">Cuando haya pedidos con este estado aparecerán aquí.</p></div> :
      <div className="space-y-5">{visible.map(order => {
        const status = getOrderStatus(order.status);
        const date = new Intl.DateTimeFormat("es-MX",{dateStyle:"medium",timeStyle:"short",timeZone:"America/Mexico_City"}).format(new Date(order.created_at));
        return <article className="card overflow-hidden" key={order.id}>
          <div className="flex flex-col gap-4 border-b border-[#eadfcd] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="flex flex-wrap items-center gap-3"><h3 className="text-xl font-black">{order.order_number}</h3><span className={cn("badge",status.badge)}>{status.label}</span></div><p className="mt-1 flex items-center gap-2 text-sm text-stone-500"><CalendarDays size={15}/>{date}</p></div>
            <strong className="text-2xl">{formatCurrency(Number(order.total))}</strong>
          </div>
          <div className="grid gap-6 p-5 lg:grid-cols-[1fr_1fr_380px]">
            <section><h4 className="mb-3 font-black">Cliente y entrega</h4><p className="text-lg font-bold">{order.customer_name}</p><a className="mt-2 flex items-center gap-2 text-cherry underline" href={`tel:${order.customer_phone}`}><Phone size={16}/>{order.customer_phone}</a><p className="mt-2 flex items-start gap-2 text-stone-700"><MapPin className="mt-1 shrink-0" size={16}/>{order.customer_address ?? "Dirección no registrada"}</p>{order.customer_email && <p className="mt-2 text-sm text-stone-600">{order.customer_email}</p>}{order.notes && <div className="mt-3 rounded-xl bg-gold/20 p-3 text-sm"><b>Notas:</b> {order.notes}</div>}</section>
            <section><h4 className="mb-3 font-black">Productos</h4><ul className="divide-y">{order.order_items.map(item => <li className="flex justify-between gap-3 py-2 first:pt-0" key={item.id}><span><b>{item.quantity} ×</b> {item.product_name}</span><span className="whitespace-nowrap">{formatCurrency(Number(item.subtotal))}</span></li>)}</ul></section>
            <OrderStatusForm orderId={order.id} currentStatus={order.status}/>
          </div>
        </article>;
      })}</div>}
  </>;
}
