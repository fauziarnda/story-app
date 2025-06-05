import StoryModel from '../../api/story-model.js';
import StoryDB from '../../data/database.js';

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this._stories = [];
  }

  async loadStories() {
    try {
      const stories = await StoryModel.getAllStories({ location: 1 });
      this._stories = stories; // ← Simpan ke properti
      this.view.showStories(stories);
    } catch (error) {
      this.view.showError('Gagal memuat cerita: ' + error.message);
    }
  }

  async addStory({ description, photo }) {
    try {
      await StoryModel.addNewStory({ description, photo });

      this.view.onStoryPostedSuccess('Cerita berhasil dibagikan!');
      const [newStory] = await StoryModel.getAllStories({
        page: 1,
        size: 1,
        location: 1,
      });
      this.view.addStoryToFeed(newStory);
    } catch (error) {
      this.view.showError('Gagal mengirim cerita: ' + error.message);
    }
  }

  getStoryById(id) {
    if (!this._stories) return null;
    return this._stories.find((story) => story.id === id);
  }

  async saveBookmark(story) {
    await StoryDB.add(story);
  }

  async loadBookmarks() {
    const offlineStories = await StoryDB.getAll();
    this.view.showStories(offlineStories);
  }
}
