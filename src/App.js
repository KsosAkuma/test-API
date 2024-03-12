import React from 'react';
import './App.css';
import MapboxMap from './components/MapboxMap';
import MapboxRouteDisplay from './components/MapboxRouteDisplay';
import FlightSearch from './components/FlightSearch';
function App() {
  return (
    <div className="App">
      <h1>Ma Carte Mapbox</h1>
      <MapboxMap />
      <MapboxRouteDisplay />
      <FlightSearch />
    </div>
  );
}

export default App;
