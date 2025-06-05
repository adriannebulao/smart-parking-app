import api from "../api";

/**
 * Fetches grouped reservation summary data.
 * @param {Object} options - Options for grouping.
 * @param {string} options.groupBy - Grouping criteria (e.g., "day", "week", "month").
 * @param {string} options.range - Time range (e.g., "week", "month", "year").
 * @param {string} options.sort - Sort order ("asc" or "desc").
 * @returns {Promise<Object>} Grouped summary data.
 */
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

/**
 * Fetches today's reservation summary.
 * @returns {Promise<Object>} Today's summary data.
 */
export const fetchTodaySummary = async () => {
  const response = await api.get("/api/reservations/summary/", {
    params: { summary_type: "today" },
  });
  return response.data;
};

/**
 * Fetches total reservation summary for a given range.
 * @param {Object} options
 * @param {string} options.range - Time range (e.g., "week", "month", "year").
 * @returns {Promise<Object>} Total summary data.
 */
export const fetchTotalSummary = async ({ range = "week" } = {}) => {
  const response = await api.get("/api/reservations/summary/", {
    params: {
      summary_type: "total",
      range,
    },
  });
  return response.data;
};
