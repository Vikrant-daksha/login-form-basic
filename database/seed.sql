--Product Table Template Data
INSERT INTO users (email, phone_no, password_hash, username, is_verified, is_active, role, failed_login_attempt, created_at, updated_at, last_login)
VALUES ('mail@google.com', NULL, 'pasdfs', 'nobody', true, true, 'user', 0, NOW(), NOW(), NOW()),
('nomai@google.com', 7823746673, 'nopass', 'somebody', true, true, 'user', 2, NOW(), NOW(), NOW()),
('somai@google.com', NULL, 'pda', 'evrybody', true, true, 'user', 0, NOW(), NOW(), NOW()),
('coc@google.com', NULL, 'pasds', 'ombrebody', true, true, 'user', 0, NOW(), NOW(), NOW()),
(NULL, 78317375263, 'paamnn', 'lqop', true, true, 'user', 0, NOW(), NOW(), NOW()),
('lai@google.com', NULL, 'padsjn', 'vais', true, true, 'user', 0, NOW(), NOW(), NOW()),
(NULL, 27153123123, 'pahjw', 'nim', true, true, 'user', 0, NOW(), NOW(), NOW());


--Product Table Template Data
INSERT INTO products(product, description, price, product_types, product_colors, product_sizes)
VALUES ('Nail', 'this is a nail designed by cherrybrush', 1000, 'almond', 'blue', 'medium'),
('TAil Nail', 'this is a nail designed by cherrybrush', 864, 'almond', 'blue', 'medium'),
('MAle Nail', 'this is a nail designed by cherrybrush', 734, 'almond', 'blue', 'medium'),
('RAil Nail', 'this is a nail designed by cherrybrush', 145, 'almond', 'blue', 'medium'),
('SAle Nail', 'this is a nail designed by cherrybrush', 530, 'almond', 'blue', 'medium'),
('black Nail', 'this is a nail designed by cherrybrush', 120, 'almond', 'blue', 'medium'),
('Pretty Nail', 'this is a nail designed by cherrybrush', 900, 'almond', 'blue', 'medium');

--Cart Relation to user and product table
INSERT INTO carts (user_id) 
VALUES (2),
(5),
(1),
(7),
(3);

--cart Items
INSERT INTO cart_items (cart_id, product_id, quantity) 
VALUES (1, 3, 2),
(1, 1, 5),
(1, 6, 1),
(2, 2, 4),
(2, 7, 2),
(3, 5, 1),
(4, 1, 3),
(4, 4, 2),
(4, 2, 6),
(5, 3, 7),
(5, 6, 2);



--Cart linking logic
--@block
SELECT * FROM carts INNER JOIN products ON carts.product_id = products.product_id;
SELECT * FROM carts INNER JOIN users ON carts.user_id = users.id;


SELECT 
    pv.id,
    p.product AS product,
    c.color AS color,
    s.size AS size,
    sh.shape AS shape
FROM product_variants AS pv
INNER JOIN products AS p ON p.product_id = pv.product_id
INNER JOIN colors AS c ON c.id = pv.color_id
INNER JOIN sizes AS s ON s.id = pv.size_id
INNER JOIN shapes AS sh ON sh.id = pv.shape_id;

INSERT INTO product_variants (product_id, color_id, size_id, shape_id, stock, track_inventory)
VALUES(40, 6, 7, 6, NULL, FALSE),
(40, 6, 8, 6, NULL, FALSE),
(40, 6, 9, 6, NULL, FALSE);