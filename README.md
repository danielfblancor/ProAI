# Inventory App

Aplicación web simple para gestionar inventario usando Flask y SQLite.

## Requisitos

- Python 3
- Dependencias en `requirements.txt`

## Cómo ejecutar

1. Instala las dependencias:

   ```bash
   pip install -r requirements.txt
   ```

2. Inicia el servidor:

   ```bash
   python app.py
   ```

3. Desde tu celular, abre un navegador y visita `http://<ip-del-servidor>:5000/`, reemplazando `<ip-del-servidor>` con la dirección IP de la computadora que ejecuta el servidor.

## Pruebas

Ejecuta las pruebas con:

```bash
pytest
```

## Funcionalidad

- Agregar artículos con cantidad.
- Actualizar cantidades.
- Eliminar artículos.
