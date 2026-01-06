# Scripts de Base de Datos - PampasCoins

## Tabla de Redes Sociales Independiente

### Script de Creación (SQL Puro)

```sql
-- Crear tabla de redes sociales independiente
CREATE TABLE IF NOT EXISTS social_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    twitter VARCHAR(255),
    tiktok VARCHAR(255),
    whatsapp VARCHAR(20),
    telegram VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Migrar datos existentes desde la tabla users
INSERT INTO social_media (user_id, instagram, facebook, twitter, tiktok)
SELECT id, instagram, facebook, twitter, tiktok
FROM users
WHERE instagram IS NOT NULL 
   OR facebook IS NOT NULL 
   OR twitter IS NOT NULL 
   OR tiktok IS NOT NULL
ON DUPLICATE KEY UPDATE
    instagram = VALUES(instagram),
    facebook = VALUES(facebook),
    twitter = VALUES(twitter),
    tiktok = VALUES(tiktok);
```

### Script de Migración (Node.js)

**Archivo:** `backend/create-social-media-table.js`

Este script ya fue ejecutado exitosamente y creó la tabla con los datos migrados.

Para ejecutarlo nuevamente (si es necesario):
```bash
cd backend
node create-social-media-table.js
```

---

## Schema Completo Actualizado

**Archivo:** `backend/schema.sql`

El schema principal ahora incluye:

### Tablas Principales:
1. **users** - Usuarios del sistema
2. **products** - Productos publicados
3. **transactions** - Transacciones de compra/venta
4. **reviews** - Reseñas de vendedores
5. **social_media** - ⭐ Redes sociales (NUEVA - Independiente)

### Estructura de social_media:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | ID único (auto-increment) |
| `user_id` | INT | ID del usuario (UNIQUE) |
| `instagram` | VARCHAR(255) | Usuario de Instagram |
| `facebook` | VARCHAR(255) | Usuario de Facebook |
| `twitter` | VARCHAR(255) | Usuario de Twitter |
| `tiktok` | VARCHAR(255) | Usuario de TikTok |
| `whatsapp` | VARCHAR(20) | Número de WhatsApp |
| `telegram` | VARCHAR(255) | Usuario de Telegram |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de actualización |

### Características:
- ✅ **Independiente** de la tabla `users`
- ✅ **Foreign Key** con `ON DELETE CASCADE` (si se elimina un usuario, se eliminan sus redes sociales)
- ✅ **UNIQUE constraint** en `user_id` (un usuario = un registro)
- ✅ **Auto-update** en `updated_at` cuando se modifica

---

## API Endpoints Disponibles

### GET /api/users/:id/social-media
Obtiene las redes sociales de un usuario.

**Respuesta:**
```json
{
  "id": 1,
  "user_id": 5,
  "instagram": "@usuario",
  "facebook": "usuario.facebook",
  "twitter": "@usuario",
  "tiktok": "@usuario",
  "whatsapp": "933713054",
  "telegram": "@usuario",
  "created_at": "2026-01-06T00:00:00.000Z",
  "updated_at": "2026-01-06T00:00:00.000Z"
}
```

### PUT /api/users/:id/social-media
Crea o actualiza las redes sociales de un usuario.

**Body:**
```json
{
  "instagram": "@nuevo_usuario",
  "facebook": "nuevo.facebook",
  "twitter": "@nuevo_twitter",
  "tiktok": "@nuevo_tiktok",
  "whatsapp": "987654321",
  "telegram": "@nuevo_telegram"
}
```

---

## Comandos Útiles

### Verificar la tabla
```sql
DESCRIBE social_media;
```

### Ver todos los registros
```sql
SELECT * FROM social_media;
```

### Contar registros
```sql
SELECT COUNT(*) as total FROM social_media;
```

### Ver redes sociales de un usuario específico
```sql
SELECT u.name, sm.* 
FROM users u 
LEFT JOIN social_media sm ON u.id = sm.user_id 
WHERE u.id = 1;
```

### Eliminar la tabla (si necesitas recrearla)
```sql
DROP TABLE IF EXISTS social_media;
```

---

## Notas Importantes

1. **Compatibilidad hacia atrás**: Las columnas de redes sociales en la tabla `users` se mantienen para compatibilidad, pero la fuente de verdad ahora es la tabla `social_media`.

2. **Migración automática**: El script `create-social-media-table.js` migra automáticamente los datos existentes.

3. **Cascada de eliminación**: Si eliminas un usuario, sus redes sociales se eliminan automáticamente.

4. **Actualización automática**: El campo `updated_at` se actualiza automáticamente cuando modificas un registro.
