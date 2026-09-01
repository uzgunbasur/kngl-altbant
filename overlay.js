// ============================================================================
// 🔥 OBS BREAKING NEWS OVERLAY - WITH 81 CITIES WEATHER & FINANCE MODULES
// ============================================================================
(function() {
  const state = {
    badgeText: "SON DAKİKA",
    categoryText: "KNGL HABER MERKEZİ",
    tickerText: "KICK CANLI YAYININA HOŞ GELDİNİZ! ++ TAKİP ETMEYİ VE BİLDİRİMLERİ AÇMAYI UNUTMAYIN!",
    speed: 60,
    theme: "theme-red",
    visible: true,
    showClock: true,
    soundEnabled: true,
    showWeather: true,
    showFinance: true,
    logoType: "kangal",
    customLogoUrl: ""
  };

  const newsBarWrapper = document.getElementById('news-bar-wrapper');
  const flashEffect = document.getElementById('flash-effect');
  const breakingBadgeText = document.getElementById('breaking-badge-text');
  const categoryText = document.getElementById('category-text');
  const clockDisplay = document.getElementById('clock-display');
  const liveClockBadge = document.getElementById('live-clock-badge');
  const kangalEmblem = document.getElementById('kangal-emblem');
  const tickerViewport = document.getElementById('ticker-viewport');
  const tickerTrack = document.getElementById('ticker-track');

  // Side Modules Elements
  const weatherModule = document.getElementById('weather-module');
  const financeModule = document.getElementById('finance-module');
  const weatherCarouselSlot = document.getElementById('weather-carousel-slot');
  const weatherCity = document.getElementById('weather-city');
  const weatherTemp = document.getElementById('weather-temp');
  const weatherIcon = document.getElementById('weather-icon');

  const financeCarouselSlot = document.getElementById('finance-carousel-slot');
  const financeName = document.getElementById('finance-name');
  const financeVal = document.getElementById('finance-val');
  const financeIcon = document.getElementById('finance-icon');

  let lastAlertTimestamp = 0;
  let lastUpdateTimestamp = 0;
  let isFirstLoad = true;

  // ===================================================
  // 1. TURKEY 81 CITIES OPEN-METEO WEATHER ENGINE
  // ===================================================
  const TURKISH_CITIES = [
    { name: "ADANA", lat: 37.00, lon: 35.32, temp: 27, code: 0 },
    { name: "ADIYAMAN", lat: 37.76, lon: 38.27, temp: 25, code: 0 },
    { name: "AFYON", lat: 38.75, lon: 30.54, temp: 21, code: 1 },
    { name: "AĞRI", lat: 39.72, lon: 43.05, temp: 18, code: 2 },
    { name: "AMASYA", lat: 40.65, lon: 35.83, temp: 22, code: 1 },
    { name: "ANKARA", lat: 39.93, lon: 32.85, temp: 22, code: 0 },
    { name: "ANTALYA", lat: 36.88, lon: 30.70, temp: 29, code: 0 },
    { name: "ARTVİN", lat: 41.18, lon: 41.82, temp: 20, code: 61 },
    { name: "AYDIN", lat: 37.84, lon: 27.84, temp: 28, code: 0 },
    { name: "BALIKESİR", lat: 39.65, lon: 27.88, temp: 23, code: 1 },
    { name: "BİLECİK", lat: 40.14, lon: 29.98, temp: 21, code: 1 },
    { name: "BİNGÖL", lat: 38.88, lon: 40.49, temp: 24, code: 0 },
    { name: "BİTLİS", lat: 38.40, lon: 42.10, temp: 19, code: 2 },
    { name: "BOLU", lat: 40.73, lon: 31.60, temp: 19, code: 1 },
    { name: "BURDUR", lat: 37.72, lon: 30.29, temp: 23, code: 0 },
    { name: "BURSA", lat: 40.18, lon: 29.06, temp: 24, code: 0 },
    { name: "ÇANAKKALE", lat: 40.15, lon: 26.41, temp: 23, code: 1 },
    { name: "ÇANKIRI", lat: 40.60, lon: 33.61, temp: 21, code: 0 },
    { name: "ÇORUM", lat: 40.55, lon: 34.95, temp: 20, code: 1 },
    { name: "DENİZLİ", lat: 37.77, lon: 29.08, temp: 27, code: 0 },
    { name: "DİYARBAKIR", lat: 37.91, lon: 40.24, temp: 28, code: 0 },
    { name: "EDİRNE", lat: 41.67, lon: 26.55, temp: 24, code: 1 },
    { name: "ELAZIĞ", lat: 38.68, lon: 39.22, temp: 24, code: 0 },
    { name: "ERZİNCAN", lat: 39.75, lon: 39.49, temp: 21, code: 1 },
    { name: "ERZURUM", lat: 39.90, lon: 41.27, temp: 17, code: 2 },
    { name: "ESKİŞEHİR", lat: 39.77, lon: 30.52, temp: 22, code: 0 },
    { name: "GAZİANTEP", lat: 37.06, lon: 37.38, temp: 26, code: 0 },
    { name: "GİRESUN", lat: 40.91, lon: 38.38, temp: 22, code: 61 },
    { name: "GÜMÜŞHANE", lat: 40.46, lon: 39.47, temp: 19, code: 1 },
    { name: "HAKKARİ", lat: 37.58, lon: 43.73, temp: 20, code: 0 },
    { name: "HATAY", lat: 36.20, lon: 36.16, temp: 27, code: 0 },
    { name: "ISPARTA", lat: 37.76, lon: 30.55, temp: 22, code: 0 },
    { name: "MERSİN", lat: 36.80, lon: 34.63, temp: 28, code: 0 },
    { name: "İSTANBUL", lat: 41.01, lon: 28.97, temp: 23, code: 0 },
    { name: "İZMİR", lat: 38.42, lon: 27.14, temp: 28, code: 0 },
    { name: "KARS", lat: 40.61, lon: 43.10, temp: 16, code: 2 },
    { name: "KASTAMONU", lat: 41.38, lon: 33.78, temp: 19, code: 1 },
    { name: "KAYSERİ", lat: 38.73, lon: 35.48, temp: 22, code: 0 },
    { name: "KIRKLARELİ", lat: 41.73, lon: 27.22, temp: 23, code: 1 },
    { name: "KIRŞEHİR", lat: 39.14, lon: 34.17, temp: 21, code: 0 },
    { name: "KOCAELİ", lat: 40.76, lon: 29.92, temp: 23, code: 0 },
    { name: "KONYA", lat: 37.87, lon: 32.48, temp: 23, code: 0 },
    { name: "KÜTAHYA", lat: 39.42, lon: 29.98, temp: 20, code: 1 },
    { name: "MALATYA", lat: 38.35, lon: 38.31, temp: 25, code: 0 },
    { name: "MANİSA", lat: 38.61, lon: 27.42, temp: 28, code: 0 },
    { name: "K.MARAŞ", lat: 37.58, lon: 36.93, temp: 26, code: 0 },
    { name: "MARDİN", lat: 37.32, lon: 40.74, temp: 27, code: 0 },
    { name: "MUĞLA", lat: 37.21, lon: 28.36, temp: 27, code: 0 },
    { name: "MUŞ", lat: 38.74, lon: 41.49, temp: 20, code: 1 },
    { name: "NEVŞEHİR", lat: 38.62, lon: 34.71, temp: 21, code: 0 },
    { name: "NİĞDE", lat: 37.96, lon: 34.68, temp: 21, code: 0 },
    { name: "ORDU", lat: 40.98, lon: 37.87, temp: 22, code: 61 },
    { name: "RİZE", lat: 41.02, lon: 40.52, temp: 21, code: 61 },
    { name: "SAKARYA", lat: 40.77, lon: 30.40, temp: 23, code: 0 },
    { name: "SAMSUN", lat: 41.28, lon: 36.33, temp: 22, code: 1 },
    { name: "SİİRT", lat: 37.93, lon: 41.94, temp: 26, code: 0 },
    { name: "SİNOP", lat: 42.02, lon: 35.15, temp: 21, code: 1 },
    { name: "SİVAS", lat: 39.75, lon: 37.01, temp: 19, code: 0 },
    { name: "TEKİRDAĞ", lat: 40.98, lon: 27.51, temp: 23, code: 1 },
    { name: "TOKAT", lat: 40.31, lon: 36.55, temp: 21, code: 1 },
    { name: "TRABZON", lat: 41.00, lon: 39.72, temp: 22, code: 61 },
    { name: "TUNCELİ", lat: 39.10, lon: 39.54, temp: 23, code: 0 },
    { name: "ŞANLIURFA", lat: 37.16, lon: 38.79, temp: 29, code: 0 },
    { name: "UŞAK", lat: 38.68, lon: 29.40, temp: 22, code: 0 },
    { name: "VAN", lat: 38.49, lon: 43.38, temp: 18, code: 2 },
    { name: "YOZGAT", lat: 39.81, lon: 34.80, temp: 19, code: 0 },
    { name: "ZONGULDAK", lat: 41.45, lon: 31.79, temp: 21, code: 1 },
    { name: "AKSARAY", lat: 38.36, lon: 34.03, temp: 22, code: 0 },
    { name: "BAYBURT", lat: 40.25, lon: 40.22, temp: 18, code: 1 },
    { name: "KARAMAN", lat: 37.17, lon: 33.22, temp: 22, code: 0 },
    { name: "KIRIKKALE", lat: 39.84, lon: 33.51, temp: 22, code: 0 },
    { name: "BATMAN", lat: 37.88, lon: 41.13, temp: 27, code: 0 },
    { name: "ŞIRNAK", lat: 37.52, lon: 42.45, temp: 25, code: 0 },
    { name: "BARTIN", lat: 41.63, lon: 32.33, temp: 21, code: 1 },
    { name: "ARDAHAN", lat: 41.11, lon: 42.70, temp: 15, code: 2 },
    { name: "IĞDIR", lat: 39.92, lon: 44.04, temp: 23, code: 0 },
    { name: "YALOVA", lat: 40.65, lon: 29.27, temp: 23, code: 0 },
    { name: "KARABÜK", lat: 41.20, lon: 32.62, temp: 21, code: 1 },
    { name: "KİLİS", lat: 36.71, lon: 37.11, temp: 27, code: 0 },
    { name: "OSMANİYE", lat: 37.07, lon: 36.24, temp: 27, code: 0 },
    { name: "DÜZCE", lat: 40.84, lon: 31.16, temp: 22, code: 0 }
  ];

  function getWeatherEmoji(code) {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '🌤️';
    if (code === 3) return '⛅';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '⛅';
  }

  // Fetch real Open-Meteo multi-location weather in a single batch
  function fetchLiveWeatherData() {
    const lats = TURKISH_CITIES.map(c => c.lat).join(',');
    const lons = TURKISH_CITIES.map(c => c.lon).join(',');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          data.forEach((item, index) => {
            if (item && item.current_weather && TURKISH_CITIES[index]) {
              TURKISH_CITIES[index].temp = Math.round(item.current_weather.temperature);
              TURKISH_CITIES[index].code = item.current_weather.weathercode;
            }
          });
          console.log('✅ [Weather] 81 İl Hava Durumu Güncellendi.');
        }
      })
      .catch(err => {
        console.warn('Weather API failed, using cached values:', err);
      });
  }

  // Weather Carousel Loop (3 Seconds Interval)
  let currentWeatherIndex = 0;
  function rotateWeather() {
    if (!state.showWeather || !weatherCarouselSlot) return;

    const cityData = TURKISH_CITIES[currentWeatherIndex];
    currentWeatherIndex = (currentWeatherIndex + 1) % TURKISH_CITIES.length;

    // Slide out animation
    weatherCarouselSlot.classList.add('slide-out');

    setTimeout(() => {
      weatherCity.textContent = cityData.name;
      weatherTemp.textContent = `${cityData.temp}°C`;
      weatherIcon.textContent = getWeatherEmoji(cityData.code);

      weatherCarouselSlot.classList.remove('slide-out');
      weatherCarouselSlot.classList.add('slide-in');

      requestAnimationFrame(() => {
        weatherCarouselSlot.classList.remove('slide-in');
      });
    }, 350);
  }

  // ===================================================
  // 2. FINANCE & MARKETS ROTATOR ENGINE
  // ===================================================
  const FINANCE_ITEMS = [
    { name: "USD/TRY", val: "34.12 ₺", icon: "📈" },
    { name: "EUR/TRY", val: "37.85 ₺", icon: "📈" },
    { name: "ALTIN", val: "2.890 ₺", icon: "🥇" },
    { name: "BIST 100", val: "9.850", icon: "📊" },
    { name: "BTC/USD", val: "$64.200", icon: "⚡" },
    { name: "GBP/TRY", val: "44.90 ₺", icon: "💷" }
  ];

  function fetchLiveFinanceData() {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.TRY) {
          const usdTry = data.rates.TRY;
          const eurUsd = data.rates.EUR || 0.9;
          const gbpUsd = data.rates.GBP || 0.76;
          const eurTry = usdTry / eurUsd;
          const gbpTry = usdTry / gbpUsd;

          FINANCE_ITEMS[0].val = usdTry.toFixed(2) + " ₺";
          FINANCE_ITEMS[1].val = eurTry.toFixed(2) + " ₺";
          FINANCE_ITEMS[5].val = gbpTry.toFixed(2) + " ₺";
          console.log('✅ [Finance] Döviz kurları güncellendi.');
        }
      })
      .catch(err => {
        console.warn('Finance API fallback in effect:', err);
      });
  }

  let currentFinanceIndex = 0;
  function rotateFinance() {
    if (!state.showFinance || !financeCarouselSlot) return;

    const item = FINANCE_ITEMS[currentFinanceIndex];
    currentFinanceIndex = (currentFinanceIndex + 1) % FINANCE_ITEMS.length;

    // Slide out animation
    financeCarouselSlot.classList.add('slide-out');

    setTimeout(() => {
      financeName.textContent = item.name;
      financeVal.textContent = item.val;
      financeIcon.textContent = item.icon;

      financeCarouselSlot.classList.remove('slide-out');
      financeCarouselSlot.classList.add('slide-in');

      requestAnimationFrame(() => {
        financeCarouselSlot.classList.remove('slide-in');
      });
    }, 350);
  }

  // Start 3-second carousels
  setInterval(rotateWeather, 3000);
  setInterval(rotateFinance, 3000);
  fetchLiveWeatherData();
  fetchLiveFinanceData();
  // Refresh weather every 15 minutes, finance every 60 seconds
  setInterval(fetchLiveWeatherData, 15 * 60 * 1000);
  setInterval(fetchLiveFinanceData, 60 * 1000);

  // ===================================================
  // 3. AUDIO ALERT SYNTHESIZER
  // ===================================================
  let audioCtx = null;
  function playBreakingNewsSound() {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const freqs = [587.33, 880.0, 1174.66];
      freqs.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = i === 1 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        
        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.55);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.6);
      });
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  }

  function triggerVisualAndAudioAlert() {
    if (!flashEffect) return;
    flashEffect.classList.remove('active');
    void flashEffect.offsetWidth;
    flashEffect.classList.add('active');
    playBreakingNewsSound();
  }

  // ===================================================
  // 4. SMOOTH MARQUEE ENGINE (CONTAINED IN VIEWPORT)
  // ===================================================
  let animationFrameId = null;
  let currentOffset = 0;
  let lastFrameTime = performance.now();
  let contentWidth = 0;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function buildTickerHTML(text) {
    if (!text || text.trim() === '') return '<span class="ticker-item">...</span>';
    const parts = text.split(/\+\+/g).map(s => s.trim()).filter(s => s.length > 0);
    if (parts.length === 0) return `<span class="ticker-item">${escapeHtml(text)}</span>`;

    return parts.map(part => {
      return `<span class="ticker-item">${escapeHtml(part)}</span><span class="ticker-separator">✦ ✦</span>`;
    }).join('');
  }

  function setupTicker() {
    if (!tickerTrack) return;
    const rawHtml = buildTickerHTML(state.tickerText);
    
    tickerTrack.innerHTML = `
      <div class="ticker-content" id="ticker-chunk-1">${rawHtml}</div>
      <div class="ticker-content" id="ticker-chunk-2">${rawHtml}</div>
    `;

    requestAnimationFrame(() => {
      const chunk1 = document.getElementById('ticker-chunk-1');
      if (chunk1) {
        contentWidth = chunk1.offsetWidth;
      }
      currentOffset = 0;
    });
  }

  function startMarqueeLoop() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    lastFrameTime = performance.now();

    function step(timestamp) {
      const delta = (timestamp - lastFrameTime) / 1000;
      lastFrameTime = timestamp;

      const pxPerSec = Number(state.speed) * 2.2;
      currentOffset += pxPerSec * delta;

      if (contentWidth > 0 && currentOffset >= contentWidth) {
        currentOffset = currentOffset % contentWidth;
      }

      if (tickerTrack) {
        tickerTrack.style.transform = `translate3d(-${currentOffset}px, 0, 0)`;
      }
      animationFrameId = requestAnimationFrame(step);
    }

    animationFrameId = requestAnimationFrame(step);
  }

  // ===================================================
  // 5. APPLY STATE (FIREBASE SYNC)
  // ===================================================
  function applyState(newState) {
    if (!newState) return;
    const prevText = state.tickerText;
    const prevWeather = state.showWeather;
    const prevFinance = state.showFinance;

    Object.assign(state, newState);

    if (breakingBadgeText) breakingBadgeText.textContent = state.badgeText || "SON DAKİKA";
    if (categoryText) categoryText.textContent = state.categoryText || "KNGL HABER MERKEZİ";

    // Visibility toggle
    if (newsBarWrapper) {
      if (state.visible === true || state.visible === "true") {
        newsBarWrapper.classList.remove('hidden');
      } else {
        newsBarWrapper.classList.add('hidden');
      }
    }

    if (liveClockBadge) {
      liveClockBadge.style.display = state.showClock ? 'block' : 'none';
    }

    // Weather & Finance Modules Visibility
    if (weatherModule) {
      if (state.showWeather !== false) {
        weatherModule.classList.remove('hidden');
      } else {
        weatherModule.classList.add('hidden');
      }
    }

    if (financeModule) {
      if (state.showFinance !== false) {
        financeModule.classList.remove('hidden');
      } else {
        financeModule.classList.add('hidden');
      }
    }

    if (kangalEmblem) {
      if (state.logoType === 'custom' && state.customLogoUrl) {
        kangalEmblem.src = state.customLogoUrl;
      } else {
        kangalEmblem.src = 'image_3bb46a.png';
      }
    }

    document.body.className = state.theme || 'theme-red';

    // Rebuild Ticker if text or layout changed
    if (prevText !== state.tickerText || prevWeather !== state.showWeather || prevFinance !== state.showFinance || isFirstLoad) {
      setupTicker();
    }

    // Alert check
    if (!isFirstLoad) {
      if (newState.alertTimestamp && newState.alertTimestamp !== lastAlertTimestamp) {
        lastAlertTimestamp = newState.alertTimestamp;
        triggerVisualAndAudioAlert();
      } else if (newState.lastUpdateTimestamp && newState.lastUpdateTimestamp !== lastUpdateTimestamp && prevText !== state.tickerText) {
        lastUpdateTimestamp = newState.lastUpdateTimestamp;
        triggerVisualAndAudioAlert();
      }
    } else {
      if (newState.alertTimestamp) lastAlertTimestamp = newState.alertTimestamp;
      if (newState.lastUpdateTimestamp) lastUpdateTimestamp = newState.lastUpdateTimestamp;
      isFirstLoad = false;
    }
  }

  // Live Digital Clock
  function updateClock() {
    if (!clockDisplay) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockDisplay.textContent = `${h}:${m}:${s}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  window.addEventListener('resize', () => {
    setupTicker();
  });

  // ===================================================
  // 🔥 FIREBASE REALTIME LISTENER
  // ===================================================
  function initFirebaseOverlay() {
    const cfg = window.FIREBASE_CONFIG;
    
    if (cfg && cfg.databaseURL && !cfg.databaseURL.includes('PROJE_ID')) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(cfg);
        }
        const db = firebase.database();
        const newsRef = db.ref('kngl_breaking_news');

        newsRef.on('value', snap => {
          const val = snap.val();
          if (val) {
            applyState(val);
          }
        });
        console.log('✅ [OBS Overlay] Firebase bağlantısı kuruldu.');
      } catch (e) {
        console.error('[OBS Overlay] Firebase başlatma hatası:', e);
      }
    }
  }

  // Startup
  setupTicker();
  startMarqueeLoop();
  initFirebaseOverlay();

})();