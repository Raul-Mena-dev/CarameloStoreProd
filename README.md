# Dulcería Caramelo

Tienda web responsive para catálogo, carrito persistente, pedidos por WhatsApp y administración. Usa Next.js App Router, TypeScript, Tailwind, Supabase, Zustand, Zod, React Hook Form y Resend.

## Requisitos e instalación

- Node.js 20 LTS o superior (Next.js requiere al menos 18.18; se recomienda 20).
- Un proyecto Supabase y, opcionalmente para correo, una cuenta Resend.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Completa `.env.local` sin publicar las claves. Ejecuta `supabase/migrations/202607110001_initial.sql` en Supabase SQL Editor y después `supabase/seed.sql`. La migración crea tablas, transacción de pedidos, RLS, roles, buckets y políticas de Storage.

## Primer administrador

1. Crea el usuario en Supabase Authentication.
2. Obtén su UUID y ejecuta con una cuenta de base de datos privilegiada:

```sql
insert into public.profiles(id, role) values ('UUID_DEL_USUARIO', 'admin');
```

Entra en `/admin/login`. Nunca uses la `service_role` en variables `NEXT_PUBLIC_*`.

## Calidad

```bash
npm run typecheck
npm test
npm run build
npm run test:e2e
```

El E2E requiere la base configurada para probar un pedido completo. Sin credenciales, la portada y catálogo muestran estados vacíos deliberados.

## Despliegue

Importa el repositorio en Vercel, configura todas las variables de `.env.example`, apunta `NEXT_PUBLIC_SITE_URL` al dominio definitivo y despliega. Consulta [docs/deployment.md](docs/deployment.md).
