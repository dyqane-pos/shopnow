-- Fshi produktet ekzistuese (nëse ka) dhe shto të rejat
truncate table public.product_views;
truncate table public.wishlist;
truncate table public.orders;
truncate table public.products restart identity cascade;

insert into public.products (name, brand, category, price, old_price, description, sizes, is_sale, stars, reviews, views)
values
  ('Zip-Up Hoodie', 'CAMP DAVID', 'clothing', 145.90, 179.90, 'Hoodie premium me zinxhir të plotë, material i butë dhe i ngrohtë.', '{"S","M","L","XL","XXL"}', true, 4.5, 128, 342),
  ('Regular fit Button Up Shirt', 'ONLY & SONS', 'clothing', 54.90, null, 'Këmishë elegante me prerje normale. Ideale për çdo rast.', '{"XS","S","M","L","XL"}', false, 4.2, 86, 156),
  ('Comfort fit Plaid Shirt', 'SELECTED', 'clothing', 99.90, null, 'Këmishë me model karoqe klasik. Stil timeless.', '{"S","M","L","XL"}', false, 4.7, 204, 289),
  ('Running Sneakers Pro', 'ADIDAS', 'shoes', 89.90, 119.90, 'Këpucë atletike me sole EVA për amortizim maksimal.', '{"40","41","42","43","44","45"}', true, 4.8, 512, 891),
  ('Classic Leather Loafers', 'BOSS', 'shoes', 189.00, null, 'Mokasina lëkure autentike, elegancë supreme.', '{"40","41","42","43","44"}', false, 4.6, 93, 178),
  ('Sport Backpack 30L', 'THE NORTH FACE', 'accessories', 79.90, null, 'Çantë shpine ujërezistues, kapacitet 30L.', '{"ONE SIZE"}', false, 4.4, 167, 234),
  ('Aviator Sunglasses', 'RAY-BAN', 'accessories', 129.90, 159.90, 'Syze dielli ikonike me lente polarizuese UV400.', '{"ONE SIZE"}', true, 4.9, 341, 567),
  ('Dri-FIT Training Shorts', 'NIKE', 'sports', 39.90, null, 'Shorte stërvitjeje me teknologji Dri-FIT.', '{"XS","S","M","L","XL","XXL"}', false, 4.3, 78, 134),
  ('Smart Watch SE', 'APPLE', 'electronics', 279.00, null, 'Orë inteligjente me GPS dhe monitorim shëndetësor.', '{"40mm","44mm"}', false, 4.9, 1204, 1893),
  ('Wireless Earbuds', 'SONY', 'electronics', 149.90, 199.90, 'Kufje wireless me noise cancelling, bateri 30 orë.', '{"ONE SIZE"}', true, 4.8, 893, 1234);
