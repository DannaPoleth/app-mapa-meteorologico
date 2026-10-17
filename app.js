
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');
const map = document.getElementById('location-map');
const mapLink = document.getElementById('map-link');

searchButton.addEventListener('click', searchLocation);

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchLocation();
    }
});

async function searchLocation() {
    const city = cityInput.value.trim();

    if (!city) {
        weatherCard.textContent =
            '⚠️ Por favor, escribe una ubicación válida.';
        cityInput.focus();
        return;
    }

    searchButton.disabled = true;
    weatherCard.textContent =
        '🔄 Consultando la base de datos geográfica...';

    try {
        const url = new URL(
            'https://nominatim.openstreetmap.org/search'
        );

        url.searchParams.set('format', 'jsonv2');
        url.searchParams.set('q', city);
        url.searchParams.set('limit', '1');

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al consultar OpenStreetMap.');
        }

        const data = await response.json();

        if (!data.length) {
            weatherCard.textContent =
                '❌ No se encontraron resultados. Intenta con otra ubicación.';
            return;
        }

        const lugar = data[0];
        const lat = Number(lugar.lat);
        const lon = Number(lugar.lon);

        // Actualizar el mapa con la ubicación encontrada.
        const delta = 0.05;
        const bbox = [
            lon - delta,
            lat - delta,
            lon + delta,
            lat + delta
        ].join(',');

        const mapUrl = new URL(
            'https://www.openstreetmap.org/export/embed.html'
        );

        mapUrl.searchParams.set('bbox', bbox);
        mapUrl.searchParams.set('layer', 'mapnik');
        mapUrl.searchParams.set('marker', `${lat},${lon}`);

        map.src = mapUrl.toString();

        mapLink.href =
            `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`;

        // Datos meteorológicos simulados para la práctica.
        let temp;
        let humidity;
        let condition;

        if (city.toLowerCase() === 'lerma') {
            temp = '27.4';
            humidity = '91';
            condition = 'Tormenta Meteorológica';
        } else {
            temp = (Math.random() * 30 + 5).toFixed(1);
            humidity = Math.floor(Math.random() * 60 + 40);

            const conditions = [
                'Despejado',
                'Nublado',
                'Lluvia Ligera',
                'Tormenta Eléctrica'
            ];

            condition =
                conditions[Math.floor(Math.random() * conditions.length)];
        }

        // Crear los elementos de la tarjeta.
        const title = document.createElement('h3');
        title.textContent = `🗺️ Ubicación localizada: ${city}`;

        const description = document.createElement('p');
        description.className = 'description';

        const descriptionLabel = document.createElement('strong');
        descriptionLabel.textContent = 'Descripción geográfica: ';

        description.append(
            descriptionLabel,
            document.createTextNode(lugar.display_name)
        );

        const geoData = document.createElement('div');
        geoData.className = 'geo-data';

        const latitude = document.createElement('p');
        latitude.textContent = `Latitud: ${lat}`;

        const longitude = document.createElement('p');
        longitude.textContent = `Longitud: ${lon}`;

        geoData.append(latitude, longitude);

        const separator = document.createElement('hr');
        separator.style.border = '0.5px solid #4ade80';
        separator.style.margin = '15px 0';

        const weatherData = document.createElement('div');
        weatherData.className = 'weather-data';

        const weatherTitle = document.createElement('h4');
        weatherTitle.textContent = '⛈️ Parámetros climatológicos';

        const temperature = document.createElement('p');
        temperature.textContent = `Temperatura simulada: ${temp} °C`;

        const humidityText = document.createElement('p');
        humidityText.textContent = `Humedad simulada: ${humidity}%`;

        const conditionText = document.createElement('p');
        conditionText.textContent = `Condición simulada: ${condition}`;

        weatherData.append(
            weatherTitle,
            temperature,
            humidityText,
            conditionText
        );

        const footer = document.createElement('div');
        footer.className = 'success-footer';
        footer.textContent =
            '✓ Datos geográficos consultados correctamente.';

        weatherCard.replaceChildren(
            title,
            description,
            geoData,
            separator,
            weatherData,
            footer
        );

    } catch (error) {
        console.error(error);
        weatherCard.textContent =
            '❌ Error de conexión. Comprueba tu Internet e inténtalo de nuevo.';
    } finally {
        searchButton.disabled = false;
    }
}
