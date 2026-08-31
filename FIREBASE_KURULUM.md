# 🔥 Firebase Realtime Database & Kullanıcı Adı Girişi Rehberi

Sistem; sunucuya ihtiyaç duymadan GitHub Pages üzerinde 7/24 çalışır. Giriş ekranında e-posta karmaşası olmadan **sadece kullanıcı adınızla (Örn: `uzgunbasur`)** giriş yapabilirsiniz.

---

## 📌 Adım 1: Firebase Console'da Authentication'ı Aktif Edin
1. [Firebase Console](https://console.firebase.google.com/) adresine gidin ve projenizi seçin.
2. Sol menüden **Oluştur (Build)** > **Authentication** bölümüne gidin.
3. **Sign-in method (Oturum Açma Yöntemi)** sekmesinden **Email/Password (E-posta/Şifre)** seçeneğini etkinleştirip kaydedin.

---

## 📌 Adım 2: Kullanıcı Adınızı Tanımlayın
1. **Users (Kullanıcılar)** sekmesine geçin ve **Add user (Kullanıcı ekle)** butonuna basın:
   - **Email:** `kullaniciadiniz@kngl.com` (Örneğin: `uzgunbasur@kngl.com`)
   - **Password:** Belirleyeceğiniz şifre (Örneğin: `kngl2026!`)
2. **Kullanıcı ekle** diyerek kaydedin.

> 💡 **Nasıl Çalışır?** Giriş ekranında sen sadece `uzgunbasur` yazarsın, arka plandaki JavaScript kodu gizlice `@kngl.com` uzantısını ekleyerek Firebase'e doğrulatır.

---

## 📌 Adım 3: `firebase-config.js` Dosyasını Doldurun
Projenizdeki **[`firebase-config.js`](firebase-config.js)** dosyasını açıp Firebase Console > Proje Ayarları bölümünden aldığınız bilgileri yapıştırın:

```javascript
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyD-SENIN-API-KEYIN",
  authDomain: "projen.firebaseapp.com",
  databaseURL: "https://projen-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "projen",
  storageBucket: "projen.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## 🚀 Giriş Yapma & Kullanım:

1. **Kontrol Paneli:** `https://kullaniciadiniz.github.io/projeniz/index.html`
   - **Kullanıcı Adı:** `uzgunbasur` *(veya belirlediğin kullanıcı adı)*
   - **Şifre:** `kngl2026!`
   - Giriş başarılı olduğunda Kangal logolu panel anında açılır!

2. **OBS Yayın Ekranı (Şeffaf Link):**
   `https://kullaniciadiniz.github.io/projeniz/overlay.html`
   - OBS Browser Source'a 1920x1080 eklenir, giriş istemez.