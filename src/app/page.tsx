import Link from "next/link";
import { MapPin, Truck } from "lucide-react";
import { getBanners, getCategories, getProducts } from "@/lib/data";
import { ProductGrid } from "@/components/product-grid";
import { BannerCarousel } from "@/components/store/banner-carousel";

export default async function Home() {
  const [banners, categories, featured, offers] = await Promise.all([
    getBanners(), getCategories(), getProducts({ featured: true, limit: 4 }), getProducts({ offers: true, limit: 4 }),
  ]);
  return <main>
    <div className="container py-8"><BannerCarousel banners={banners}/></div>
    <section className="container py-14"><div className="mb-7 flex items-end justify-between"><div><p className="font-black uppercase tracking-widest text-cherry">Los más queridos</p><h2 className="text-3xl font-black md:text-4xl">Favoritos de la casa</h2></div><Link href="/productos" className="hidden font-bold underline md:block">Ver catálogo</Link></div><ProductGrid products={featured}/></section>
    <section id="categorias" className="bg-mint/50 py-16"><div className="container"><h2 className="text-3xl font-black">Elige tu antojo</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map((category)=><Link key={category.id} href={`/categorias/${category.slug}`} className="card flex min-h-40 items-end p-6 text-2xl font-black transition hover:-translate-y-1"><span className="mr-3 text-4xl" aria-hidden>{category.icon || "🍬"}</span>{category.name}</Link>)}</div></div></section>
    <section className="container py-16"><div className="mb-7"><p className="font-black uppercase tracking-widest text-cherry">Por tiempo limitado</p><h2 className="text-3xl font-black md:text-4xl">Ofertas sabrosas</h2></div><ProductGrid products={offers}/></section>
    <section className="container grid gap-5 md:grid-cols-2">
      <div className="card flex items-center gap-5 p-7"><Truck className="text-cherry" size={42}/><div><h2 className="text-xl font-black">Entrega local</h2><p className="text-stone-600">Llevamos tus dulces hasta tu domicilio.</p></div></div>
      <div className="card flex items-center gap-5 p-7"><MapPin className="text-cherry" size={42}/><div><h2 className="text-xl font-black">Cobertura por confirmar</h2><p className="text-stone-600">Confirmamos zona y costo de envío por WhatsApp.</p></div></div>
    </section>
  </main>;
}
