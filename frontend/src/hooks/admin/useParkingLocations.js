import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  fetchParkingLocations,
  createParkingLocation,
  updateParkingLocation,
  deleteParkingLocation,
} from "../../services/admin/parkingLocationService";
import { debounce } from "../../utils/debounce";

/**
 * Custom hook for managing parking locations in the admin panel.
 * Handles fetching, searching, creating, updating, and deleting locations.
 *
 * @returns {Object} State and actions for parking locations.
 */
export function useParkingLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/parking_locations/");
  const [search, setSearch] = useState("");

  /**
   * Loads parking locations from the API and updates state.
   * @param {string} url - The API endpoint to fetch locations from.
   * @param {string} searchTerm - Optional search term.
   */
  const loadParkingLocations = (url, searchTerm = "") => {
    if (!url) return;
    setLoading(true);
    fetchParkingLocations(url, searchTerm)
      .then((res) => {
        setLocations(res.data.results);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        setCurrentUrl(url);
      })
      .catch(() => toast.error("Failed to fetch parking locations"))
      .finally(() => setLoading(false));
  };

  // Debounced fetch to avoid excessive API calls on search input
  const debouncedFetch = useCallback(
    debounce(
      (value) => loadParkingLocations("/api/parking_locations/", value),
      400
    ),
    []
  );

  // Fetch locations when search changes
  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  /**
   * Creates a new parking location.
   * @param {Object} form - Form data for the new location.
   * @param {Function} onSuccess - Optional callback on success.
   */
  const create = (form, onSuccess) => {
    createParkingLocation(form)
      .then(() => {
        toast.success("Created!");
        loadParkingLocations(currentUrl, search);
        if (onSuccess) onSuccess();
      })
      .catch(() => toast.error("Create failed."));
  };

  /**
   * Updates an existing parking location.
   * @param {number|string} id - Location ID.
   * @param {Object} form - Updated form data.
   * @param {Function} onSuccess - Optional callback on success.
   */
  const update = (id, form, onSuccess) => {
    updateParkingLocation(id, form)
      .then(() => {
        toast.success("Updated!");
        loadParkingLocations(currentUrl, search); // Fixed typo here
        if (onSuccess) onSuccess();
      })
      .catch(() => toast.error("Update failed."));
  };

  /**
   * Deletes a parking location.
   * @param {number|string} id - Location ID.
   * @param {Function} onSuccess - Optional callback on success.
   */
  const remove = (id, onSuccess) => {
    deleteParkingLocation(id)
      .then(() => {
        toast.success("Deleted!");
        loadParkingLocations(currentUrl, search);
        if (onSuccess) onSuccess();
      })
      .catch(() => toast.error("Delete failed."));
  };

  return {
    locations,
    loading,
    nextUrl,
    prevUrl,
    search,
    setSearch,
    loadParkingLocations,
    create,
    update,
    remove,
  };
}
