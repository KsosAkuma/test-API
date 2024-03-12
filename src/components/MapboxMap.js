import React, { useState } from 'react';
import axios from 'axios';
const access_token = "APIKEY"
const TravelTimeCalculator = () => {
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [travelMode, setTravelMode] = useState('driving'); // Le mode de transport par défaut
    const [travelDetails, setTravelDetails] = useState(null);

    const getCoordinates = async (location) => {
        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${access_token}`
        );
        return response.data.features[0].center; // Retourne les coordonnées de la première caractéristique trouvée
    };

    const calculateRoute = async () => {
        try {
            const departureCoords = await getCoordinates(departure);
            const arrivalCoords = await getCoordinates(arrival);

            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${departureCoords};${arrivalCoords}?access_token=${access_token}`
            );

            const data = response.data;
            const route = data.routes[0];

            // Convert duration from seconds to more readable format if needed
            const duration = route.duration / 3600; // Duration in hours
            const distance = route.distance / 1000; // Distance in kilometers

            setTravelDetails({
                duration: duration.toFixed(2),
                distance: distance.toFixed(2),
            });
        } catch (error) {
            console.error('Error fetching directions:', error);
            setTravelDetails(null);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Departure City"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
            />
            <input
                type="text"
                placeholder="Arrival City"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
            />
            <select value={travelMode} onChange={(e) => setTravelMode(e.target.value)}>
                <option value="driving">Driving</option>
                <option value="walking">Walking</option>
                <option value="cycling">Cycling</option>
            </select>
            <button onClick={calculateRoute}>Calculate Travel Time</button>
            {travelDetails && (
                <div>
                    <p>Travel Distance: {travelDetails.distance} km</p>
                    <p>Estimated Travel Time: {travelDetails.duration} hours</p>
                </div>
            )}
        </div>
    );
};

export default TravelTimeCalculator;