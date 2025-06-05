import HomePresenter from './home-presenter.js';

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter(this);
  }

  async render() {
    return `
      <section class="hero-banner">
        <div class="hero-content">
          <h1>Bagikan Cerita Menarikmu</h1>
          <p>Unggah pengalamanmu dan lihat cerita dari orang lain di seluruh dunia!</p>
          <a href="#/addStory" class="hero-button">+ Tambah Cerita</a>
        </div>
      </section>
      <section id="feed-container"></section>
      <div id="map-modal" class="map-modal hidden">
        <div class="map-modal-content">
          <span class="map-modal-close">&times;</span>
          <div id="modal-map" style="height: 300px; border-radius: 8px;"></div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.feedContainer = document.querySelector('#feed-container');
    this.presenter.loadStories();
    this._initModalEvents();

    this.feedContainer.addEventListener('click', async (e) => {
      if (e.target.classList.contains('bookmark-btn')) {
        const id = e.target.dataset.id;
        const story = this.presenter.getStoryById(id);
        if (story) {
          await this.presenter.saveBookmark(story);
          alert('Cerita disimpan untuk offline!');
        }
      }
    });
  }

  showStories(stories) {
    this.feedContainer.innerHTML = '';
    stories.forEach((story) => this.addStoryToFeed(story));
  }

  addStoryToFeed(story) {
    const storyHTML = `
      <article class="feed-card">
        <div class="feed-header">
          <img src="https://i.pravatar.cc/40?u=${
            story.name
          }" class="profile-pic" />
          <div>
            <strong>@${story.name}</strong>
            <p class="feed-date">${new Date(story.createdAt).toLocaleDateString(
              'id-ID',
              {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }
            )}</p>
            <p class="feed-id">ID Cerita: ${story.id}</p>
          </div>
        </div>
        <p class="feed-text">${story.description}</p>
        <img src="${story.photoUrl}" alt="Post dari ${
      story.name
    }" class="feed-image" />
        ${
          story.lat && story.lon
            ? `<button class="show-map-button" data-lat="${story.lat}" data-lon="${story.lon}" data-name="${story.name}" data-description="${story.description}" data-time="${story.createdAt}">Lihat Lokasi</button>`
            : ''
        }
        <button class="bookmark-btn" data-id="${story.id}">🔖 Simpan</button>
      </article>
    `;
    this.feedContainer.insertAdjacentHTML('afterbegin', storyHTML);
  }

  showError(message) {
    this.feedContainer.innerHTML = `<p style="color:red">${message}</p>`;
  }

  _initModalEvents() {
    const modal = document.querySelector('#map-modal');
    const closeModal = document.querySelector('.map-modal-close');
    let modalMap = null;

    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('show-map-button')) {
        const lat = parseFloat(event.target.dataset.lat);
        const lon = parseFloat(event.target.dataset.lon);
        const name = event.target.dataset.name;
        const description = event.target.dataset.description;
        const time = new Date(event.target.dataset.time).toLocaleString(
          'id-ID'
        );

        modal.classList.remove('hidden');

        if (modalMap) {
          modalMap.remove();
        }

        modalMap = L.map('modal-map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(modalMap);

        L.marker([lat, lon])
          .addTo(modalMap)
          .bindPopup(
            `<strong>${name}</strong><br/>${description}<br/><em>${time}</em>`
          )
          .openPopup();
      }
    });

    closeModal.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }
}
