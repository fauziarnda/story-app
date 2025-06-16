# 📖 Story App

**Story App** adalah aplikasi web interaktif berbasis Progressive Web App (PWA) yang memungkinkan pengguna untuk berbagi cerita dalam bentuk teks dan gambar, lengkap dengan fitur lokasi dan notifikasi. Dibangun menggunakan arsitektur **Model-View-Presenter (MVP)**, aplikasi ini mengadopsi pendekatan **Single Page Application (SPA)** dengan dukungan **offline mode** melalui IndexedDB.

🌐 Coba langsung aplikasinya di: [appstoriez.netlify.app](https://appstoriez.netlify.app/)

---

## 🚀 Fitur Utama

- 🔐 **Register & Login**
- 📷 **Posting cerita** (upload/ambil gambar)
- 📍 **Menambahkan lokasi** ke cerita
- 📜 **Melihat daftar cerita**
- 📬 **Subscribe Push Notification**
- ⚙️ **Offline Mode** dengan IndexedDB
- 📱 **Installable** sebagai PWA

---

## 🧰 Teknologi yang Digunakan

- **Bahasa:** JavaScript (ES6+), HTML5, CSS3
- **Framework & Tools:**
  - Webpack
  - IndexedDB (idb)
  - Workbox (untuk Service Worker & Caching)
- **Build Tools:** Webpack, http-server
- **Deployment:** Netlify

---

## ▶️ Cara Menjalankan Proyek

### 1. Clone repositori

```bash
git clone https://github.com/username/story-app.git
cd story-app
```
### 2. Instalasi dependensi

```bash
npm install
```
### 3. Jalankan secara lokal

```bash
npm run start-dev
```
### 4. Build untuk produksi
```bash
npm run build
npm run serve
```
