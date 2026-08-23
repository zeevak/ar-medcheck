/**
 * fda-fetch.js
 * Talks to the openFDA Drug Enforcement Reports API and returns
 * a simplified list of recall records. No API key required for
 * light/testing use.
 *
 * Docs: https://open.fda.gov/apis/drug/enforcement/
 */

const FDA_ENDPOINT = "https://api.fda.gov/drug/enforcement.json";

/**
 * Fetch recent drug enforcement (recall) reports.
 * @param {Object} options
 * @param {string} [options.searchTerm] - e.g. a product name to filter by (openFDA search syntax)
 * @param {number} [options.limit] - how many records to pull
 * @returns {Promise<Array<{product: string, reason: string, status: string, date: string, classification: string}>>}
 */
async function fetchRecalls({ searchTerm = "", limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (searchTerm) {
    // openFDA field search syntax, e.g. product_description:"ibuprofen"
    params.set("search", `product_description:"${searchTerm}"`);
  }
  params.set("limit", String(limit));

  const url = `${FDA_ENDPOINT}?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    // openFDA returns 404 with a JSON body when a search matches nothing —
    // that's a valid "no recalls found" result, not a hard failure.
    if (response.status === 404) {
      return [];
    }
    throw new Error(`openFDA request failed: ${response.status}`);
  }

  const data = await response.json();

  return (data.results || []).map((r) => ({
    product: r.product_description || "Unknown product",
    reason: r.reason_for_recall || "No reason listed",
    status: r.status || "Unknown",
    date: r.recall_initiation_date || "Unknown date",
    classification: r.classification || "Unclassified",
  }));
}

/**
 * Simple matcher used later by the AR scene: given a list of product
 * names your 3D bottles represent, check which ones have an active
 * recall in a set of fetched records.
 * @param {string[]} productNames
 * @param {Array} recallRecords
 * @returns {Record<string, boolean>} map of productName -> isRecalled
 */
function matchRecalledProducts(productNames, recallRecords) {
  const flagged = {};
  for (const name of productNames) {
    const lower = name.toLowerCase();
    flagged[name] = recallRecords.some((r) =>
      r.product.toLowerCase().includes(lower)
    );
  }
  return flagged;
}

// Expose globally since we're not using a bundler for this beginner-friendly build.
window.fetchRecalls = fetchRecalls;
window.matchRecalledProducts = matchRecalledProducts;
