import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { fetchParkingLocations } from "../../services/user/parkingLocationService";
import { debounce } from "../../utils/debounce";

/**
 * Custom hook for fetching and managing parking locations for users.
 * Handles searching, pagination, and loading state.
 *
 * @param {string} initialUrl - The initial API endpoint for fetching locations.
 * @returns {Object} State and actions for parking locations.
 */
export function useParkingLocations(initialUrl = "/api/parking_locations/") {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [search, setSearch] = useState("");

  /**
   * Loads parking locations from the API and updates state.
   * @param {string} url - The API endpoint to fetch locations from.
   * @param {string} term - Optional search term.
   */
  const loadParkingLocations = (url, term = "") => {
    setLoading(true);
    fetchParkingLocations(url, term)
      .then((res) => {
        setLocations(res.data.results);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        setCurrentUrl(url);
      })
      .catch(() => toast.error("Failed to fetch locations."))
      .finally(() => setLoading(false));
  };

  /**
   * Debounced fetch to avoid excessive API calls on search input.
   */
  const debouncedFetch = useCallback(
    debounce((value) => {
      loadParkingLocations(initialUrl, value);
    }, 400),
    [initialUrl]
  );

  // Fetch locations when search changes
  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  /**
   * Loads the next page of locations if available.
   */
  const goNext = () => {
    if (nextUrl) loadParkingLocations(nextUrl, search);
  };

  /**
   * Loads the previous page of locations if available.
   */
  const goPrev = () => {
    if (prevUrl) loadParkingLocations(prevUrl, search);
  };

  return {
    locations,
    loading,
    nextUrl,
    prevUrl,
    currentUrl,
    search,
    setSearch,
    goNext,
    goPrev,
    loadParkingLocations,
  };
}
