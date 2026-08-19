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

  function installHeartbeatStyles() {
    if (document.getElementById("the2ioHeartbeatStyles")) return;

    const style = document.createElement("style");
    style.id = "the2ioHeartbeatStyles";
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
        background:linear-gradient(90deg,transparent,rgba(216,255,50,.035) 44%,rgba(216,255,50,.11) 50%,rgba(216,255,50,.035) 56%,transparent);
        transform:translateX(-115%);
        animation:the2ioSweep 3.6s linear infinite;
        pointer-events:none;
      }
      .released-mini-wave::after{display:none!important}
      .released-mini-wave>i{display:none!important}
      .pulse-svg{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        z-index:2;
        overflow:visible;
        opacity:1;
        filter:drop-shadow(0 0 3px rgba(216,255,50,.34));
      }
      .pulse-trace{
        fill:none;
        stroke:var(--acid);
        stroke-width:1.45;
        vector-effect:non-scaling-stroke;
        stroke-linecap:square;
        stroke-linejoin:miter;
        opacity:.94;
      }
      .pulse-baseline{
        fill:none;
        stroke:rgba(222,221,212,.16);
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
        background:rgba(7,7,7,.96);
        font:700 11px/1 var(--mono);
        letter-spacing:.16em;
        text-transform:uppercase;
        white-space:nowrap;
        opacity:0;
        visibility:hidden;
        pointer-events:none;
        text-shadow:2px 0 rgba(222,221,212,.2),-2px 0 rgba(216,255,50,.2);
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

      .released-mini-wave.flash-glitch .pulse-svg{
        animation:heartbeatSignalExit .16s steps(2,end) forwards;
      }
      .released-mini-wave.flash-glitch::before{
        animation:heartbeatScanBreak .16s steps(2,end) both;
      }
      .released-mini-wave.flash-active .pulse-svg{
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
        animation:heartbeatTextReplace .7s steps(2,end) both;
      }
      .released-mini-wave.flash-active .heartbeat-flash::before{
        opacity:.42;
        animation:heartbeatGhostA .7s steps(2,end) both;
      }
      .released-mini-wave.flash-active .heartbeat-flash::after{
        opacity:.36;
        animation:heartbeatGhostB .7s steps(2,end) both;
      }
      .released-mini-wave.flash-return .pulse-svg{
        animation:heartbeatSignalReturn .18s steps(2,end) both;
      }
      .released-mini-wave.track-pulse .pulse-trace{
        stroke-width:2;
        opacity:1;
        filter:drop-shadow(0 0 5px rgba(216,255,50,.7));
      }

      @keyframes the2ioSweep{
        to{transform:translateX(115%)}
      }
      @keyframes heartbeatSignalExit{
        0%{transform:none;opacity:1}
        28%{transform:translateX(-8px) scaleX(1.02);opacity:.72}
        52%{transform:translateX(11px) scaleY(.82);opacity:.28}
        76%{transform:translateX(-4px) scaleX(.96);opacity:.12}
        100%{transform:translateX(18px) scaleY(.35);opacity:0}
      }
      @keyframes heartbeatSignalReturn{
        0%{transform:translateX(-14px) scaleY(.45);opacity:0}
        35%{transform:translateX(7px) scaleX(1.018);opacity:.42}
        68%{transform:translateX(-3px);opacity:.78}
        100%{transform:none;opacity:1}
      }
      @keyframes heartbeatTextReplace{
        0%{transform:translateX(-5px);filter:contrast(1.7);letter-spacing:.2em}
        16%{transform:translateX(6px);filter:brightness(1.5);letter-spacing:.12em}
        30%{transform:translateX(-2px);filter:none;letter-spacing:.16em}
        72%{transform:none;filter:none;letter-spacing:.16em}
        88%{transform:translateX(2px);filter:brightness(1.25)}
        100%{transform:none;filter:none}
      }
      @keyframes heartbeatGhostA{
        0%,100%{clip-path:inset(0 0 72% 0);transform:translate(calc(-50% - 4px),-50%)}
        34%{clip-path:inset(36% 0 38% 0);transform:translate(calc(-50% + 6px),-50%)}
        68%{clip-path:inset(72% 0 0 0);transform:translate(calc(-50% - 5px),-50%)}
      }
      @keyframes heartbeatGhostB{
        0%,100%{clip-path:inset(68% 0 0 0);transform:translate(calc(-50% + 3px),-50%)}
        30%{clip-path:inset(12% 0 66% 0);transform:translate(calc(-50% - 6px),-50%)}
        64%{clip-path:inset(45% 0 31% 0);transform:translate(calc(-50% + 7px),-50%)}
      }
      @keyframes heartbeatScanBreak{
        0%{transform:translateX(-70%);opacity:.1}
        45%{transform:translateX(18%);opacity:.38}
        100%{transform:translateX(70%);opacity:0}
      }
    `;
    document.head.appendChild(style);
  }

  function buildHeartbeatPath() {
    const baseline = 40;
    let x = 0;
    let d = `M 0 ${baseline}`;

    while (x < 1000) {
      const idle = 52 + Math.random() * 72;
      const start = Math.min(1000, x + idle);
      d += ` L ${start.toFixed(1)} ${baseline}`;
      if (start >= 985) break;

      const peak = 6 + Math.random() * 11;
      const trough = 60 + Math.random() * 13;
      const shoulder = baseline - (4 + Math.random() * 6);
      const dip = baseline + (5 + Math.random() * 8);

      d += ` L ${(start + 8).toFixed(1)} ${baseline}`;
      d += ` L ${(start + 15).toFixed(1)} ${shoulder.toFixed(1)}`;
      d += ` L ${(start + 23).toFixed(1)} ${dip.toFixed(1)}`;
      d += ` L ${(start + 31).toFixed(1)} ${peak.toFixed(1)}`;
      d += ` L ${(start + 42).toFixed(1)} ${trough.toFixed(1)}`;
      d += ` L ${(start + 54).toFixed(1)} ${(baseline - 3 - Math.random() * 4).toFixed(1)}`;
      d += ` L ${(start + 68).toFixed(1)} ${baseline}`;

      x = start + 68 + Math.random() * 70;
    }

    return `${d} L 1000 ${baseline}`;
  }

  function setupHeartbeat(monitor) {
    if (!monitor) return null;

    installHeartbeatStyles();
    monitor.innerHTML = `
      <svg class="pulse-svg" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
        <path class="pulse-baseline" d="M0 40 L1000 40"></path>
        <path class="pulse-trace"></path>
      </svg>
      <span class="heartbeat-flash" data-text="" aria-hidden="true"></span>`;

    const trace = monitor.querySelector(".pulse-trace");
    const flash = monitor.querySelector(".heartbeat-flash");
    let pulseTimer;
    let cycleTimer;
    let replaceTimer;
    let returnTimer;

    const refreshPulse = () => {
      trace.setAttribute("d", buildHeartbeatPath());
      window.clearTimeout(pulseTimer);
      pulseTimer = window.setTimeout(refreshPulse, 900 + Math.random() * 700);
    };

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
            trace.setAttribute("d", buildHeartbeatPath());

            window.setTimeout(() => monitor.classList.remove("flash-return"), 190);
            scheduleCycle();
          }, 700);
        }, 160);
      }, 3000);
    };

    refreshPulse();
    scheduleCycle();

    return {
      kick() {
        if (monitor.classList.contains("flash-active") || monitor.classList.contains("flash-glitch")) return;
        monitor.classList.remove("track-pulse");
        void monitor.offsetWidth;
        monitor.classList.add("track-pulse");
        trace.setAttribute("d", buildHeartbeatPath());
        window.clearTimeout(this.kickTimer);
        this.kickTimer = window.setTimeout(() => monitor.classList.remove("track-pulse"), 620);
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

    const heartbeat = setupHeartbeat(monitor);
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
      heartbeat?.kick();
    }

    [...rows.querySelectorAll(".mini-track-row")].forEach((button, index) => {
      button.addEventListener("click", () => select(button, index));
    });

    const first = rows.querySelector(".mini-track-row");
    if (first) select(first, 0);
  }

  window.The2iOMusic = { render };
})();
