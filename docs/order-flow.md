# Flujo de pedido

El carrito vive en `localStorage` y sus importes son solo informativos. En checkout el navegador envía exclusivamente identificadores, cantidades y datos del cliente junto con una UUID de idempotencia.

El servidor valida con Zod e invoca la transacción PostgreSQL. PostgreSQL vuelve a leer precios y vigencias, bloquea stock y guarda `orders`/`order_items`. Tras confirmar el commit se intenta enviar correo; un fallo de Resend se registra pero no elimina el pedido. La confirmación compone el mensaje de WhatsApp con los valores ya guardados y entonces el cliente vacía el carrito.
