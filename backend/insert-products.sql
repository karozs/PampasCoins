-- Script para insertar productos de prueba en Tayacoins
-- Este script agrega 20+ productos variados a la base de datos

USE tayacoins;

-- Insertar productos variados (asumiendo que los seller_id 6 y 7 existen)
-- Productos de Frutas
INSERT INTO products (seller_id, name, quantity, price, status) VALUES
(6, 'Fresas Frescas', 10, 45, 'available'),
(7, 'Plátanos Orgánicos', 15, 25, 'available'),
(6, 'Uvas Verdes', 8, 60, 'available'),
(7, 'Sandía Grande', 5, 80, 'available'),
(6, 'Melón Amarillo', 7, 55, 'available'),
(7, 'Piña Tropical', 12, 40, 'available'),
(6, 'Kiwis Importados', 20, 35, 'available'),
(7, 'Mangos Maduros', 10, 50, 'available');

-- Productos de Verduras
INSERT INTO products (seller_id, name, quantity, price, status) VALUES
(6, 'Zanahorias Orgánicas', 25, 20, 'available'),
(7, 'Brócoli Fresco', 15, 30, 'available'),
(6, 'Espinacas Baby', 10, 35, 'available'),
(7, 'Pimientos Rojos', 12, 28, 'available'),
(6, 'Cebollas Moradas', 20, 15, 'available'),
(7, 'Ajos Frescos', 30, 12, 'available'),
(6, 'Calabazas', 8, 40, 'available');

-- Productos Lácteos y Derivados
INSERT INTO products (seller_id, name, quantity, price, status) VALUES
(7, 'Queso Fresco Artesanal', 5, 120, 'available'),
(6, 'Yogurt Natural', 15, 25, 'available'),
(7, 'Mantequilla Casera', 10, 45, 'available'),
(6, 'Leche de Cabra', 8, 35, 'available');

-- Productos de Panadería
INSERT INTO products (seller_id, name, quantity, price, status) VALUES
(7, 'Pan Integral', 20, 18, 'available'),
(6, 'Galletas de Avena', 25, 22, 'available'),
(7, 'Croissants Artesanales', 12, 30, 'available');

-- Productos Varios
INSERT INTO products (seller_id, name, quantity, price, status) VALUES
(6, 'Miel de Abeja Pura', 10, 90, 'available'),
(7, 'Mermelada de Fresa', 15, 35, 'available'),
(6, 'Aceite de Oliva Extra Virgen', 8, 150, 'available'),
(7, 'Café Orgánico Molido', 12, 75, 'available'),
(6, 'Té Verde Premium', 20, 40, 'available'),
(7, 'Chocolate Artesanal', 15, 55, 'available');

-- Verificar cuántos productos se insertaron
SELECT COUNT(*) as total_productos FROM products;
SELECT * FROM products ORDER BY created_at DESC LIMIT 10;
