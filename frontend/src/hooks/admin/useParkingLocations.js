import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import {
  getParkingLocations,
  createParkingLocation,
  updateParkingLocation,
  deleteParkingLocation,
} from "../../services/admin/parkingLocationService";

import { debounce } from "../../utils/debounce";

export function useParkingLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/parking_locations/");
  const [search, setSearch] = useState("");

  const fetchLocations = (url, searchTerm = "") => {
    if (!url) return;
    setLoading(true);
    getParkingLocations(url, searchTerm)
      .then((res) => {
        setLocations(res.data.results);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        setCurrentUrl(url);
      })
      .catch(() => toast.error("Failed to fetch parking locations"))
      .finally(() => setLoading(false));
  };

  const debouncedFetch = useCallback(
    debounce((value) => fetchLocations("/api/parking_locations/", value), 400),
    []
  );

  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  const create = (form, onSuccess) => {
    createParkingLocation(form)
      .then(() => {
        toast.success("Created!");
        fetchLocations(currentUrl, search);
        if (onSuccess) onSuccess();
      })
      .catch(() => toast.error("Create failed."));
  };

  const update = (id, form, onSuccess) => {
    updateParkingLocation(id, form)
      .then(() => {
        toast.success("Updated!");
        fetchLocations(currentUrl, search);
        if (onSuccess) onSuccess();
      })
      .catch(() => toast.error("Update failed."));
  };

  const remove = (id, onSuccess) => {
    deleteParkingLocation(id)
      .then(() => {
        toast.success("Deleted!");
        fetchLocations(currentUrl, search);
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
    fetchLocations,
    create,
    update,
    remove,
  };
}
