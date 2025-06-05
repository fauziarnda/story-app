import StoryModel from '../../api/story-model.js';
import AddStoryPresenter from '../addStory/add-story-presenter.js';

export default class AddStoryPage {
  constructor() {
    this.presenter = new AddStoryPresenter(this, StoryModel);
    this.lat = null;
    this.lon = null;
    this.capturedBlob = null;
    this.stream = null;
  }

  async render() {
    return `
      <section class="create-story-page">
      <h2>Tambah Cerita Baru</h2>
      <form id="storyForm" class="story-form">
        <label for="storyDesc">Deskripsi:</label>
        <textarea id="storyDesc" name="storyDesc" class="story-desc" required></textarea>

        <label for="cameraStream">Ambil Gambar dari Kamera:</label>
        <video id="cameraStream" class="camera-stream" autoplay playsinline></video>

        <canvas id="snapshot" hidden></canvas>
        <img id="previewImage" class="preview-image" alt="Preview hasil kamera" hidden />
        <button type="button" id="captureBtn" class="capture-btn">Ambil Gambar</button>

        <label for="fileInput">Atau Pilih Gambar dari Galeri:</label>
        <input type="file" id="fileInput" name="fileInput" class="file-input" accept="image/*" />
        <img id="previewFile" class="preview-image" alt="Preview file dari galeri" hidden />

        <label for="map">Pilih Lokasi di Peta:</label>
        <div id="map"></div>
        <p>
          Lat: <span id="latText" class="lat-text">-</span>,
          Lon: <span id="lonText" class="lon-text">-</span>
        </p>

        <button type="submit" class="submit-story">Kirim Cerita</button>
        <p id="storyMessage"></p>
      </form>
    </section>
    `;
  }

  async afterRender() {
    document.querySelector("#storyForm button[type='submit']").disabled = true;

    const video = document.getElementById('cameraStream');
    const canvas = document.getElementById('snapshot');
    const captureBtn = document.getElementById('captureBtn');
    const previewImage = document.getElementById('previewImage');
    const previewFile = document.getElementById('previewFile');
    const fileInput = document.getElementById('fileInput');

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.stream;

      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });
    } catch (err) {
      this.showError('Tidak bisa mengakses kamera: ' + err.message);
    }

    captureBtn.addEventListener('click', () => {
      const submitBtn = document.querySelector(
        "#storyForm button[type='submit']"
      );
      submitBtn.disabled = true;

      const ctx = canvas.getContext('2d');
      const width = video.videoWidth;
      const height = video.videoHeight;

      if (width === 0 || height === 0) {
        this.showError(
          'Kamera belum siap. Coba tunggu sebentar lalu tekan lagi.'
        );
        console.warn('⚠️ Kamera belum ready, width atau height = 0');
        return;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        console.log('📸 toBlob callback terpicu', blob);
        if (blob) {
          this.capturedBlob = blob; // ← INI SEKARANG BEKERJA
          console.log('📸 Gambar dari kamera di-set:', blob);

          previewImage.src = URL.createObjectURL(blob);
          previewImage.hidden = false;
          previewFile.hidden = true;

          submitBtn.disabled = false;
        } else {
          this.showError('Gagal mengambil gambar dari kamera.');
        }
      }, 'image/jpeg');
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      console.log('🖼️ File input terdeteksi:', file);
      if (file) {
        this.capturedBlob = file;
        console.log('🖼️ Gambar dari galeri di-set:', file);
        console.log('🧪 instance of File:', file instanceof File);
        console.log('🧪 instance of Blob:', file instanceof Blob);

        previewFile.src = URL.createObjectURL(file);
        previewFile.hidden = false;
        previewImage.hidden = true;

        document.querySelector(
          "#storyForm button[type='submit']"
        ).disabled = false;
      } else {
        console.warn('⚠️ Tidak ada file dipilih');
      }
    });

    const map = L.map('map').setView([-7.9797, 112.6304], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    let marker;
    map.on('click', (e) => {
      this.lat = e.latlng.lat;
      this.lon = e.latlng.lng;
      document.getElementById('latText').textContent = this.lat.toFixed(5);
      document.getElementById('lonText').textContent = this.lon.toFixed(5);

      if (marker) marker.setLatLng(e.latlng);
      else marker = L.marker(e.latlng).addTo(map);
    });

    document.getElementById('storyForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const description = document.getElementById('storyDesc').value.trim();
      const photo = this.capturedBlob;

      // ✅ DEBUGGING
      console.log('📸 Submit Debug:');
      console.log('Description:', description);
      console.log('CapturedBlob:', photo);
      console.log('Type:', photo?.type);
      console.log('Size:', photo?.size);
      console.log('Instance of Blob:', photo instanceof Blob);

      if (!photo || photo.size === 0 || !photo.type?.startsWith('image/')) {
        this.showError(
          'Silakan ambil gambar yang valid dari kamera atau galeri.'
        );
        return;
      }

      this.presenter.handleSubmit({
        description,
        photo,
        lat: this.lat,
        lon: this.lon,
      });

      this.stream?.getTracks()?.forEach((track) => track.stop());
    });
  }

  showLoading(isLoading) {
    document.querySelector("#storyForm button[type='submit']").disabled =
      isLoading;
  }

  showSuccess(message) {
    const msg = document.getElementById('storyMessage');
    msg.textContent = message;
    msg.style.color = 'green';
  }

  showError(message) {
    const msg = document.getElementById('storyMessage');
    msg.textContent = message;
    msg.style.color = 'red';
  }

  redirectToHome() {
    window.location.hash = '/';
  }
}
