import StoryDB from '../../data/database.js';

export default class BookmarkPage {
  constructor() {}

  async render() {
    return `
      <section class="hero-banner">
        <div class="hero-content">
          <h1>Cerita Disimpan</h1>
          <p>Berikut cerita-cerita yang sudah kamu simpan untuk dibaca offline.</p>
        </div>
      </section>
      <section id="bookmark-feed"></section>
    `;
  }

  async afterRender() {
    this.feedContainer = document.querySelector('#bookmark-feed');
    const stories = await StoryDB.getAll();

    if (stories.length === 0) {
      this.feedContainer.innerHTML = '<p>Tidak ada cerita yang disimpan.</p>';
      return;
    }

    this.showStories(stories);
  }

  showStories(stories) {
    this.feedContainer.innerHTML = '';
    stories.forEach((story) => {
      const storyHTML = `
      <article class="feed-card" data-id="${story.id}">
        <div class="feed-header">
          <img src="https://i.pravatar.cc/40?u=${
            story.name
          }" class="profile-pic" />
          <div>
            <strong>@${story.name}</strong>
            <p class="feed-date">${new Date(story.createdAt).toLocaleDateString(
              'id-ID'
            )}</p>
            <p class="feed-id">ID Cerita: ${story.id}</p>
          </div>
          </div>
          <p class="feed-text">${story.description}</p>
          <img src="${story.photoUrl}" alt="Post dari ${
        story.name
      }" class="feed-image" />
        <button class="delete-btn" aria-label="Hapus cerita">hapus 🗑️</button>
      </article>
    `;
      this.feedContainer.insertAdjacentHTML('beforeend', storyHTML);
    });

    // Pasang event listener untuk tombol hapus
    this.feedContainer.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        const card = event.target.closest('.feed-card');
        const id = card.dataset.id;

        if (confirm('Yakin ingin menghapus cerita ini?')) {
          await StoryDB.delete(id);
          // Hapus elemen dari DOM
          card.remove();

          // Jika tidak ada cerita tersisa, tampilkan pesan
          if (this.feedContainer.children.length === 0) {
            this.feedContainer.innerHTML =
              '<p>Tidak ada cerita yang disimpan.</p>';
          }
        }
      });
    });
  }
}
