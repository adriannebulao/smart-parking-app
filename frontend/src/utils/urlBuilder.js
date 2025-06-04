export const buildReservationUrl = (status, search) => {
  let url = "/api/reservations/";

  const params = new URLSearchParams();
  if (status !== "all") params.append("status", status);
  if (search) params.append("search", search);
  if (status === "all") params.append("ordering", "is_cancelled");

  if ([...params].length > 0) url += `?${params.toString()}`;
  return url;
};
