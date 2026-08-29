CREATE TABLE IF NOT EXISTS radicados_log (
    id SERIAL PRIMARY KEY,
    radicado_id VARCHAR(50) NOT NULL UNIQUE,
    tramite VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    fecha_radicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
