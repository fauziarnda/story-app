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
        <article class="feed-card">
          <div class="feed-header">
            <img src="https://i.pravatar.cc/40?u=${
              story.name
            }" class="profile-pic" />
            <div>
              <strong>@${story.name}</strong>
              <p class="feed-date">${new Date(
                story.createdAt
              ).toLocaleDateString('id-ID')}</p>
              <p class="feed-id">ID Cerita: ${story.id}</p>
            </div>
          </div>
          <p class="feed-text">${story.description}</p>
          <img src="${story.photoUrl}" alt="Post dari ${
        story.name
      }" class="feed-image" />
        </article>
      `;
      this.feedContainer.insertAdjacentHTML('beforeend', storyHTML);
    });
  }
}
