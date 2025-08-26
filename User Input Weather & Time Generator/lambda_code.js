// index.mjs (Node.js 20+ supports native fetch & ESM features)
exports.handler = async (event) => {
  // Helper to build CORS-friendly responses
  const respond = (statusCode, body) => ({
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",          // allow all origins for learning
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    body: JSON.stringify(body)
  });

  // Handle preflight if it ever reaches the function
  const http = event?.requestContext?.http;
  if (http?.method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: ""
    };
  }

  try {
    const query = event?.queryStringParameters || {};
    let city = (query.city || "").trim();
    let country = (query.country || "").trim(); // ISO 3166-1 alpha-2 (e.g., NG, US, GB), optional

    if (!city) {
      return respond(400, { error: "Missing required query parameter: city" });
    }

    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
    const TIMEZONEDB_API_KEY = process.env.TIMEZONEDB_API_KEY;

    if (!OPENWEATHER_API_KEY || !TIMEZONEDB_API_KEY) {
      return respond(500, { error: "Server misconfigured: API keys not set" });
    }

    // 1) Call OpenWeather current weather by city (and optional country)
    // API docs: https://openweathermap.org/current
    const q = country ? `${city},${country}` : city;
    const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
    weatherUrl.search = new URLSearchParams({
      q,
      appid: OPENWEATHER_API_KEY,
      units: "metric" // change to 'imperial' for Fahrenheit
    }).toString();

    // Request with timeout
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 8000);

    const weatherRes = await fetch(weatherUrl, { signal: controller.signal });
    clearTimeout(t);

    if (!weatherRes.ok) {
      const errText = await weatherRes.text();
      return respond(weatherRes.status, { error: "OpenWeather error", details: errText });
    }
    const weatherData = await weatherRes.json();

    // Extract coords and useful info
    const { coord, main, weather, sys, name, dt, timezone } = weatherData;
    const lat = coord?.lat;
    const lon = coord?.lon;

    if (lat == null || lon == null) {
      return respond(502, { error: "OpenWeather did not return coordinates" });
    }

    // 2) Call TimeZoneDB by coordinates to get local time (formatted)
    // Docs: https://timezonedb.com/references/get-time-zone
    const tzUrl = new URL("http://api.timezonedb.com/v2.1/get-time-zone");
    tzUrl.search = new URLSearchParams({
      key: TIMEZONEDB_API_KEY,
      format: "json",
      by: "position",
      lat: String(lat),
      lng: String(lon)
    }).toString();

    const tzRes = await fetch(tzUrl);
    if (!tzRes.ok) {
      const errText = await tzRes.text();
      return respond(tzRes.status, { error: "TimeZoneDB error", details: errText });
    }
    const tzData = await tzRes.json();
    if (tzData.status !== "OK") {
      return respond(502, { error: "TimeZoneDB returned non-OK status", details: tzData });
    }

    // Build the payload your frontend will consume
    const payload = {
      query: { cityInput: city, countryInput: country || null },
      location: {
        city: name,
        countryCode: sys?.country || null,
        lat,
        lon
      },
      weather: {
        temperature_c: main?.temp,
        feels_like_c: main?.feels_like,
        humidity_pct: main?.humidity,
        description: weather?.[0]?.description,
        icon: weather?.[0]?.icon // e.g., "10d" -> use https://openweathermap.org/img/wn/10d@2x.png
      },
      time: {
        local_time: tzData.formatted,   // "YYYY-MM-DD HH:MM:SS"
        zone_name: tzData.zoneName,     // e.g., "Africa/Lagos"
        gmt_offset_seconds: tzData.gmtOffset
      },
      sources: {
        openweather: { dt, timezoneOffsetSeconds: timezone },
        timezonedb: { message: tzData.message || null }
      }
    };

    return respond(200, payload);
  } catch (err) {
    // Distinguish abort timeout vs general error
    const isAbort = (err?.name === "AbortError");
    return respond(504, {
      error: isAbort ? "Upstream timeout" : "Unexpected server error",
      details: String(err?.message || err)
    });
  }
};
