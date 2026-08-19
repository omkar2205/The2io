(() => {
  const spotifyId = value => {
    const text = String(value || "");
    const uri = text.match(/spotify:track:([A-Za-z0-9]+)/);
    if (uri) return uri[1];
    const url = text.match(/open\.spotify\.com\/track\/([A-Za-z0-9]+)/);
    return url ? url[1] : text;
  };

  function splitTitle(title) {
    const words = String(title || "UNTITLED").trim().split(/\s+/);
    if (words.length === 1) return `${words[0]}<br><span></span>`;
    return `${words.slice(0, -1).join(" ")}<br><span>${words.at(-1)}</span>`;
  }

  function render(data) {
    const release = (data.releases || [])[0];
    const tracks = (data.tracks || []).filter(track => !release || !track.release_id || track.release_id === release.id);
    const title = release?.title || "Faded Horizons";
    document.getElementById("releaseTitle").innerHTML = splitTitle(title);
    document.getElementById("releaseTrackCount").textContent = `${tracks.length} TRACK${tracks.length === 1 ? "" : "S"}`;

    const rows = document.getElementById("trackRows");
    rows.innerHTML = "";
    tracks.forEach((track, index) => {
      const button = document.createElement("button");
      button.className = `track-row${index === 0 ? " active" : ""}`;
      button.type = "button";
      button.dataset.track = spotifyId(track.spotify_track_uri || track.spotify_url);
      button.dataset.name = track.title || `TRACK ${index + 1}`;
      button.innerHTML = `
        <span class="track-num">${String(index + 1).padStart(3, "0")}</span>
        <span class="track-name">${track.title || "UNTITLED"}</span>
        <span class="track-action">PLAY SOURCE</span>`;
      rows.appendChild(button);
    });

    const player = document.getElementById("spotifyPlayer");
    const now = document.getElementById("spotifyNow");
    const artistLink = document.getElementById("spotifyArtistLink");
    artistLink.href = data.settings?.spotify_artist_url || artistLink.href;

    function select(button, index) {
      rows.querySelectorAll(".track-row").forEach(row => row.classList.remove("active"));
      button.classList.add("active");
      const id = button.dataset.track;
      if (id) player.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
      now.textContent = `SOURCE_${String(index + 1).padStart(3, "0")} // ${button.dataset.name.toUpperCase()}`;
    }

    [...rows.querySelectorAll(".track-row")].forEach((button, index) => {
      button.addEventListener("click", () => select(button, index));
    });

    const first = rows.querySelector(".track-row");
    if (first) select(first, 0);
  }

  window.The2ioMusic = { render };
})();