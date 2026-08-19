(() => {
  const spotifyId = value => {
    const text = String(value || "");
    const uri = text.match(/spotify:track:([A-Za-z0-9]+)/);
    if (uri) return uri[1];
    const url = text.match(/open\.spotify\.com\/track\/([A-Za-z0-9]+)/);
    return url ? url[1] : text;
  };

  const STATIC_FLASHES = [
    "$#%!",
    "SIGNAL LOST",
    "NOISE DETECTED",
    "UNKNOWN",
    "CH_02",
    "PUBLIC SIGNAL",
    "TRANSMISSION",
    "NULL",
    "ERROR",
    "RETRY",
    "48kHz",
    "CAM_02",
    "////",
    ">_<",
    "x_x",
    ": /",
    ":::",
    "NO SIGNAL",
    "BUFFER ERR",
    "SOURCE UNKNOWN"
  ];

  const pad = value => String(value).padStart(2, "0");

  function currentDateText() {
    const date = new Date();
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
  }

  function currentTimeText() {
    const date = new Date();
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function visitorCountryText() {
    try {
      const locale = new Intl.Locale(navigator.language || "en");
      const region = locale.region;
      if (region) {
        const names = new Intl.DisplayNames([navigator.language || "en"], { type: "region" });
        return String(names.of(region) || region).toUpperCase();
      }
    } catch (_) {}

    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const zoneCountry = {
      "Asia/Calcutta": "INDIA",
      "Asia/Kolkata": "INDIA",
      "Europe/London": "UNITED KINGDOM",
      "Europe/Vilnius": "LITHUANIA",
      "Europe/Moscow": "RUSSIA",
      "America/New_York": "USA",
      "America/Chicago": "USA",
      "America/Denver": "USA",
      "America/Los_Angeles": "USA"
    };
    return zoneCountry[zone] || zone.replaceAll("_", " ").toUpperCase() || "LOCATION UNKNOWN";
  }

  function randomFlashText() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const live = [
      currentDateText(),
      currentTimeText(),
      visitorCountryText(),
      timezone?.replaceAll("_", " ").toUpperCase()
    ].filter(Boolean);
    const pool = [...STATIC_FLASHES, ...live, ...live];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function installSignalStyles() {
    if (document.getElementById("the2ioSignalStyles")) return;

    const style = document.createElement("style");
    style.id = "the2ioSignalStyles";
    style.textContent = `
      .released-mini-wave{
        position:relative!important;
        height:64px!important;
        display:block!important;
        padding:0!important;
        overflow:hidden!important;
        isolation:isolate;
        border-bottom:1px solid var(--line);
        background:
          linear-gradient(rgba(222,221,212,.035) 1px,transparent 1px),
          linear-gradient(90deg,rgba(222,221,212,.035) 1px,transparent 1px);
        background-size:18px 18px;
      }
      .released-mini-wave::before{
        content:"";
        position:absolute;
        inset:0;
        z-index:0;
        background:linear-gradient(90deg,transparent,rgba(216,255,50,.025) 40%,rgba(216,255,50,.13) 50%,rgba(216,255,50,.025) 60%,transparent);
        transform:translateX(-120%);
        animation:the2ioWaveSweep 4.4s linear infinite;
        pointer-events:none;
      }
      .released-mini-wave::after{display:none!important}
      .released-mini-wave>i{display:none!important}
      .signal-svg{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        z-index:2;
        overflow:visible;
        opacity:1;
      }
      .wave-ribbon{
        fill:none;
        vector-effect:non-scaling-stroke;
        stroke-linecap:round;
        stroke-linejoin:round;
        transform-origin:center;
        mix-blend-mode:screen;
      }
      .wave-halo{
        stroke:rgba(216,255,50,.14);
        stroke-width:12;
        filter:blur(4px);
        opacity:.72;
      }
      .wave-band{
        stroke:rgba(216,255,50,.34);
        stroke-width:5;
        filter:blur(1.1px);
        opacity:.9;
      }
      .wave-core{
        stroke:var(--acid);
        stroke-width:1.65;
        opacity:1;
        filter:drop-shadow(0 0 2px rgba(216,255,50,.95)) drop-shadow(0 0 7px rgba(216,255,50,.54));
      }
      .wave-echo{
        stroke:rgba(238,255,177,.58);
        stroke-width:.8;
        opacity:.52;
        filter:drop-shadow(0 0 4px rgba(216,255,50,.34));
      }
      .signal-baseline{
        fill:none;
        stroke:rgba(222,221,212,.12);
        stroke-width:1;
        vector-effect:non-scaling-stroke;
      }
      .heartbeat-flash{
        position:absolute;
        z-index:7;
        inset:0;
        display:grid;
        place-items:center;
        padding:0 12px;
        color:var(--acid);
        background:rgba(7,7,7,.97);
        font:700 11px/1 var(--mono);
        letter-spacing:.16em;
        text-transform:uppercase;
        white-space:nowrap;
        opacity:0;
        visibility:hidden;
        pointer-events:none;
        text-shadow:2px 0 rgba(222,221,212,.2),-2px 0 rgba(216,255,50,.2),0 0 9px rgba(216,255,50,.34);
      }
      .heartbeat-flash::before,
      .heartbeat-flash::after{
        content:attr(data-text);
        position:absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        white-space:nowrap;
        opacity:0;
        pointer-events:none;
      }
      .heartbeat-flash::before{color:#deddd4}
      .heartbeat-flash::after{color:var(--acid)}

      .released-mini-wave.flash-glitch .signal-svg{
        animation:waveSignalExit .18s steps(2,end) forwards;
      }
      .released-mini-wave.flash-glitch::before{
        animation:waveScanBreak .18s steps(2,end) both;
      }
      .released-mini-wave.flash-active .signal-svg{
        opacity:0;
        visibility:hidden;
      }
      .released-mini-wave.flash-active::before{
        opacity:0;
        animation:none;
      }
      .released-mini-wave.flash-active .heartbeat-flash{
        opacity:1;
        visibility:visible;
        animation:waveTextReplace .72s steps(2,end) both;
      }
      .released-mini-wave.flash-active .heartbeat-flash::before{
        opacity:.42;
        animation:waveGhostA .72s steps(2,end) both;
      }
      .released-mini-wave.flash-active .heartbeat-flash::after{
        opacity:.36;
        animation:waveGhostB .72s steps(2,end) both;
      }
      .released-mini-wave.flash-return .signal-svg{
        animation:waveSignalReturn .2s steps(2,end) both;
      }
      .released-mini-wave.signal-boost .wave-core{
        stroke-width:2.15;
        filter:drop-shadow(0 0 3px rgba(216,255,50,1)) drop-shadow(0 0 10px rgba(216,255,50,.8));
      }
      .released-mini-wave.signal-boost .wave-band{opacity:1;stroke-width:6}

      @keyframes the2ioWaveSweep{
        to{transform:translateX(120%)}
      }
      @keyframes waveSignalExit{
        0%{transform:none;opacity:1;filter:none}
        25%{transform:translateX(-8px) scaleX(1.025);opacity:.78;filter:contrast(1.4)}
        52%{transform:translateX(12px) scaleY(.72);opacity:.32;filter:brightness(1.35)}
        76%{transform:translateX(-5px) scaleX(.94);opacity:.12}
        100%{transform:translateX(18px) scaleY(.22);opacity:0}
      }
      @keyframes waveSignalReturn{
        0%{transform:translateX(-16px) scaleY(.35);opacity:0}
        34%{transform:translateX(8px) scaleX(1.02);opacity:.45}
        68%{transform:translateX(-3px);opacity:.8}
        100%{transform:none;opacity:1}
      }
      @keyframes waveTextReplace{
        0%{transform:translateX(-5px);filter:contrast(1.7);letter-spacing:.2em}
        16%{transform:translateX(6px);filter:brightness(1.5);letter-spacing:.12em}
        30%{transform:translateX(-2px);filter:none;letter-spacing:.16em}
        72%{transform:none;filter:none;letter-spacing:.16em}
        88%{transform:translateX(2px);filter:brightness(1.25)}
        100%{transform:none;filter:none}
      }
      @keyframes waveGhostA{
        0%,100%{clip-path:inset(0 0 72% 0);transform:translate(calc(-50% - 4px),-50%)}
        34%{clip-path:inset(36% 0 38% 0);transform:translate(calc(-50% + 6px),-50%)}
        68%{clip-path:inset(72% 0 0 0);transform:translate(calc(-50% - 5px),-50%)}
      }
      @keyframes waveGhostB{
        0%,100%{clip-path:inset(68% 0 0 0);transform:translate(calc(-50% + 3px),-50%)}
        30%{clip-path:inset(12% 0 66% 0);transform:translate(calc(-50% - 6px),-50%)}
        64%{clip-path:inset(45% 0 31% 0);transform:translate(calc(-50% + 7px),-50%)}
      }
      @keyframes waveScanBreak{
        0%{transform:translateX(-70%);opacity:.1}
        45%{transform:translateX(18%);opacity:.38}
        100%{transform:translateX(70%);opacity:0}
      }
    `;
    document.head.appendChild(style);
  }

  function buildWaveformPath(time, phaseShift = 0, amplitudeScale = 1) {
    const baseline = 40;
    const points = 72;
    const t = time * 0.001;
    let d = "";

    for (let i = 0; i <= points; i += 1) {
      const x = (i / points) * 1000;
      const position = i / points;
      const envelope = 0.48 + 0.52 * (0.5 + 0.5 * Math.sin(position * Math.PI * 5.2 + t * .72));
      const primary = Math.sin(position * Math.PI * 15 + t * 5.1 + phaseShift) * 8.5;
      const secondary = Math.sin(position * Math.PI * 31 - t * 3.4 + phaseShift * .7) * 4.2;
      const detail = Math.sin(position * Math.PI * 57 + t * 7.4 + phaseShift * 1.2) * 1.8;
      const y = baseline + (primary + secondary + detail) * envelope * amplitudeScale;
      d += `${i === 0 ? "M" : " L"} ${x.toFixed(1)} ${y.toFixed(2)}`;
    }

    return d;
  }

  function setupSignal(monitor) {
    if (!monitor) return null;

    installSignalStyles();
    monitor.innerHTML = `
      <svg class="signal-svg" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
        <path class="signal-baseline" d="M0 40 L1000 40"></path>
        <path class="wave-ribbon wave-halo"></path>
        <path class="wave-ribbon wave-band"></path>
        <path class="wave-ribbon wave-echo"></path>
        <path class="wave-ribbon wave-core"></path>
      </svg>
      <span class="heartbeat-flash" data-text="" aria-hidden="true"></span>`;

    const halo = monitor.querySelector(".wave-halo");
    const band = monitor.querySelector(".wave-band");
    const echo = monitor.querySelector(".wave-echo");
    const core = monitor.querySelector(".wave-core");
    const flash = monitor.querySelector(".heartbeat-flash");
    let animationFrame;
    let cycleTimer;
    let replaceTimer;
    let returnTimer;

    const animateWave = time => {
      const mainPath = buildWaveformPath(time, 0, 1);
      halo.setAttribute("d", mainPath);
      band.setAttribute("d", mainPath);
      core.setAttribute("d", mainPath);
      echo.setAttribute("d", buildWaveformPath(time + 120, .85, .72));
      animationFrame = requestAnimationFrame(animateWave);
    };

    animationFrame = requestAnimationFrame(animateWave);

    const scheduleCycle = () => {
      window.clearTimeout(cycleTimer);
      cycleTimer = window.setTimeout(() => {
        const text = randomFlashText();
        flash.textContent = text;
        flash.dataset.text = text;

        monitor.classList.remove("flash-active", "flash-return");
        monitor.classList.add("flash-glitch");

        window.clearTimeout(replaceTimer);
        replaceTimer = window.setTimeout(() => {
          monitor.classList.remove("flash-glitch");
          monitor.classList.add("flash-active");

          window.clearTimeout(returnTimer);
          returnTimer = window.setTimeout(() => {
            monitor.classList.remove("flash-active");
            monitor.classList.add("flash-return");

            window.setTimeout(() => monitor.classList.remove("flash-return"), 210);
            scheduleCycle();
          }, 720);
        }, 180);
      }, 5000);
    };

    scheduleCycle();

    return {
      kick() {
        if (monitor.classList.contains("flash-active") || monitor.classList.contains("flash-glitch")) return;
        monitor.classList.remove("signal-boost");
        void monitor.offsetWidth;
        monitor.classList.add("signal-boost");
        window.clearTimeout(this.kickTimer);
        this.kickTimer = window.setTimeout(() => monitor.classList.remove("signal-boost"), 680);
      },
      destroy() {
        cancelAnimationFrame(animationFrame);
        window.clearTimeout(cycleTimer);
        window.clearTimeout(replaceTimer);
        window.clearTimeout(returnTimer);
      }
    };
  }

  function render(data) {
    const release = (data.releases || [])[0];
    const tracks = (data.tracks || []).filter(track =>
      !release || !track.release_id || track.release_id === release.id
    );

    const rows = document.getElementById("miniTrackRows");
    const player = document.getElementById("miniSpotifyPlayer");
    const now = document.getElementById("miniSpotifyNow");
    const artistLink = document.getElementById("miniSpotifyArtistLink");
    const monitor = document.querySelector(".released-mini-wave");

    if (!rows || !player || !now || !artistLink) return;

    const signal = setupSignal(monitor);
    artistLink.href = data.settings?.spotify_artist_url || artistLink.href;
    rows.innerHTML = "";

    if (!tracks.length) {
      const empty = document.createElement("div");
      empty.className = "mini-track-row";
      empty.innerHTML = `
        <span class="mini-track-num">000</span>
        <span class="mini-track-name">No release loaded</span>
        <span class="mini-track-action">STANDBY</span>`;
      rows.appendChild(empty);
      now.textContent = "SOURCE_000 // STANDBY";
      player.removeAttribute("src");
      return;
    }

    tracks.forEach((track, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `mini-track-row${index === 0 ? " active" : ""}`;
      button.dataset.track = spotifyId(track.spotify_track_uri || track.spotify_url);
      button.dataset.name = track.title || `TRACK ${index + 1}`;
      button.innerHTML = `
        <span class="mini-track-num">${String(index + 1).padStart(3, "0")}</span>
        <span class="mini-track-name">${track.title || "UNTITLED"}</span>
        <span class="mini-track-action">PLAY</span>`;
      rows.appendChild(button);
    });

    function select(button, index) {
      rows.querySelectorAll(".mini-track-row").forEach(row => row.classList.remove("active"));
      button.classList.add("active");
      const id = button.dataset.track;
      if (id) player.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
      now.textContent = `SOURCE_${String(index + 1).padStart(3, "0")} // ${button.dataset.name.toUpperCase()}`;
      signal?.kick();
    }

    [...rows.querySelectorAll(".mini-track-row")].forEach((button, index) => {
      button.addEventListener("click", () => select(button, index));
    });

    const first = rows.querySelector(".mini-track-row");
    if (first) select(first, 0);
  }

  window.The2iOMusic = { render };
})();
