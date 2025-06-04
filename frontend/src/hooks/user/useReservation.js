import { useState } from "react";
import { toast } from "react-toastify";
import { makeReservation } from "../../services/user/parkingLocationService";
import { validateReservationTimes } from "../../utils/validation";

export function useReservation() {
  const [reservingLocation, setReservingLocation] = useState(null);

  const handleReservationSubmit = (form) => {
    const error = validateReservationTimes(form.start_time, form.end_time);
    if (error) {
      toast.error(error);
      return;
    }

    if (!reservingLocation) {
      toast.error("No location selected for reservation.");
      return;
    }

    const body = {
      parking_location: reservingLocation.id,
      start_time: form.start_time,
      end_time: form.end_time,
    };

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
