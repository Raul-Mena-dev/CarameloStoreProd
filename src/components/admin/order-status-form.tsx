"use client";

import { CheckCircle2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/actions";
import type { OrderStatus } from "@/types/database";
import { ORDER_STATUS_OPTIONS } from "@/lib/order-status";

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const router = useRouter();
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);
  const [saved, setSaved] = useState<OrderStatus>(currentStatus);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => setSaved(currentStatus), [currentStatus]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, selected);
      setMessage(result.message);
      if (result.ok) {
        setSaved(selected);
        router.refresh();
      }
    });
  }

  return <form onSubmit={submit} className="rounded-2xl border border-[#eadfcd] bg-cream p-4">
    <label className="label" htmlFor={`status-${orderId}`}>Cambiar estado</label>
    <div className="flex flex-col gap-3 sm:flex-row">
      <select id={`status-${orderId}`} className="field flex-1" value={selected} onChange={(event) => { setSelected(event.target.value as OrderStatus); setMessage(""); }}>
        {ORDER_STATUS_OPTIONS.map(([value, status]) => <option key={value} value={value}>{status.label}</option>)}
      </select>
      <button className="btn-primary min-w-36" disabled={isPending || selected === saved}>
        {isPending ? <><LoaderCircle className="mr-2 animate-spin" size={17}/>Guardando…</> : "Guardar cambio"}
      </button>
    </div>
    {message && <p role="status" className={`mt-3 flex items-center gap-2 text-sm font-bold ${saved === selected ? "text-emerald-700" : "text-red-700"}`}>
      {saved === selected && <CheckCircle2 size={17}/>} {message}
    </p>}
  </form>;
}
