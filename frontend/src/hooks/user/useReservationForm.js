import { useState } from "react";
import { toast } from "react-toastify";
import { makeReservation } from "../../services/user/parkingLocationService";
import { validateReservationTimes } from "../../utils/validation";

/**
 * Custom hook for managing the reservation form logic.
 * Handles validation, submission, and state for the selected parking location.
 *
 * @returns {Object} Reservation form state and handlers.
 */
export function useReservationForm() {
  const [reservingLocation, setReservingLocation] = useState(null);

  /**
   * Handles reservation form submission.
   * Validates input, checks for selected location, and makes the reservation API call.
   * Shows toast notifications for errors and success.
   *
   * @param {Object} form - The reservation form data.
   * @param {string} form.start_time - Reservation start time.
   * @param {string} form.end_time - Reservation end time.
   * @returns {Promise|undefined} Returns the promise from makeReservation for chaining or undefined if validation fails.
   */
  const handleReservationSubmit = (form) => {
    // Validate reservation times
    const error = validateReservationTimes(form.start_time, form.end_time);
    if (error) {
      toast.error(error);
      return;
    }

    // Ensure a location is selected
    if (!reservingLocation) {
      toast.error("No location selected for reservation.");
      return;
    }

    // Prepare reservation payload
    const body = {
      parking_location: reservingLocation.id,
      start_time: form.start_time,
      end_time: form.end_time,
    };

    // Make reservation API call
    return makeReservation(body)
      .then(() => {
        toast.success("Reservation successful!");
        setReservingLocation(null);
      })
      .catch(() => toast.error("Failed to make reservation."));
  };

  return {
    reservingLocation,
    setReservingLocation,
    handleReservationSubmit,
  };
}
