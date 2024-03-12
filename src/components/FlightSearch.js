import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AutocompleteInput from './AutocompleteInput';
const FlightSearchAmadeus = () => {
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [flights, setFlights] = useState([]);

    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        // Fonction pour obtenir le jeton d'accès
        const fetchAccessToken = async () => {
            const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: 'clientKEY',
                    client_secret: 'secretKEY',
                    grant_type: 'client_credentials',
                }),
            });

            const data = await response.json();
            setAccessToken(data.access_token);
        };

        fetchAccessToken();
    }, []);
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);

    // Formatter la date en format YYYY-MM-DD pour l'API
    const departureDate = currentDate.toISOString().split('T')[0];
    const searchFlights = async () => {


        try {
            // Remplacez ces URLs par l'appel à l'API d'auto-complétion d'Amadeus pour obtenir les codes IATA
            const departureResponse = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${departureCity}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const arrivalResponse = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${arrivalCity}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const departureIataCode = departureResponse.data.data[0].iataCode;
            const arrivalIataCode = arrivalResponse.data.data[0].iataCode;

            // Recherche des vols avec les codes IATA
            const flightResponse = await axios.get(
                `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${departureIataCode}&destinationLocationCode=${arrivalIataCode}&departureDate=${departureDate}&adults=1`, // Remplacez par vos paramètres de recherche réels
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            setFlights(flightResponse.data.data); // Ajuster en fonction de la structure de réponse réelle
        } catch (error) {
            console.error('Error searching flights:', error);
            setFlights([]);
        }
    };

    return (
        <div>
            <AutocompleteInput
                placeholder="Ville de départ"
                onCodeSelected={setDepartureCity}
            />
            <AutocompleteInput
                placeholder="Ville d'arrivée"
                onCodeSelected={setArrivalCity}
            />
            <button onClick={searchFlights}>Search Flights</button>
            <div>
                {flights.length > 0 && flights.map((flight, index) => (
                    <div key={index}>
                        {/* Affichez ici les détails du vol selon la structure de votre réponse */}
                        Flight from {flight.departure.iataCode} to {flight.arrival.iataCode}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlightSearchAmadeus;
