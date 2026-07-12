import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import "./globals.css";
import { CartCount } from "@/components/cart-count";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Dulcería Caramelo", template: "%s | Dulcería Caramelo" },
  description: "Dulces, chocolates, gomitas y antojos para compartir.",
  openGraph: { type: "website", locale: "es_MX", siteName: "Dulcería Caramelo" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>
    <header className="sticky top-0 z-40 border-b border-[#eadfcd] bg-cream/95 backdrop-blur">
      <div className="container flex h-20 items-center justify-between gap-5">
        <Link href="/" className="focus-ring rounded-xl text-2xl font-black tracking-tight"><span className="text-cherry">Caramelo</span><span className="text-gold">.</span></Link>
        <nav aria-label="Navegación principal" className="hidden gap-6 font-bold md:flex"><Link href="/productos">Productos</Link><Link href="/ofertas">Ofertas</Link><Link href="/#categorias">Categorías</Link></nav>
        <Link className="focus-ring relative rounded-full bg-ink p-3 text-white" href="/carrito" aria-label="Abrir carrito"><ShoppingBag size={21}/><CartCount/></Link>
      </div>
    </header>
    {children}
    <footer className="mt-20 bg-ink py-12 text-cream"><div className="container grid gap-8 md:grid-cols-3">
      <div><p className="text-2xl font-black">Caramelo.</p><p className="mt-2 text-cream/70">Alegría en cada mordida.</p></div>
      <div><p className="font-bold">Entrega local</p><p className="mt-2 text-cream/70">Confirma cobertura y costo de entrega por WhatsApp.</p></div>
      <div><p className="font-bold">Contacto</p><p className="mt-2 text-cream/70">Confirma tu pedido directamente por WhatsApp.</p></div>
    </div></footer>
  </body></html>;
}
