# Google Maps + Gravity Forms

Snippet reutilizable para integrar Google Maps con campos ocultos de Gravity Forms.

## Características

- Mapa interactivo con marcador arrastrable
- Búsqueda por dirección usando Google Places Autocomplete
- Geolocalización inicial del usuario (si la permite)
- Relleno automático de:
  - Dirección formateada
  - Latitud
  - Longitud
  - URL de Google Maps

## Uso en Gravity Forms

1. Crea un formulario y añade los siguientes campos de texto:
   - Dirección
   - Latitud
   - Longitud
   - URL (opcional)

2. En cada campo, en **Apariencia → Clase CSS**, pon:
   - `gmap_address`
   - `gmap_lat`
   - `gmap_lng`
   - `gmap_url` (si usas el campo URL)

3. En la pestaña **Formulario → Configuración → Confirmaciones** o en un **HTML field** del formulario:
   - Pega el contenido de `gmap-gravity-forms-snippet.html`.

4. Reemplaza `TU_API_KEY` en la URL de la API de Google Maps por tu API key restringida.

## Configuración rápida

En el objeto `gmapConfig` puedes cambiar:

```js
mapHeight: "380px",     // Altura del mapa
searchPlaceholder: "Escribe una dirección o mueve el pin...",
defaultLat: 19.4326,    // Latitud inicial
defaultLng: -99.1332,   // Longitud inicial
defaultZoom: 15,
zoomOnSearch: 17,
zoomOnLink: 20
