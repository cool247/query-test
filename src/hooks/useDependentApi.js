import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchCounties() {
  return new Promise((resolve, reject) => {
    resolve([{ name: "india", id: 1 }]);
  });
}

async function fetchStatesByCounty() {
  return new Promise((resolve, reject) => {
    resolve([{ name: "up", id: 1 }]);
  });
}

async function fetchCitiesByState() {
  return new Promise((resolve, reject) => {
    resolve([{ name: "ara", id: 1 }]);
  });
}

const useDependentApi = (selectedCountyId, selectedStateId) => {
  // Fetch counties query
  const { data: counties, isLoading: isLoadingCounties, error: errorCounties } = useQuery(["counties"], fetchCounties);

  // Fetch states query based on the selected county
  const {
    data: states,
    isLoading: isLoadingStates,
    error: errorStates,
  } = useQuery(["states", selectedCountyId], () => fetchStatesByCounty(selectedCountyId), {
    enabled: !!selectedCountyId,
  });

  // Fetch cities query based on the selected state
  const {
    data: cities,
    isLoading: isLoadingCities,
    error: errorCities,
    isFetching,
  } = useQuery(["cities", selectedStateId], () => fetchCitiesByState(selectedStateId), {
    enabled: !!selectedStateId,
  });
  console.log(isFetching, "oooo");

  return {
    counties,
    states,
    cities,
    isLoadingCounties,
    isLoadingStates,
    isLoadingCities,
    errorCounties,
    errorStates,
    errorCities,
  };
};

export default useDependentApi;
