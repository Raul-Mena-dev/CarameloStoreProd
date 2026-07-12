# Despliegue

1. Crea el proyecto Supabase en una región cercana a México.
2. Aplica la migración y el seed desde SQL Editor o Supabase CLI.
3. Verifica las URLs permitidas de Auth para el dominio de producción.
4. Crea un dominio remitente verificado en Resend.
5. Configura en Vercel todas las variables de `.env.example`.
6. Ejecuta el build y asigna el dominio; actualiza `NEXT_PUBLIC_SITE_URL`.

Después del despliegue prueba login, subida menor a 3 MB, pedido, correo y enlace de WhatsApp. Conserva `SUPABASE_SERVICE_ROLE_KEY` solo en el entorno del servidor.
