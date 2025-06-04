import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { fetchParkingLocations } from "../../services/user/parkingLocationService";
import { debounce } from "../../utils/debounce";

export function useParkingLocations(initialUrl = "/api/parking_locations/") {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [search, setSearch] = useState("");

  const fetchAndSetLocations = (url, term = "") => {
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

  const debouncedFetch = useCallback(
    debounce((value) => {
      fetchAndSetLocations(initialUrl, value);
    }, 400),
    [initialUrl]
  );

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const goNext = () => {
    if (nextUrl) fetchAndSetLocations(nextUrl, search);
  };

  const goPrev = () => {
    if (prevUrl) fetchAndSetLocations(prevUrl, search);
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
    fetchAndSetLocations,
  };
}
