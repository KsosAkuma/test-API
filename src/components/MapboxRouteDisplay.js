import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

mapboxgl.accessToken = "APIKEY";

const MapboxRouteDisplay = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2.3522, 48.8566], // Paris coordinates
            zoom: 5,
        });
    });

    const drawRoute = (map, coordinates) => {
        // If a route is already loaded, remove it
        if (map.getSource('route')) {
            map.removeLayer('route');
            map.removeSource('route');
        }

        map.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates,
                },
            },
        });

        map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
            },
            paint: {
                'line-color': '#888',
                'line-width': 8,
            },
        });

        // Fit map to route bounds
        const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        map.fitBounds(bounds, {
            padding: 20,
        });
    };

    const getRoute = async () => {
        const geoCodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${departure}.json?access_token=${mapboxgl.accessToken}`;
        const departureCoords = (await axios.get(geoCodeUrl)).data.features[0].center;
        const arrivalCoords = (await axios.get(geoCodeUrl.replace(departure, arrival))).data.features[0].center;

        const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${departureCoords.join(',')};${arrivalCoords.join(',')}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
        const response = await axios.get(directionsUrl);
        const data = response.data.routes[0];
        const route = data.geometry.coordinates;

        drawRoute(map.current, route);
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Starting location"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Destination"
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                />
                <button onClick={getRoute}>Display Route</button>
            </div>
            <div ref={mapContainer} className="mapContainer" />
        </div>
    );
};

export default MapboxRouteDisplay;
