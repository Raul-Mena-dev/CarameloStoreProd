# Guía administrativa

El panel en `/admin` requiere sesión y perfil con rol `admin`. El resumen muestra métricas y pedidos recientes. Productos permite alta, edición, inventario, oferta, estado y destacado. Categorías y banners permiten alta, edición, orden y vigencia. Pedidos muestra cliente, partidas y permite cambiar el estado.

Las imágenes pueden subirse mediante `POST /api/upload` usando `multipart/form-data` con campos `file` y `bucket`; el endpoint valida rol, formato y tamaño. La URL devuelta se guarda en el formulario correspondiente.
