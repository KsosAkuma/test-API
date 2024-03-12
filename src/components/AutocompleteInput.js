import React, { useState, useEffect } from 'react';

const AutocompleteInput = ({ placeholder, onCodeSelected }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
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

    useEffect(() => {
        if (inputValue.length > 2 && accessToken) {
            const fetchSuggestions = async () => {
                const url = `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${inputValue}`;

                try {
                    const response = await fetch(url, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    const data = await response.json();
                    if (data && data.data) {
                        setSuggestions(data.data);
                    } else {
                        setSuggestions([]);
                    }
                } catch (error) {
                    console.error('Failed to fetch suggestions:', error);
                    setSuggestions([]);
                }
            };

            fetchSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [inputValue, accessToken]);

    const handleSelect = (code) => {
        onCodeSelected(code); // Met à jour l'état dans le composant parent avec le code IATA
        // Trouvez le nom de la ville correspondant au code IATA pour mettre à jour l'inputValue si nécessaire
        const selectedSuggestion = suggestions.find(suggestion => suggestion.iataCode === code);
        if (selectedSuggestion) {
            setInputValue(selectedSuggestion.address.cityName);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
            />
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((suggestion) => (
                        <li key={suggestion.id} onClick={() => handleSelect(suggestion.iataCode)}>
                            {suggestion.name} ({suggestion.iataCode})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteInput;
