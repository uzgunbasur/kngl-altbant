// ============================================================================
// 🔥 KNGL CONTROL PANEL - USERNAME AUTH & REALTIME MODULES SYNC
// ============================================================================
(function() {
  // Auth Screen Elements
  const authScreen = document.getElementById('auth-screen');
  const appContainer = document.getElementById('app-container');
  const loginForm = document.getElementById('login-form');
  const authUsername = document.getElementById('auth-username');
  const authPassword = document.getElementById('auth-password');
  const btnLogin = document.getElementById('btn-login');
  const loginBtnText = document.getElementById('login-btn-text');
  const loginSpinner = document.getElementById('login-spinner');
  const authError = document.getElementById('auth-error');
  const btnLogout = document.getElementById('btn-logout');
  const userEmailDisplay = document.getElementById('user-email-display');

  // Control Panel Elements
  const inpObsUrl = document.getElementById('inp-obs-url');
  const btnCopyObs = document.getElementById('btn-copy-obs');
  const copyBtnLabel = document.getElementById('copy-btn-label');

  const btnShowBanner = document.getElementById('btn-show-banner');
  const btnHideBanner = document.getElementById('btn-hide-banner');
  const liveStateTag = document.getElementById('live-state-tag');

  const txtTicker = document.getElementById('txt-ticker');
  const inpBadge = document.getElementById('inp-badge');
  const inpCategory = document.getElementById('inp-category');
  const btnPublish = document.getElementById('btn-publish');
  const btnTriggerSound = document.getElementById('btn-trigger-sound');
  const btnAddSeparator = document.getElementById('btn-add-separator');

  const rngSpeed = document.getElementById('rng-speed');
  const speedVal = document.getElementById('speed-val');
  const chkClock = document.getElementById('chk-clock');
  const chkSound = document.getElementById('chk-sound');
  const chkWeather = document.getElementById('chk-weather');
  const chkFinance = document.getElementById('chk-finance');
  const themeButtons = document.querySelectorAll('.theme-btn');
  const presetButtons = document.querySelectorAll('.preset-btn');

  const btnRefreshPreview = document.getElementById('btn-refresh-preview');
  const previewFrame = document.getElementById('preview-frame');
  const toast = document.getElementById('toast');

  const statusDot = document.getElementById('status-dot');
  const firebaseStatusText = document.getElementById('firebase-status-text');

  let currentTheme = 'theme-red';
  let isCurrentlyVisible = true;

  // Firebase References
  let db = null;
  let newsRef = null;
  let auth = null;

  function showToast(msg = "Haber bandı başarıyla güncellendi!") {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  function showAuthError(msg) {
    if (!authError) return;
    authError.textContent = msg;
    authError.style.display = 'block';
  }

  function hideAuthError() {
    if (!authError) return;
    authError.style.display = 'none';
  }

  function setLoginLoading(loading) {
    if (!btnLogin) return;
    if (loading) {
      btnLogin.disabled = true;
      if (loginBtnText) loginBtnText.textContent = 'Giriş Yapılıyor...';
      if (loginSpinner) loginSpinner.style.display = 'inline-block';
    } else {
      btnLogin.disabled = false;
      if (loginBtnText) loginBtnText.textContent = 'GİRİŞ YAP 🚀';
      if (loginSpinner) loginSpinner.style.display = 'none';
    }
  }

  function updateVisibilityUI(visible) {
    isCurrentlyVisible = !!visible;
    if (!liveStateTag) return;
    if (isCurrentlyVisible) {
      liveStateTag.className = 'state-tag state-visible';
      liveStateTag.textContent = '🟢 ŞU AN YAYINDA GÖRÜNÜYOR';
    } else {
      liveStateTag.className = 'state-tag state-hidden';
      liveStateTag.textContent = '🔴 GİZLİ (YAYINDA DEĞİL)';
    }
  }

  function populateForm(state) {
    if (!state) return;
    if (inpBadge && state.badgeText !== undefined && document.activeElement !== inpBadge) {
      inpBadge.value = state.badgeText;
    }
    if (inpCategory && state.categoryText !== undefined && document.activeElement !== inpCategory) {
      inpCategory.value = state.categoryText;
    }
    if (txtTicker && state.tickerText !== undefined && document.activeElement !== txtTicker) {
      txtTicker.value = state.tickerText;
    }
    if (rngSpeed && state.speed !== undefined) {
      rngSpeed.value = state.speed;
      if (speedVal) speedVal.textContent = state.speed + ' px/s';
    }
    if (state.visible !== undefined) {
      updateVisibilityUI(state.visible);
    }
    if (chkClock && state.showClock !== undefined) chkClock.checked = state.showClock;
    if (chkSound && state.soundEnabled !== undefined) chkSound.checked = state.soundEnabled;
    if (chkWeather && state.showWeather !== undefined) chkWeather.checked = state.showWeather;
    if (chkFinance && state.showFinance !== undefined) chkFinance.checked = state.showFinance;
    if (state.theme) {
      currentTheme = state.theme;
      themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === state.theme);
      });
    }
  }

  function getFormData() {
    const rawTicker = txtTicker ? txtTicker.value : '';
    const rawBadge = inpBadge ? inpBadge.value.trim() : 'SON DAKİKA';
    const rawCat = inpCategory ? inpCategory.value.trim() : 'KNGL HABER MERKEZİ';

    return {
      badgeText: rawBadge || 'SON DAKİKA',
      categoryText: rawCat || 'KNGL HABER MERKEZİ',
      tickerText: rawTicker,
      speed: rngSpeed ? Number(rngSpeed.value) : 60,
      theme: currentTheme,
      visible: isCurrentlyVisible,
      showClock: chkClock ? chkClock.checked : true,
      soundEnabled: chkSound ? chkSound.checked : true,
      showWeather: chkWeather ? chkWeather.checked : true,
      showFinance: chkFinance ? chkFinance.checked : true,
      logoType: 'kangal',
      lastUpdateTimestamp: Date.now()
    };
  }

  function handleTextUpdate(triggerAlert = true) {
    const payload = getFormData();
    if (triggerAlert) {
      payload.alertTimestamp = Date.now();
    }

    if (newsRef) {
      newsRef.update(payload)
        .then(() => {
          showToast('⚡ Yayındaki Haber Metni Güncellendi!');
        })
        .catch(err => {
          console.error('Firebase update error:', err);
          showToast('❌ Güncelleme hatası: ' + err.message);
        });
    } else {
      showToast('⚠️ Firebase veritabanı bağlantısı yok!');
    }
  }

  function setVisibility(visible) {
    updateVisibilityUI(visible);
    if (newsRef) {
      newsRef.update({ visible: visible, lastUpdateTimestamp: Date.now() })
        .then(() => {
          showToast(visible ? '🟢 Haber Bandı Yayına Sokuldu!' : '🔴 Haber Bandı Yayından Gizlendi!');
        })
        .catch(err => {
          showToast('❌ Hata: ' + err.message);
        });
    }
  }

  // ============================================================================
  // 🔒 FIREBASE AUTHENTICATION (KULLANICI ADI -> @kngl.com DÖNÜŞTÜRÜCÜ)
  // ============================================================================
  function initFirebaseAuth() {
    const cfg = window.FIREBASE_CONFIG;
    
    if (!cfg || !cfg.apiKey || cfg.apiKey.includes('BURAYA')) {
      showAuthError('⚠️ Firebase ayarları yapılmamış! Lütfen firebase-config.js dosyasını doldurunuz.');
      return;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(cfg);
      }
      auth = firebase.auth();
      db = firebase.database();
      newsRef = db.ref('kngl_breaking_news');

      auth.onAuthStateChanged(user => {
        if (user) {
          const username = user.email.split('@')[0];
          console.log('✅ [Auth] Kullanıcı doğrulandı:', username);
          if (authScreen) authScreen.style.display = 'none';
          if (appContainer) appContainer.style.display = 'block';
          if (userEmailDisplay) userEmailDisplay.textContent = username;
          
          connectRealtimeDatabase();
        } else {
          console.log('🔒 [Auth] Oturum kapalı.');
          if (authScreen) authScreen.style.display = 'flex';
          if (appContainer) appContainer.style.display = 'none';
        }
      });

    } catch (e) {
      console.error('Auth init error:', e);
      showAuthError('Firebase başlatma hatası: ' + e.message);
    }
  }

  function connectRealtimeDatabase() {
    if (!db || !newsRef) return;

    db.ref('.info/connected').on('value', snap => {
      if (snap.val() === true) {
        if (statusDot) statusDot.className = 'status-dot online';
        if (firebaseStatusText) firebaseStatusText.textContent = 'Firebase: 7/24 Canlı Bağlı';
      } else {
        if (statusDot) statusDot.className = 'status-dot offline';
        if (firebaseStatusText) firebaseStatusText.textContent = 'Firebase: Bağlantı Kesildi';
      }
    });

    newsRef.on('value', snap => {
      const val = snap.val();
      if (val) {
        populateForm(val);
      } else {
        newsRef.set(getFormData());
      }
    });
  }

  // Handle Login Form Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideAuthError();

      const rawInput = authUsername ? authUsername.value.trim().toLowerCase() : '';
      const password = authPassword ? authPassword.value : '';

      if (!rawInput || !password) {
        showAuthError('Lütfen kullanıcı adı ve şifrenizi giriniz.');
        return;
      }

      const formattedEmail = rawInput.includes('@') ? rawInput : `${rawInput}@kngl.com`;

      if (!auth) {
        showAuthError('Firebase Auth hazır değil. firebase-config.js dosyasını kontrol edin.');
        return;
      }

      setLoginLoading(true);

      auth.signInWithEmailAndPassword(formattedEmail, password)
        .then(() => {
          setLoginLoading(false);
          showToast('✅ Giriş başarılı! Yayın masası açıldı.');
        })
        .catch(err => {
          setLoginLoading(false);
          console.warn('Login error:', err);
          if (err.message && err.message.includes('CONFIGURATION_NOT_FOUND')) {
            if (authScreen) authScreen.style.display = 'none';
            if (appContainer) appContainer.style.display = 'block';
            if (userEmailDisplay) userEmailDisplay.textContent = rawInput || 'admin';
            connectRealtimeDatabase();
            showToast('🔓 Panele doğrudan bağlanıldı (Açık Veritabanı Modu)');
            return;
          }
          let errorMsg = 'Giriş başarısız: ' + err.message;
          if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
            errorMsg = 'Hatalı kullanıcı adı veya şifre girdiniz!';
          } else if (err.code === 'auth/invalid-email') {
            errorMsg = 'Kullanıcı adı formatı geçersiz!';
          } else if (err.code === 'auth/too-many-requests') {
            errorMsg = 'Çok fazla başarısız deneme. Lütfen biraz bekleyin.';
          } else if (err.code === 'auth/operation-not-allowed') {
            errorMsg = 'Firebase Console > Authentication bölümünden "Email/Password" seçeneğini etkinleştirin!';
          }
          showAuthError(errorMsg);
        });
    });
  }

  // Handle Bypass Auth
  const btnBypassAuth = document.getElementById('btn-bypass-auth');
  if (btnBypassAuth) {
    btnBypassAuth.onclick = function() {
      if (authScreen) authScreen.style.display = 'none';
      if (appContainer) appContainer.style.display = 'block';
      if (userEmailDisplay) userEmailDisplay.textContent = 'doğrudan/açık';
      connectRealtimeDatabase();
      showToast('🔓 Panele doğrudan bağlanıldı!');
    };
  }

  // Handle Logout
  if (btnLogout) {
    btnLogout.onclick = function() {
      if (confirm('Kontrol panelinden çıkış yapmak istediğinize emin misiniz?')) {
        auth.signOut().then(() => {
          showToast('🚪 Oturum kapatıldı.');
        });
      }
    };
  }

  // Control Panel Event Listeners
  if (btnPublish) {
    btnPublish.onclick = function(e) {
      if (e) e.preventDefault();
      handleTextUpdate(true);
    };
  }

  if (btnShowBanner) {
    btnShowBanner.onclick = function(e) {
      if (e) e.preventDefault();
      setVisibility(true);
    };
  }

  if (btnHideBanner) {
    btnHideBanner.onclick = function(e) {
      if (e) e.preventDefault();
      setVisibility(false);
    };
  }

  if (btnTriggerSound) {
    btnTriggerSound.onclick = function(e) {
      if (e) e.preventDefault();
      if (newsRef) {
        newsRef.update({ alertTimestamp: Date.now() })
          .then(() => showToast('🚨 Uyarı Jingle & Flaş Patlatıldı!'))
          .catch(err => showToast('Hata: ' + err.message));
      }
    };
  }

  // Ctrl + Enter Shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleTextUpdate(true);
    }
  });

  if (btnAddSeparator && txtTicker) {
    btnAddSeparator.onclick = function(e) {
      if (e) e.preventDefault();
      const curVal = txtTicker.value;
      txtTicker.value = curVal + (curVal.endsWith(' ') ? '' : ' ') + '++ ';
      txtTicker.focus();
    };
  }

  if (rngSpeed) {
    rngSpeed.addEventListener('input', () => {
      if (speedVal) speedVal.textContent = rngSpeed.value + ' px/s';
      if (newsRef) newsRef.update({ speed: Number(rngSpeed.value) });
    });
  }

  if (chkClock) {
    chkClock.addEventListener('change', () => {
      if (newsRef) newsRef.update({ showClock: chkClock.checked });
    });
  }

  if (chkSound) {
    chkSound.addEventListener('change', () => {
      if (newsRef) newsRef.update({ soundEnabled: chkSound.checked });
    });
  }

  if (chkWeather) {
    chkWeather.addEventListener('change', () => {
      if (newsRef) newsRef.update({ showWeather: chkWeather.checked });
      showToast(chkWeather.checked ? '☀️ Hava Durumu Modülü Açıldı' : '☀️ Hava Durumu Modülü Gizlendi');
    });
  }

  if (chkFinance) {
    chkFinance.addEventListener('change', () => {
      if (newsRef) newsRef.update({ showFinance: chkFinance.checked });
      showToast(chkFinance.checked ? '📈 Finans Modülü Açıldı' : '📈 Finans Modülü Gizlendi');
    });
  }

  themeButtons.forEach(btn => {
    btn.onclick = function(e) {
      if (e) e.preventDefault();
      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTheme = btn.dataset.theme;
      if (newsRef) newsRef.update({ theme: currentTheme });
      showToast('🎨 Tema güncellendi!');
    };
  });

  presetButtons.forEach(btn => {
    btn.onclick = function(e) {
      if (e) e.preventDefault();
      if (inpBadge) inpBadge.value = btn.dataset.badge;
      if (inpCategory) inpCategory.value = btn.dataset.cat;
      if (txtTicker) txtTicker.value = btn.dataset.news;
      handleTextUpdate(true);
      showToast(`⚡ "${btn.dataset.badge}" Şablonu Yüklendi!`);
    };
  });

  if (btnCopyObs && inpObsUrl) {
    btnCopyObs.onclick = function(e) {
      if (e) e.preventDefault();
      const text = inpObsUrl.value;
      navigator.clipboard.writeText(text).then(() => {
        if (copyBtnLabel) copyBtnLabel.textContent = 'Kopyalandı! ✅';
        setTimeout(() => { if (copyBtnLabel) copyBtnLabel.textContent = 'Kopyala 📋'; }, 2000);
        showToast('OBS Yayın linki panoya kopyalandı!');
      }).catch(() => {
        prompt('OBS Browser Source için bu linki kopyalayın:', text);
      });
    };
  }

  if (btnRefreshPreview && previewFrame) {
    btnRefreshPreview.onclick = function(e) {
      if (e) e.preventDefault();
      previewFrame.src = 'overlay.html?t=' + Date.now();
    };
  }

  function setupObsUrl() {
    if (!inpObsUrl) return;
    let baseUrl = window.location.href.split('#')[0].split('?')[0];
    if (baseUrl.endsWith('index.html')) {
      baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
    } else if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
    inpObsUrl.value = baseUrl + '/overlay.html';
  }

  // Initialize
  setupObsUrl();
  initFirebaseAuth();

})();