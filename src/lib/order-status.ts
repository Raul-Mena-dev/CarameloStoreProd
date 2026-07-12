import type { OrderStatus } from "@/types/database";

export const ORDER_STATUS: Record<OrderStatus, { label: string; badge: string }> = {
  new: { label: "Nuevo", badge: "bg-blue-100 text-blue-800" },
  contacted: { label: "Contactado", badge: "bg-violet-100 text-violet-800" },
  confirmed: { label: "Confirmado", badge: "bg-cyan-100 text-cyan-800" },
  preparing: { label: "Preparando", badge: "bg-amber-100 text-amber-900" },
  ready: { label: "Listo para entregar", badge: "bg-orange-100 text-orange-900" },
  completed: { label: "Completado", badge: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelado", badge: "bg-red-100 text-red-800" },
};

export const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS) as [
  OrderStatus,
  { label: string; badge: string },
][];

export function getOrderStatus(status: string | null | undefined) {
  return ORDER_STATUS[status as OrderStatus] ?? {
    label: status ? `Estado: ${status}` : "Sin estado",
    badge: "bg-stone-100 text-stone-800",
  };
}
