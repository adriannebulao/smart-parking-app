import api from "./api";

export const fetchGroupedSummary = async ({
  groupBy = "day",
  range = "week",
  sort = "desc",
} = {}) => {
  const response = await api.get("/api/reservations/summary/", {
    params: {
      summary_type: "grouped",
      group_by: groupBy,
      range,
      sort,
    },
  });
  return response.data;
};

export const fetchTodaySummary = async () => {
  const response = await api.get("/api/reservations/summary/", {
    params: { summary_type: "today" },
  });
  return response.data;
};

export const fetchTotalSummary = async ({ range = "week" } = {}) => {
  const response = await api.get("/api/reservations/summary/", {
    params: {
      summary_type: "total",
      range,
    },
  });
  return response.data;
};
