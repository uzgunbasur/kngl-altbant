const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'news-state.json');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const DEFAULT_STATE = {
  badgeText: "SON DAKİKA",
  categoryText: "KNGL HABER MERKEZİ",
  tickerText: "KICK CANLI YAYININA HOŞ GELDİNİZ! ++ TAKİP ETMEYİ VE BİLDİRİMLERİ AÇMAYI UNUTMAYIN! ++ YENİ ÇEKİLİŞ VE ÖDÜLLÜ TURNUVA BU AKŞAM CANLI YAYINDA!",
  speed: 60,
  theme: "theme-red",
  visible: true,
  showClock: true,
  soundEnabled: true,
  logoType: "kangal",
  customLogoUrl: ""
};

function loadState() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return { ...DEFAULT_STATE, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('[Error] Veri okuma hatasi:', err.message);
  }
  return { ...DEFAULT_STATE };
}

function saveState(state) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Error] Veri kayit hatasi:', err.message);
  }
}

let currentState = loadState();

// Routes
app.get(['/overlay', '/yayin'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'overlay.html'));
});

app.get(['/', '/control', '/admin', '/panel'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/state', (req, res) => {
  res.json(currentState);
});

app.get('/api/info', (req, res) => {
  const ip = getLocalIpAddress();
  res.json({
    localIp: ip,
    port: PORT,
    localOverlayUrl: `http://localhost:${PORT}/overlay`,
    remoteOverlayUrl: `http://${ip}:${PORT}/overlay`,
    localControlUrl: `http://localhost:${PORT}/control`,
    remoteControlUrl: `http://${ip}:${PORT}/control`
  });
});

app.post('/api/state', (req, res) => {
  currentState = { ...currentState, ...req.body };
  saveState(currentState);
  broadcast({
    type: 'STATE_UPDATE',
    payload: currentState,
    triggerAlert: req.body.triggerAlert || false
  });
  res.json({ success: true, state: currentState });
});

let overlayClients = new Set();
let adminClients = new Set();

function getStats() {
  return {
    overlayCount: overlayClients.size,
    adminCount: adminClients.size,
    totalConnections: wss.clients.size
  };
}

function broadcast(message, filter = null) {
  const data = typeof message === 'string' ? message : JSON.stringify(message);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      if (!filter || filter(client)) {
        client.send(data);
      }
    }
  });
}

wss.on('connection', (ws, req) => {
  const url = req.url || '';
  const isOverlay = url.includes('type=overlay');
  
  if (isOverlay) {
    overlayClients.add(ws);
  } else {
    adminClients.add(ws);
  }

  ws.send(JSON.stringify({
    type: 'INIT_STATE',
    payload: currentState,
    stats: getStats(),
    networkInfo: {
      localIp: getLocalIpAddress(),
      port: PORT
    }
  }));

  broadcast({
    type: 'STATS_UPDATE',
    stats: getStats()
  }, client => adminClients.has(client));

  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      
      if (data.type === 'UPDATE_STATE') {
        currentState = { ...currentState, ...data.payload };
        saveState(currentState);
        broadcast({
          type: 'STATE_UPDATE',
          payload: currentState,
          triggerAlert: data.triggerAlert || false
        });
      } else if (data.type === 'SET_VISIBILITY') {
        currentState.visible = !!data.payload.visible;
        saveState(currentState);
        broadcast({
          type: 'STATE_UPDATE',
          payload: currentState
        });
      } else if (data.type === 'UPDATE_TICKER') {
        currentState.tickerText = data.payload.tickerText || '';
        if (data.payload.badgeText) currentState.badgeText = data.payload.badgeText;
        if (data.payload.categoryText) currentState.categoryText = data.payload.categoryText;
        saveState(currentState);
        broadcast({
          type: 'STATE_UPDATE',
          payload: currentState,
          triggerAlert: data.triggerAlert !== false
        });
      } else if (data.type === 'TRIGGER_ALERT') {
        broadcast({
          type: 'PLAY_ALERT',
          payload: data.payload || {}
        });
      } else if (data.type === 'REQUEST_STATE') {
        ws.send(JSON.stringify({
          type: 'STATE_UPDATE',
          payload: currentState
        }));
      }
    } catch (err) {
      console.error('[WS Error] Mesaj hatasi:', err.message);
    }
  });

  ws.on('close', () => {
    overlayClients.delete(ws);
    adminClients.delete(ws);
    broadcast({
      type: 'STATS_UPDATE',
      stats: getStats()
    }, client => adminClients.has(client));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIpAddress();
  console.log('================================================================');
  console.log('🔥 KNGL SON DAKIKA HABER BANDI (OBS & KICK CANLI YAYIN SERVISI) 🔥');
  console.log('----------------------------------------------------------------');
  console.log('🎮 [KONTROL PANELİ] (Bu bilgisayar) : http://localhost:' + PORT + '/control');
  console.log('📱 [UZAKTAN KONTROL] (Ağdaki cihaz) : http://' + ip + ':' + PORT + '/control');
  console.log('----------------------------------------------------------------');
  console.log('📺 [OBS YAYIN EKRANI] (Yerel OBS)   : http://localhost:' + PORT + '/overlay');
  console.log('🌐 [OBS YAYIN EKRANI] (Ağdaki OBS)  : http://' + ip + ':' + PORT + '/overlay');
  console.log('================================================================');
});