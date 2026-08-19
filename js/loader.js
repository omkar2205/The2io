(() => {
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

  async function hideLoader() {
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

    const loader = document.getElementById("siteLoader");
    document.body.classList.remove("site-loading");

    if (!loader) return;
    loader.classList.add("is-ready");
    window.setTimeout(() => loader.remove(), 260);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
  } else {
    hideLoader();
  }
})();
