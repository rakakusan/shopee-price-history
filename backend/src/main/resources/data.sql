-- INSERT INTO products
INSERT INTO products (sku, name, url, image, description, category) VALUES
('255489769', 'Combo sản phẩm bầu và quần lót', 'https://shopee.vn/product/14346466/255489769', 'https://cf.shopee.vn/file/e19038f8a93a4bf182768873a398001e', 'Quần legging bầu chân ren đẹp\nQuần có chun điều chỉnh\nForm dáng đẹp\nMặc từ bầu bé đến lớn\n#bầu #mevabe #mẹvàbé', 'nan'),
('515214204', 'Dây quấn (Băng quấn) ghi đông xe đạp vân Carbon', 'https://shopee.vn/product/34156662/515214204', 'https://cf.shopee.vn/file/vn-11134207-7r98o-lz68976093mpcf', 'Dây quấn ghi đông vân Carbon, chống trượt, trọng lượng nhẹ ~70g', 'nan'),
('256208634', 'Bộ thô sau sinh', 'https://shopee.vn/product/14346466/256208634', 'https://cf.shopee.vn/file/5f8d789dfd9081a3508917d02f28b48f', 'Bộ thô sau sinh tiện lợi, áo có khóa kéo ở ngực', 'nan'),
('161405955', 'Quần ngố bầu chân ren chất cotton mát có chun chỉnh bụng', 'https://shopee.vn/product/14346466/161405955', 'https://cf.shopee.vn/file/140619789bfe97cb4217ba36df729694', 'Quần ngố bầu chất cotton thoải mái, có chun chỉnh', 'nan');

-- INSERT INTO price_history
INSERT INTO price_history (product_id, price, discount, record_date) VALUES
(1, 150000, 0, '2025-09-01'),
(1, 140000, 0, '2025-09-15'),
(2, 250000, 0, '2025-09-01'),
(3, 200000, 0, '2025-09-01'),
(4, 180000, 0, '2025-09-01');