<!-- Google Maps Gravity Forms Script v1.1 -->
<style>
    /* Estilos para ocultar los campos técnicos de Gravity Forms */
    .gmap_address, 
    .gmap_lat, 
    .gmap_lng,
    .gmap_url { 
        display: none !important;
    }
</style>

<!-- Contenedor del Mapa -->
<div id="gmap_GF" style="width:100%; margin-bottom: 20px;"></div>

<!-- Input de Búsqueda -->
<input type="text" id="gmap_search_input"
       style="width:100%; padding:10px; border:1px solid #ddd; margin-bottom:10px;">

<script>
// =========================================================
//  SECCIÓN DE CONFIGURACIÓN DEL USUARIO
// =========================================================
const gmapConfig = {
    // 1. Apariencia
    mapHeight: "380px",               // Altura del mapa
    searchPlaceholder: "Escribe una dirección o mueve el pin...", // Texto ayuda buscador

    // 2. Ubicación Inicial por defecto (Usada si falla la geolocalización)
    defaultLat: 19.4326,              // Latitud (Ej. CDMX)
    defaultLng: -99.1332,             // Longitud
    defaultZoom: 15,                  // Zoom inicial

    // 3. Niveles de Zoom
    zoomOnSearch: 17,                 // Zoom al seleccionar lugar del buscador
    zoomOnLink: 20,                   // Zoom para el enlace generado (URL)

    // 4. Conexión con Gravity Forms (Clases CSS configuradas en el formulario)
    selectors: {
        address: ".gmap_address",     // Clase campo Dirección
        lat: ".gmap_lat",             // Clase campo Latitud
        lng: ".gmap_lng",             // Clase campo Longitud
        url: ".gmap_url"              // Clase campo URL
    }
    
    // NOTA: La API KEY se cambia al final de este archivo, 
    // en la línea que dice "src=... key=TU_API_KEY..."
};
// =========================================================
//  FIN DE CONFIGURACIÓN - NO EDITAR ABAJO
// =========================================================

window.initGMapGF = function() {
    // Aplicar configuración visual inicial
    const mapDiv = document.getElementById("gmap_GF");
    const searchInput = document.getElementById("gmap_search_input");
    
    if (mapDiv) mapDiv.style.height = gmapConfig.mapHeight;
    if (searchInput) searchInput.placeholder = gmapConfig.searchPlaceholder;

    const checkExist = setInterval(function() {
        // Buscamos los inputs dentro de las clases configuradas
        const gfAddressInput = document.querySelector(gmapConfig.selectors.address + " input");
        const gfLatInput = document.querySelector(gmapConfig.selectors.lat + " input");
        const gfLngInput = document.querySelector(gmapConfig.selectors.lng + " input");
        const gfUrlInput = document.querySelector(gmapConfig.selectors.url + " input");

        if (mapDiv && gfAddressInput && gfLatInput && gfLngInput) {
            clearInterval(checkExist);
            setupMap(mapDiv, gfAddressInput, gfLatInput, gfLngInput, gfUrlInput);
        }
    }, 500);
};

function setupMap(mapDiv, gfAddressInput, gfLatInput, gfLngInput, gfUrlInput) {
    const inputSearch = document.getElementById("gmap_search_input");
    const geocoder = new google.maps.Geocoder();
    
    // Usar ubicación de la configuración
    const defaultLocation = { lat: gmapConfig.defaultLat, lng: gmapConfig.defaultLng };
    
    const map = new google.maps.Map(mapDiv, {
        center: defaultLocation,
        zoom: gmapConfig.defaultZoom,
        streetViewControl: false
    });

    const marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP
    });

    function updateGFFields(lat, lng, address = null) {
        gfLatInput.value = lat;
        gfLngInput.value = lng;
        
        if (gfUrlInput) {
            // Usamos el zoom configurado para el link
            const mapUrl = `https://www.google.com/maps/place/${lat}+${lng}/@${lat},${lng},${gmapConfig.zoomOnLink}z`;
            gfUrlInput.value = mapUrl;
            gfUrlInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (address) {
            gfAddressInput.value = address;
            inputSearch.value = address;
        } else {
            geocodePosition(marker.getPosition());
        }

        gfLatInput.dispatchEvent(new Event('change', { bubbles: true }));
        gfLngInput.dispatchEvent(new Event('change', { bubbles: true }));
        gfAddressInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function geocodePosition(pos) {
        geocoder.geocode({ location: pos }, (results, status) => {
            if (status === "OK" && results[0]) {
                const address = results[0].formatted_address;
                gfAddressInput.value = address;
                inputSearch.value = address;
                gfAddressInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(userPos);
                marker.setPosition(userPos);
                updateGFFields(userPos.lat, userPos.lng);
            },
            () => { console.log("Geolocalización no permitida o fallida."); }
        );
    }

    const autocomplete = new google.maps.places.Autocomplete(inputSearch);
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(gmapConfig.zoomOnSearch); // Usar zoom de configuración
        }

        marker.setPosition(place.geometry.location);
        updateGFFields(
            place.geometry.location.lat(),
            place.geometry.location.lng(),
            place.formatted_address
        );
    });

    marker.addListener("dragend", () => {
        const lat = marker.getPosition().lat();
        const lng = marker.getPosition().lng();
        updateGFFields(lat, lng);
    });

    map.addListener("click", (e) => {
        marker.setPosition(e.latLng);
        updateGFFields(e.latLng.lat(), e.latLng.lng());
    });
}
</script>

<!-- Cargar API de Google Maps (Tu API Key está aquí) -->
<script
    src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&libraries=places&callback=initGMapGF"
    async defer></script>
