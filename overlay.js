// ============================================================================
// 🔥 OBS BREAKING NEWS OVERLAY - ORTAK FIREBASE DİNLEYİCİ MOTORU
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

  let lastAlertTimestamp = 0;
  let lastUpdateTimestamp = 0;
  let isFirstLoad = true;

  // Audio Synthesizer (Web Audio API - Breaking News Alert Chime)
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
      const freqs = [587.33, 880.0, 1174.66]; // D5, A5, D6
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
    void flashEffect.offsetWidth; // force reflow
    flashEffect.classList.add('active');
    playBreakingNewsSound();
  }

  // Smooth Marquee Loop Engine
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

  function applyState(newState) {
    if (!newState) return;
    const prevText = state.tickerText;
    Object.assign(state, newState);

    if (breakingBadgeText) breakingBadgeText.textContent = state.badgeText || "SON DAKİKA";
    if (categoryText) categoryText.textContent = state.categoryText || "KNGL HABER MERKEZİ";

    // Animated Show / Hide
    if (newsBarWrapper) {
      if (state.visible === true || state.visible === "true") {
        newsBarWrapper.classList.remove('hidden');
      } else {
        newsBarWrapper.classList.add('hidden');
      }
    }

    if (liveClockBadge) {
      if (state.showClock) {
        liveClockBadge.style.display = 'block';
      } else {
        liveClockBadge.style.display = 'none';
      }
    }

    // Logo: image_3bb46a.png in root folder
    if (kangalEmblem) {
      if (state.logoType === 'custom' && state.customLogoUrl) {
        kangalEmblem.src = state.customLogoUrl;
      } else {
        kangalEmblem.src = 'image_3bb46a.png';
      }
    }

    document.body.className = state.theme || 'theme-red';

    // Rebuild Ticker if text changed
    if (prevText !== state.tickerText || isFirstLoad) {
      setupTicker();
    }

    // Check for alerts triggered
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

  // ============================================================================
  // 🔥 FIREBASE REALTIME DATABASE SYNC (ZORUNLU ORTAK DOSYADAN OKUR)
  // ============================================================================
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
            console.log('📡 [OBS Overlay] Firebase verisi alındı:', val);
            applyState(val);
          }
        });
        console.log('✅ [OBS Overlay] Firebase bağlantısı kuruldu.');
      } catch (e) {
        console.error('[OBS Overlay] Firebase başlatma hatası:', e);
      }
    } else {
      console.warn('⚠️ [OBS Overlay] Firebase ayarları yapılmamış! Lütfen firebase-config.js dosyasını doldurunuz.');
    }
  }

  // Startup
  setupTicker();
  startMarqueeLoop();
  initFirebaseOverlay();

})();