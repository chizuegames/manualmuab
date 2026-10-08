# Muchas abducciones · Manual interactivo

Visor responsive del PDF `Manual mini MUAB.pdf`. Incluye navegación, selección de página, zoom, pantalla completa, gestos y descarga. Lee el PDF original mediante PDF.js 6.4.299 (Mozilla, Apache-2.0), cargado desde jsDelivr. Requiere conexión a internet y un navegador moderno.

## Publicar en GitHub Pages

En Settings → Pages → Build and deployment, elegir Deploy from a branch, rama main y carpeta /(root). Guardar.

URL prevista al activar Pages: https://chizuegames.github.io/manualmuab/

## Incrustar en Google Sites

Insertar → Incorporar → Insertar código:

```html
<iframe src="https://chizuegames.github.io/manualmuab/" title="Manual de Muchas abducciones" width="100%" height="800" style="border:0" allow="fullscreen" allowfullscreen></iframe>
```

También se puede incorporar la URL directamente. Ajustar la altura del bloque a aproximadamente 700–850 px. El botón de pantalla completa abrirá una pestaña cuando el navegador o el contenedor no permita fullscreen.

## Actualizar el manual

Reemplazar el PDF conservando su nombre exacto. El visor obtiene automáticamente el número de páginas y las dimensiones reales. Si cambia el nombre, actualizar los enlaces y manual-config en index.html.

## Desarrollo

Servir la raíz por HTTP, por ejemplo `python3 -m http.server 8000`. No requiere compilación ni instalación de paquetes.
