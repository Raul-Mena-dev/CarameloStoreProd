-- Conserva pedidos históricos, pero exige entrega local y dirección en pedidos nuevos.
create or replace function public.enforce_local_delivery()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.delivery_method <> 'local_delivery' then
    raise exception 'only local delivery is available';
  end if;
  if nullif(btrim(new.customer_address), '') is null then
    raise exception 'delivery address is required';
  end if;
  return new;
end;
$$;

drop trigger if exists orders_local_delivery_only on public.orders;
create trigger orders_local_delivery_only
before insert on public.orders
for each row execute function public.enforce_local_delivery();
