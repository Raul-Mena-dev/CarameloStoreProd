"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { checkoutBaseSchema, type CheckoutInput } from "@/lib/validations";
import { useCart } from "@/stores/cart-store";

type FormValues = Omit<CheckoutInput, "items" | "idempotencyKey">;
const formSchema = checkoutBaseSchema.omit({ items: true, idempotencyKey: true });

export default function Checkout() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const clear = useCart((state) => state.clear);
  const [serverError, setServerError] = useState("");
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: { deliveryMethod: "local_delivery", consent: false },
    });

  async function submit(values: FormValues) {
    setServerError("");
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify({
        ...values,
        idempotencyKey,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      }),
    });
    const data = await response.json() as { orderNumber?: string; error?: string };
    if (!response.ok || !data.orderNumber) {
      setServerError(data.error ?? "No pudimos guardar el pedido");
      return;
    }
    clear();
    router.push(`/pedido/confirmacion/${data.orderNumber}`);
  }

  return (
    <main className="container max-w-3xl py-12">
      <p className="font-black uppercase tracking-widest text-cherry">Último paso</p>
      <h1 className="text-5xl font-black">Tus datos de entrega</h1>
      <form onSubmit={handleSubmit(submit)} className="card mt-8 grid gap-5 p-6 md:grid-cols-2" noValidate>
        <input type="hidden" value="local_delivery" {...register("deliveryMethod")} />
        <Field label="Nombre completo" error={errors.customerName?.message}>
          <input className="field" {...register("customerName")} />
        </Field>
        <Field label="Teléfono" error={errors.customerPhone?.message}>
          <input className="field" type="tel" {...register("customerPhone")} />
        </Field>
        <Field label="Correo (opcional)" error={errors.customerEmail?.message}>
          <input className="field" type="email" {...register("customerEmail")} />
        </Field>
        <div>
          <span className="label">Método de entrega</span>
          <p className="field bg-cream font-bold">Entrega local</p>
        </div>
        <div className="md:col-span-2">
          <Field label="Dirección completa" error={errors.customerAddress?.message}>
            <textarea className="field" rows={3} placeholder="Calle, número, colonia, código postal y referencias" {...register("customerAddress")} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Notas (opcional)" error={errors.notes?.message}>
            <textarea className="field" rows={3} {...register("notes")} />
          </Field>
        </div>
        <label className="flex gap-3 md:col-span-2">
          <input type="checkbox" {...register("consent")} />
          <span>Acepto que la dulcería me contacte para confirmar cobertura, existencia, costo de entrega y total.</span>
        </label>
        {errors.consent && <p className="text-sm font-bold text-cherry md:col-span-2">{errors.consent.message}</p>}
        {serverError && <p role="alert" className="rounded-xl bg-red-50 p-4 font-bold text-red-700 md:col-span-2">{serverError}</p>}
        <button disabled={isSubmitting || !items.length} className="btn-primary md:col-span-2">
          {isSubmitting ? "Guardando pedido…" : "Confirmar pedido"}
        </button>
        {!items.length && <p className="text-center text-sm text-cherry md:col-span-2">Agrega al menos un producto al carrito.</p>}
      </form>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label><span className="label">{label}</span>{children}{error && <span className="mt-1 block text-sm font-bold text-cherry">{error}</span>}</label>;
}
