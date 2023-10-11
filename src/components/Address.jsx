import React, { useState } from 'react';
import useDependentApi from '../hooks/useDependentApi';

const Address = () => {
  const [selectedCountyId, setSelectedCountyId] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null); // Add this state for the city selection

  const {
    counties,
    states=[],
    cities=[],
    isLoadingCounties,
    isLoadingStates,
    isLoadingCities,
    errorCounties,
    errorStates,
    errorCities,
  } = useDependentApi(selectedCountyId, selectedStateId);

  if (isLoadingCounties ) {
    return <div>Loading...</div>;
  }

  if (errorCounties || errorStates || errorCities) {
    return <div>Error: {errorCounties.message || errorStates.message || errorCities.message}</div>;
  }

  // Handler for county selection change
  const handleCountyChange = (event) => {
    setSelectedCountyId(event.target.value);
    setSelectedStateId(null); // Reset the state selection when county changes
    setSelectedCityId(null); // Reset the city selection when county changes
  };

  // Handler for state selection change
  const handleStateChange = (event) => {
    setSelectedStateId(event.target.value);
    setSelectedCityId(null); // Reset the city selection when state changes
  };

  return (
    <div>
      {/* Display County Dropdown */}
      <select value={selectedCountyId} onChange={handleCountyChange}>
        <option value="">Select County</option>
        {counties.map((county) => (
          <option key={county.id} value={county.id}>
            {county.name}
          </option>
        ))}
      </select>

      {/* Display State Dropdown */}
      <select
        value={selectedStateId}
        onChange={handleStateChange}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state.id} value={state.id}>
            {state.name}
          </option>
        ))}
      </select>

      {/* Display City Dropdown */}
      <select value={selectedCityId} onChange={(e) => setSelectedCityId(e.target.value)} >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Address;

