import StoryModel from '../../api/story-model.js';

export default class AddStoryPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async handleSubmit({ description, photo, lat, lon }) {
    console.log('HANDLE SUBMIT:', { description, photo, lat, lon });
    if (!description || !photo) {
      this.view.showError('Deskripsi dan gambar wajib diisi.');
      return;
    }

    this.view.showLoading(true);

    try {
      await this.model.addNewStory({ description, photo, lat, lon });
      this.view.showSuccess('Cerita berhasil dikirim!');
      this.view.redirectToHome();
    } catch (error) {
      this.view.showError('Gagal mengirim cerita: ' + error.message);
    } finally {
      this.view.showLoading(false);
    }
  }
}
