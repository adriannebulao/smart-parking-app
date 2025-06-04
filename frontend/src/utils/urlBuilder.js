export const buildReservationUrl = (status, search) => {
  let url = "/api/reservations/";

  const params = new URLSearchParams();
  if (status !== "all") params.append("status", status);
  if (search) params.append("search", search);
  if (status === "all") params.append("ordering", "is_cancelled");

  if ([...params].length > 0) url += `?${params.toString()}`;
  return url;
};

export const buildUserManagementUrl = (status, search) => {
  let url = `/api/admin/manage-users/?search=${encodeURIComponent(search)}`;

  if (status === "active") {
    url += `&is_active=true`;
  } else if (status === "deactivated") {
    url += `&is_active=false`;
  } else if (status === "all") {
    url += `&ordering=-is_active`;
  }

  return url;
};
