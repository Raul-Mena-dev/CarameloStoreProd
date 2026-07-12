import { saveCategory } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

const ICONS = ["🍬", "🍫", "🍭", "🍪", "🍩", "🧁", "🍰", "🎂", "🍿", "🥜", "🌶️", "🍓", "🪅", "🎁", "⭐", "❤️"];

export default async function Categories() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order");

  return <>
    <h2 className="mb-2 text-3xl font-black">Categorías</h2>
    <p className="mb-6 text-stone-600">Elige el icono que aparecerá junto al nombre en la portada.</p>
    <div className="grid gap-5 lg:grid-cols-2">
      {[undefined, ...(data ?? [])].map((category, index) =>
        <form action={saveCategory} className="card grid gap-3 p-5" key={category?.id ?? "new"}>
          <input type="hidden" name="id" value={category?.id}/>
          <h3 className="font-black">{category ? "Editar categoría" : "Nueva categoría"}</h3>
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <label><span className="label">Icono</span><select className="field text-2xl" name="icon" defaultValue={category?.icon ?? "🍬"} aria-label="Icono de categoría">{ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}</select></label>
            <label><span className="label">Nombre</span><input required className="field" name="name" placeholder="Nombre" defaultValue={category?.name}/></label>
          </div>
          <input className="field" name="slug" placeholder="Slug automático" defaultValue={category?.slug}/>
          <textarea className="field" name="description" placeholder="Descripción" defaultValue={category?.description ?? ""}/>
          <input className="field" name="image_url" placeholder="URL de imagen" defaultValue={category?.image_url ?? ""}/>
          <input className="field" name="sort_order" type="number" placeholder="Orden" defaultValue={category?.sort_order ?? index}/>
          <label><input name="is_active" type="checkbox" defaultChecked={category?.is_active ?? true}/> Activa</label>
          <button className="btn-primary">Guardar</button>
        </form>
      )}
    </div>
  </>;
}
