# Base de datos

La migración inicial incluye `categories`, `products`, `product_images`, `banners`, `orders`, `order_items` y `profiles`. Todas tienen RLS. El público solo lee contenido activo; los pedidos no admiten inserción con la clave anónima.

`create_store_order(jsonb)` está revocada para `anon` y `authenticated` y se llama desde el Route Handler con `service_role`. Bloquea los productos con `FOR UPDATE`, recalcula ofertas, comprueba stock, crea las partidas históricas y descuenta inventario dentro de la misma transacción. `idempotency_key` es único y hace seguro el reintento.

Los buckets públicos aceptan únicamente JPG, PNG y WebP hasta 3 MB. Solo administradores pueden escribir o borrar objetos.
