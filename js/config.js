window.The2iO_CONFIG = Object.freeze({
  // Paste the deployed Google Apps Script /exec URL here.
  API_URL: "https://script.google.com/macros/s/AKfycbwysCJk_b7Yj88MooUKso5CRdxUnDhqjRdI1riga6sRMpm3TJSANQAf5NP2_NqQbwzaAQ/exec",
  FALLBACK_CONTACT_URL: "https://formsubmit.co/the2ioprod@gmail.com",
  JSONP_TIMEOUT_MS: 8000
});

(() => {
  const loader = document.createElement("div");
  loader.className = "site-loader";
  loader.id = "siteLoader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = '<div class="site-loader-word">The<span class="site-loader-two">2</span>iO</div>';
  document.body.prepend(loader);

  function waitForAppRender() {
    return new Promise(resolve => {
      const isReady = () => Boolean(document.getElementById("the2ioSubjectSocialStyles"));
      if (isReady()) {
        resolve();
        return;
      }

      const observer = new MutationObserver(() => {
        if (!isReady()) return;
        observer.disconnect();
        resolve();
      });

      observer.observe(document.documentElement, { childList: true, subtree: true });
    });
  }

  function waitForImage(image) {
    if (!image.currentSrc && !image.src) return Promise.resolve();
    if (image.complete) return Promise.resolve();

    return new Promise(resolve => {
      const done = () => resolve();
      image.addEventListener("load", done, { once: true });
      image.addEventListener("error", done, { once: true });
    });
  }

  async function revealSite() {
    await waitForAppRender();

    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch (_) {}
    }

    await Promise.all([...document.images].map(waitForImage));

    await new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    document.body.classList.add("site-loaded");
    loader.classList.add("is-ready");
    window.setTimeout(() => loader.remove(), 220);
  }

  revealSite();
})();
