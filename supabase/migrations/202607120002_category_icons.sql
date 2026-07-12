alter table public.categories
add column if not exists icon varchar(16) not null default '🍬';

update public.categories set icon='🍫' where slug='chocolates';
update public.categories set icon='🍬' where slug='gomitas';
update public.categories set icon='🍭' where slug='paletas';
update public.categories set icon='🪅' where slug='dulces-mexicanos';
