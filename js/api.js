(() => {
  const config = window.The2iO_CONFIG || {};
  const fallback = window.The2iO_FALLBACK_DATA || {};

  function jsonp(url) {
    return new Promise((resolve, reject) => {
      const callback = `__The2iO_cb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement("script");
      const timer = setTimeout(() => finish(new Error("api_timeout")), config.JSONP_TIMEOUT_MS || 8000);

      function finish(error, value) {
        clearTimeout(timer);
        delete window[callback];
        script.remove();
        error ? reject(error) : resolve(value);
      }

      window[callback] = payload => finish(null, payload);
      script.onerror = () => finish(new Error("api_load_failed"));
      const joiner = url.includes("?") ? "&" : "?";
      script.src = `${url}${joiner}action=siteData&callback=${encodeURIComponent(callback)}&_=${Date.now()}`;
      document.head.appendChild(script);
    });
  }

  async function loadSiteData() {
    if (!config.API_URL) {
      document.documentElement.dataset.dataSource = "fallback";
      return fallback;
    }

    try {
      const payload = await jsonp(config.API_URL);
      if (!payload || !payload.ok || !payload.data) throw new Error("invalid_api_response");
      document.documentElement.dataset.dataSource = "apps-script";
      return payload.data;
    } catch (error) {
      console.warn("The2iO backend unavailable; using local fallback data.", error);
      document.documentElement.dataset.dataSource = "fallback";
      return fallback;
    }
  }

  window.The2iOAPI = { loadSiteData };
})();
