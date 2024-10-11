const API_BASE = "https://62b22f4d20cad3685c8ac617.mockapi.io/inventory/v1/";

/**
 * Parses JSON responses for easier consumption.
 *
 * The returned promise behaves as follows:
 * * For "OK" responses (2xx status codes)
 *   * If the body has JSON, it resolves to the JSON itself
 *   * If the body has no JSON (i.e. is empty), it resolves to null
 * * For all other responses, it rejects with an `Error` object that contains
 *   the following properties:
 *   * `isFromServer`: Set to true, indicating it is a server error
 *   * `response`: The complete response, for reference if required
 *   * `responseJson`: The response body pre-converted to JSON for convenience
 *
 * @param {Object} response
 * @returns {Promise<{}>}
 */
export async function parseJsonResponse(response) {
  let json = null;
  try {
    json = await response.json();
  } catch (e) {
    // TODO Do something if response has no, or invalid JSON
  }

  if (response.ok) {
    return json;
  } else {
    const error = new Error(response.statusText);
    error.isFromServer = true;
    error.response = response;
    error.responseJson = json;

    throw error;
  }
}

/**
 * Performs an API request.
 *
 * @param {string} method - 'GET', 'POST' etc.
 * @param {string} path
 * @param {Object} [body]
 * @param {Object} [options] - `fetch` options other than `method` and `body`
 * @returns {Promise<{}>} As returned by {@link parseJsonResponse}
 */
export async function apiGetRequest(method, path) {
  const options = { method };
  const finalPath = API_BASE + path;
  // console.log(finalPath);
  const response = await fetch(finalPath, options);
  console.log("Response for fetching order details: "+response.body);

  return parseJsonResponse(response);
}

export async function apiPostRequest(method, path, body) {
  const finalPath = API_BASE + path;
  // console.log(finalPath);
  const response = await fetch(finalPath, {
    method: 'POST',
    body: JSON.stringify(body),
    headers:{
      'Content-type':'application/json'
    }
  });
  console.log("Response for creating new order: "+response.body);

  return parseJsonResponse(response);
}